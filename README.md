# Интернет-магазин (Fullstack)

Полнофункциональный интернет-магазин с использованием Django REST Framework (бэкенд) и React (фронтенд).

## Функциональность

### Пользователи
- Регистрация и авторизация
- JWT аутентификация
- Профиль пользователя
- Избранные товары

### Товары
- Каталог товаров
- Детальная страница товара
- Фильтрация и поиск
- Комментарии к товарам
- Добавление в избранное

### Администратор
- Управление товарами
- Управление пользователями
- Модерация комментариев

## Технологии

### Бэкенд
- Python 3.11
- Django 5.2
- Django REST Framework
- SQLite (для разработки)
- JWT аутентификация
- Swagger/OpenAPI документация

### Фронтенд
- React 18
- React Router
- Axios
- Bootstrap 5
- JWT токены
- Context API для управления состоянием

### Инфраструктура
- Docker
- Nginx
- Gunicorn

## Установка и запуск

### Требования
- Docker
- Docker Compose
- Node.js 18+ (для разработки фронтенда)
- Python 3.11+ (для разработки бэкенда)

### Запуск в Docker

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/shop.git
cd shop
```

2. Запустите приложение:
```bash
docker-compose -f docker-compose.combined.yml up --build -d
```

Приложение будет доступно по адресу: http://localhost

### Настройка базы данных

После первого запуска необходимо выполнить миграции и создать суперпользователя. Для этого выполните следующие команды:

1. Подключитесь к контейнеру:
```bash
docker exec -it shop-app bash
```

2. Примените миграции:
```bash
python manage.py migrate
```

3. Создайте суперпользователя:
```bash
python manage.py createsuperuser
```
Следуйте инструкциям для создания учетной записи администратора.

4. (Опционально) Загрузите тестовые данные из фикстур:
```bash
python manage.py loaddata shop/fixtures/initial_data.json
```

### Доступ к админ-панели

После создания суперпользователя, вы можете получить доступ к админ-панели Django по адресу:
http://localhost/admin/

## API Endpoints

### Аутентификация
- `POST /api/token/` - получение токенов
- `POST /api/token/refresh/` - обновление токена
- `POST /api/register/` - регистрация

### Пользователи
- `GET /api/users/me/` - информация о текущем пользователе

### Товары
- `GET /api/products/` - список товаров
- `GET /api/products/{id}/` - детали товара
- `POST /api/products/{id}/favorite/` - добавить в избранное

### Комментарии
- `GET /api/comments/?product_id={id}` - комментарии к товару
- `POST /api/comments/` - добавить комментарий
- `DELETE /api/comments/{id}/` - удалить комментарий

## Документация API

Swagger UI доступен по адресу: http://localhost/api/swagger/

## Лицензия

MIT 

## Структура проекта

```
shop/
├── back/                 # Бэкенд
│   └── backend/
│       ├── api/         # API endpoints
│       ├── products/    # Модели товаров
│       ├── users/       # Модели пользователей
│       └── manage.py
├── front/               # Фронтенд
│   ├── public/
│   └── src/
│       ├── components/  # React компоненты
│       ├── contexts/    # React контексты
│       ├── pages/       # Страницы
│       └── services/    # API сервисы
├── docker-compose.combined.yml
├── Dockerfile.combined
└── nginx.conf
```

## Остановка приложения

Для остановки приложения выполните:
```bash
docker-compose -f docker-compose.combined.yml down
```

## Пересборка приложения

Если вы внесли изменения в код, пересоберите и перезапустите контейнеры:
```bash
docker-compose -f docker-compose.combined.yml down
docker-compose -f docker-compose.combined.yml up --build -d
```

## Управление данными

### Создание фикстур

Для создания фикстур с текущими данными:
```bash
docker exec -it shop-app bash
python manage.py dumpdata shop > shop/fixtures/initial_data.json
```

### Загрузка фикстур

Для загрузки данных из фикстур:
```bash
docker exec -it shop-app bash
python manage.py loaddata shop/fixtures/initial_data.json
```

## Решение проблем

### Очистка базы данных

Если необходимо начать с чистой базы данных:
1. Остановите контейнеры
2. Удалите файл базы данных (если используется SQLite)
3. Пересоберите и перезапустите контейнеры
4. Выполните миграции заново

### Проблемы с доступом к админ-панели

Если возникают проблемы с доступом к админ-панели:
1. Убедитесь, что суперпользователь создан
2. Проверьте правильность учетных данных
3. Проверьте настройки CORS в Django
4. Убедитесь, что Nginx правильно настроен для проксирования запросов к `/admin/` 

## Разработка

### Запуск бэкенда отдельно

1. Перейдите в директорию бэкенда:
```bash
cd back/backend
```

2. Создайте и активируйте виртуальное окружение:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

4. Примените миграции:
```bash
python manage.py migrate
```

5. Создайте суперпользователя (если еще не создан):
```bash
python manage.py createsuperuser
```

6. Запустите сервер разработки:
```bash
python manage.py runserver
```

Бэкенд будет доступен по адресу: http://localhost:8000

### Запуск фронтенда отдельно

1. Перейдите в директорию фронтенда:
```bash
cd front
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в директории `front` со следующим содержимым:
```env
REACT_APP_API_URL=http://localhost:8000
```

4. Запустите сервер разработки:
```bash
npm start
```

Фронтенд будет доступен по адресу: http://localhost:3000

### Настройка CORS для разработки

При отдельном запуске фронтенда и бэкенда необходимо настроить CORS в Django. Добавьте в `back/backend/backend/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React development server
]

CORS_ALLOW_CREDENTIALS = True
```

### Примечания по разработке

1. При разработке фронтенда:
   - Все API запросы будут отправляться на `http://localhost:8000`
   - Изменения в коде будут автоматически отображаться в браузере
   - Для отладки используйте React Developer Tools

2. При разработке бэкенда:
   - API доступен по адресу `http://localhost:8000/api/`
   - Swagger UI доступен по адресу `http://localhost:8000/api/swagger/`
   - Для отладки используйте Django Debug Toolbar

3. Общие рекомендации:
   - Используйте `.env` файлы для конфигурации
   - Следите за версиями зависимостей
   - Регулярно обновляйте фикстуры при изменении моделей 