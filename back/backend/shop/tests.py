from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal

from .models import Product, Favorite
from .serializers import ProductSerializer, FavoriteSerializer

class ProductModelTest(TestCase):
    def setUp(self):
        self.product_data = {
            'name': 'Test Product',
            'description': 'Test Description',
            'price': Decimal('99.99'),
            'image': 'test.jpg'
        }
        self.product = Product.objects.create(**self.product_data)

    def test_product_creation(self):
        self.assertEqual(self.product.name, self.product_data['name'])
        self.assertEqual(self.product.description, self.product_data['description'])
        self.assertEqual(self.product.price, self.product_data['price'])
        self.assertEqual(self.product.image, self.product_data['image'])

    def test_product_str(self):
        self.assertEqual(str(self.product), self.product_data['name'])

class FavoriteModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.product = Product.objects.create(
            name='Test Product',
            description='Test Description',
            price=Decimal('99.99'),
            image='test.jpg'
        )
        self.favorite = Favorite.objects.create(
            user=self.user,
            product=self.product
        )

    def test_favorite_creation(self):
        self.assertEqual(self.favorite.user, self.user)
        self.assertEqual(self.favorite.product, self.product)

    def test_favorite_str(self):
        expected_str = f'{self.user.username} - {self.product.name}'
        self.assertEqual(str(self.favorite), expected_str)

class ProductAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@test.com',
            password='admin123'
        )
        self.regular_user = User.objects.create_user(
            username='user',
            email='user@test.com',
            password='user123'
        )
        self.product = Product.objects.create(
            name='Test Product',
            description='Test Description',
            price=Decimal('99.99'),
            image='test.jpg'
        )
        self.product_url = reverse('product-detail', args=[self.product.id])
        self.products_url = reverse('product-list')

    def test_get_products_list(self):
        response = self.client.get(self.products_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(p['name'] == self.product.name for p in response.data['results']))

    def test_create_product_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {
            'name': 'New Product',
            'description': 'New Description',
            'price': '149.99',
            'image': 'new.jpg'
        }
        response = self.client.post(self.products_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_product_regular_user(self):
        self.client.force_authenticate(user=self.regular_user)
        data = {
            'name': 'New Product',
            'description': 'New Description',
            'price': '149.99',
            'image': 'new.jpg'
        }
        response = self.client.post(self.products_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class FavoriteAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@test.com',
            password='testpass123'
        )
        self.product = Product.objects.create(
            name='Test Product',
            description='Test Description',
            price=Decimal('99.99'),
            image='test.jpg'
        )
        self.client.force_authenticate(user=self.user)
        self.favorite_url = reverse('product-favorite', args=[self.product.id])

    def test_add_to_favorites(self):
        response = self.client.post(self.favorite_url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Favorite.objects.filter(user=self.user, product=self.product).exists())

    def test_remove_from_favorites(self):
        Favorite.objects.create(user=self.user, product=self.product)
        response = self.client.post(self.favorite_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Favorite.objects.filter(user=self.user, product=self.product).exists())

class RegisterAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')

    def test_register_user(self):
        data = {
            'username': 'newuser',
            'email': 'new@test.com',
            'password': 'newpass123',
            'password2': 'newpass123'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_register_user_invalid_data(self):
        data = {
            'username': 'newuser',
            'email': 'invalid-email',
            'password': 'newpass123',
            'password2': 'differentpass'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
