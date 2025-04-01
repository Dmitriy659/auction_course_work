from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.tokens import default_token_generator

from .models import User, AuctionPost, Bid
from .serializers import UserSerializer, AuctionPostSerializer, BidSerializer, PasswordResetSerializer
from .permissions import IsOwnerOrReadOnly, IsOwnerOrAdmin, IsAuthenticatedOrReadOnly, CanViewOwnOrAuctionOwnerBids


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['create']:
            # Регистрация доступна всем
            return [permissions.AllowAny()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Изменение только владельцу
            return [IsOwnerOrAdmin()]
        return [permissions.IsAuthenticated()]


class AuctionPostViewSet(viewsets.ModelViewSet):
    queryset = AuctionPost.objects.all()
    serializer_class = AuctionPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BidViewSet(viewsets.ModelViewSet):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.IsAuthenticated()]
        return [CanViewOwnOrAuctionOwnerBids()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PasswordResetRequestView(APIView):
    """
        API для запроса восстановления пароля.
        Отправляет email с ссылкой на восстановление пароля.
    """
    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
            # Генерация токена и кодирование ID пользователя
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(user.pk.encode())

            # Формируем ссылку
            reset_link = f"{get_current_site(request).domain}/password-reset/confirm/{uid}/{token}/"

            # Отправляем email
            send_mail(
                "Восстановление пароля",
                f"Перейдите по следующей ссылке для восстановления пароля: {reset_link}",
                "no-reply@example.com",  # email, с которого будет отправлен
                [email]
            )

            return Response({"message": "Ссылка для восстановления пароля отправлена на вашу почту."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Пользователь с таким email не найден."}, status=status.HTTP_400_BAD_REQUEST)
