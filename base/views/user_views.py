from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from ..models import User
from ..serializers import UserSerializer, UserSerializerWithToken
from django.shortcuts import get_object_or_404


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        # This is deleted as no refresh token logic is done.
        del data['refresh']

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def signupUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except KeyError as e:
        return Response({'detail': f'Field {e} is required.'}, status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Email already in use.'}, status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def getOrUpdateUserProfile(request):
    user = request.user

    if request.method == 'GET':
        serializer = UserSerializer(user, many=False)

    if request.method == 'PUT':
        serializer = UserSerializerWithToken(user, many=False)

        data = request.data
        user.first_name = data['name'] if 'name' in data else user.first_name
        user.email = data['email'] if 'email' in data else user.email
        user.username = data['email'] if 'email' in data else user.username

        if 'password' in data and data['password'] != '':
            user.password = make_password(data['password'])

        user.save()

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all().order_by('-id')
    page = request.query_params.get('page', 1)
    paginator = Paginator(users, 10)

    try:
        users = paginator.page(page)
    except PageNotAnInteger:
        users = paginator.page(1)
        page = 1
    except EmptyPage:
        users = paginator.page(paginator.num_pages)
        page = paginator.num_pages

    serializer = UserSerializer(users, many=True)
    return Response({'page': int(page), 'pages': paginator.num_pages, 'users': serializer.data})


@api_view(['DELETE', 'PUT', 'GET'])
@permission_classes([IsAdminUser])
def updateGetOrDeleteUser(request, pk):
    user = get_object_or_404(User, id=pk)

    if request.method == 'GET':
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)

    if request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    if request.method == 'PUT':
        data = request.data

        user.first_name = data['name'] if 'name' in data else user.first_name
        user.email = data['email'] if 'email' in data else user.email
        user.username = data['email'] if 'email' in data else user.username
        user.is_staff = data['isAdmin'] if 'isAdmin' in data else user.is_staff
        user.save()

        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
