from django.urls import path
from ..views import order_views as views


urlpatterns = [
    path('', views.addOrderItems, name='order'),
    path('<str:pk>/', views.getOrderById, name='show_order'),
]
