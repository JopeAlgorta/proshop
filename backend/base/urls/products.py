from django.urls import path
from ..views import product_views as views


urlpatterns = [
    path('', views.getProductsOrCreateOne, name='products'),
    path('<str:pk>/', views.showUpdateOrDeleteProduct, name='product'),
    path('<str:pk>/image/', views.uploadImage, name='upload_image'),
]
