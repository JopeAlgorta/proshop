from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.exceptions import PermissionDenied, NotAuthenticated
from ..models import Product
from ..serializers import ProductSerializer


@api_view(['GET', 'POST'])
def getProductsOrCreateOne(request):
    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    if not request.user:
        raise NotAuthenticated

    if not request.user.is_staff:
        raise PermissionDenied

    if request.method == 'POST':
        user = request.user
        data = request.data
        serializer = ProductSerializer(data=data, many=False)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def showUpdateOrDeleteProduct(request, pk):
    product = get_object_or_404(Product, id=pk)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    if not request.user:
        raise NotAuthenticated
    if not request.user.is_staff:
        raise PermissionDenied

    if request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    if request.method == 'PUT':
        data = request.data

        product.name = data['name'] if 'name' in data else product.name
        product.brand = data['brand'] if 'brand' in data else product.brand
        product.category = data['category'] if 'category' in data else product.category
        product.rating = data['rating'] if 'rating' in data else product.rating
        product.description = data['description'] if 'description' in data else product.description
        product.countInStock = data['countInStock'] if 'countInStock' in data else product.countInStock
        product.price = data['price'] if 'price' in data else product.price
        product.image = data['image'] if 'image' in data else product.image
        product.save()

        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def uploadImage(request, pk):
    product = get_object_or_404(Product, id=pk)

    product.image = request.FILES.get('image')
    product.save()

    return Response('Image uploaded successfully.')
