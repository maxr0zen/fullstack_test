# Используем официальный образ Python
FROM python:3.11-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем переменные окружения
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DEBUG 0

# Устанавливаем системные зависимости
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
        nginx \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем зависимости Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем проект
COPY . .

# Собираем статические файлы
RUN python manage.py collectstatic --noinput

# Настраиваем Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порты
EXPOSE 8000 80

# Запускаем Gunicorn и Nginx
CMD ["sh", "-c", "gunicorn backend.wsgi:application --bind 0.0.0.0:8000 & nginx -g 'daemon off;'"] 