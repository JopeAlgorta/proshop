from django.urls import path
from ..views import product_views as views


urlpatterns = [
    path('', views.getProducts, name='products'),
    path('<str:pk>/', views.showProduct, name='product'),
]
