from django.urls import path
from .consumers import SortingConsumer

websocket_urlpatterns = [
    path('ws/sort/', SortingConsumer.as_asgi()),
]
