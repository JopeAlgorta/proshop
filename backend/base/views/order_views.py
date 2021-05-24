from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from ..models import Product, Order, OrderItem, ShippingAddress
from ..serializers import ProductSerializer, OrderSerializer
from datetime import datetime


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def createOrGetOrders(request):
    user = request.user

    if request.method == 'POST':
        data = request.data

        orderItems = data['orderItems']

        if not orderItems or len(orderItems) == 0:
            return Response({'detail': 'No order items.'}, status.HTTP_400_BAD_REQUEST)

        # Create order.
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )

        # Create shipping address.
        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country']
        )

        # Create order items and link them to an order.
        for item in orderItems:
            product = get_object_or_404(Product, id=item['product'])
            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=item['qty'],
                price=product.price,
                image=product.image.url
            )

            # Update stock.
            product.countInStock -= item.qty
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

    if request.method == 'GET':
        orders = user.orders.all()
        serializer = OrderSerializer(orders, many=True)

        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    page = request.query_params.get('page', 1)
    paginator = Paginator(orders, 10)

    try:
        orders = paginator.page(page)
    except PageNotAnInteger:
        orders = paginator.page(1)
        page = 1
    except EmptyPage:
        orders = paginator.page(paginator.num_pages)
        page = paginator.num_pages

    serializer = OrderSerializer(orders, many=True)
    return Response({'page': int(page), 'pages': paginator.num_pages, 'orders': serializer.data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    order = get_object_or_404(Order, id=pk)

    if user.is_staff or order.user == user:
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

    return Response({'detail': 'You are not alowed to see this order.'}, status.HTTP_403_FORBIDDEN)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = get_object_or_404(Order, id=pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response('Order was paid successfully.')


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToDeliver(request, pk):
    order = get_object_or_404(Order, id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()

    return Response('Order was delivered successfully.')
