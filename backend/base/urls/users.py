from django.urls import path
from ..views import user_views as views


urlpatterns = [
    path('', views.getUsers, name='users'),
    path('signup/', views.signupUser, name='register_user'),
    path('login/', views.MyTokenObtainPairView.as_view(), name='login_user'),
    path('profile/', views.getOrUpdateUserProfile, name='user_profile')
]
