from itertools import product
from logging import raiseExceptions
import logging

from django.contrib.auth.models import User
from django.core.serializers import serialize
from rest_framework import viewsets, generics, status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action, permission_classes
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Product, Favorite, Comment
from .serializers import *

logger = logging.getLogger(__name__)

class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint для управления продуктами.
    
    list:
    Получить список всех продуктов.
    
    create:
    Создать новый продукт (только для администраторов).
    
    retrieve:
    Получить детальную информацию о продукте.
    
    update:
    Обновить продукт (только для администраторов).
    
    partial_update:
    Частично обновить продукт (только для администраторов).
    
    destroy:
    Удалить продукт (только для администраторов).
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['create','update','partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    @swagger_auto_schema(
        operation_description="Создание нового продукта",
        request_body=ProductSerializer,
        responses={
            201: ProductSerializer,
            403: "Доступ запрещен"
        }
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @swagger_auto_schema(
        operation_description="Добавить/удалить продукт из избранного",
        responses={
            201: openapi.Response(description="Продукт добавлен в избранное"),
            204: openapi.Response(description="Продукт удален из избранного"),
            401: "Требуется авторизация"
        }
    )
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def favorite(self, request, pk=None):
        product = self.get_object()
        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            product=product
        )
        if created:
            return Response({'status': 'Added to favorites'}, status=status.HTTP_201_CREATED)
        else:
            Favorite.objects.filter(user=request.user, product=product).delete()
            return Response({'status':'removed from favorites'}, status=status.HTTP_204_NO_CONTENT)

class RegisterView(generics.CreateAPIView):
    """
    API endpoint для регистрации новых пользователей.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = []

    @swagger_auto_schema(
        operation_description="Регистрация нового пользователя",
        request_body=RegisterSerializer,
        responses={
            201: openapi.Response(description="Пользователь успешно зарегистрирован"),
            400: "Неверные данные"
        }
    )
    def create(self, request, *args, **kwargs):
        logger.info(f"Registration attempt with data: {request.data}")
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            return Response({
                "message": "User registered successfully. Please login."
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            logger.error(f"Validation errors: {serializer.errors if 'serializer' in locals() else 'No serializer'}")
            raise

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Favorite.objects.none()
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @swagger_auto_schema(
        operation_description="Получить список избранных товаров текущего пользователя",
        responses={
            200: ProductFavoriteSerializer(many=True),
            401: "Требуется авторизация"
        }
    )
    @action(detail=False, methods=['get'])
    def my_favorites(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        products = [fav.product for fav in favorites]
        serializer = ProductFavoriteSerializer(products, many=True)
        return Response(serializer.data)

class CommentViewSet(viewsets.ModelViewSet):
    """
    API endpoint для управления комментариями к продуктам.
    
    list:
    Получить список комментариев для продукта.
    
    create:
    Создать новый комментарий (требуется авторизация).
    
    retrieve:
    Получить детальную информацию о комментарии.
    
    update:
    Обновить свой комментарий.
    
    partial_update:
    Частично обновить свой комментарий.
    
    destroy:
    Удалить свой комментарий.
    """
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Comment.objects.none()
        product_id = self.request.query_params.get('product_id', None)
        if product_id:
            return Comment.objects.filter(product_id=product_id)
        return Comment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsOwnerOrReadOnly()]
        return [IsAuthenticated()]

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Разрешение на изменение только своих комментариев.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user

class CurrentUserView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email
        })

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        logger.info(f"Token obtain attempt with data: {request.data}")
        try:
            response = super().post(request, *args, **kwargs)
            logger.info("Token obtained successfully")
            return response
        except Exception as e:
            logger.error(f"Token obtain error: {str(e)}")
            raise