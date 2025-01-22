from django.urls import path
from .consumers import SortingConsumer, FittingConsumer

websocket_urlpatterns = [
    path('ws/sort/', SortingConsumer.as_asgi()),
    path('ws/fit/', FittingConsumer.as_asgi()),
]
