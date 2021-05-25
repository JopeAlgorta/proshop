from django.urls import path
from ..views import order_views as views


urlpatterns = [
    path('', views.createOrGetOrders, name='order'),
    path('admin/', views.getOrders, name='get_orders_admin'),
    path('<str:pk>/', views.getOrderById, name='show_order'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay_order'),
    path('<str:pk>/deliver/', views.updateOrderToDeliver, name='deliver_order'),
]
