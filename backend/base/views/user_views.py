from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from ..models import User
from ..serializers import UserSerializer, UserSerializerWithToken


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
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
