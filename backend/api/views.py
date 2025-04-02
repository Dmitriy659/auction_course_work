from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.tokens import default_token_generator

from .models import User, AuctionPost, Bid
from .serializers import UserSerializer, AuctionPostSerializer, BidSerializer
from .permissions import IsOwnerOrReadOnly, IsOwnerOrAdmin, IsAuthenticatedOrReadOnly, CanViewOwnOrAuctionOwnerBids
from rest_framework.pagination import PageNumberPagination


class TenPostsPagination(PageNumberPagination):
    page_size = 10


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'options']:
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
    pagination_class = TenPostsPagination

    def perform_create(self, serializer):
        # Устанавливаем current_price в starting_price, если не передан
        starting_price = serializer.validated_data.get('starting_price')
        current_price = serializer.validated_data.get('current_price', starting_price)

        serializer.save(user=self.request.user, current_price=current_price, is_active=True)

    @action(detail=False, methods=['get'], url_path='my-auctions')
    def my_bids(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        auctions = AuctionPost.objects.filter(user=user)
        serializer = self.get_serializer(auctions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BidViewSet(viewsets.ModelViewSet):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.IsAuthenticated()]
        return [CanViewOwnOrAuctionOwnerBids(), permissions.IsAuthenticated()]

    def get_queryset(self):
        # По умолчанию возвращаем пустой QuerySet
        return Bid.objects.none()

    # Получить свои заявки на чужие аукционы
    @action(detail=False, methods=['get'], url_path='my-bids')
    def my_bids(self, request):
        user = request.user
        bids = Bid.objects.filter(user=user).exclude(auction_post__user=user)
        serializer = self.get_serializer(bids, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='auction-bids/(?P<auction_post_id>[^/.]+)')
    def auction_bids(self, request, auction_post_id=None):
        user = request.user
        try:
            auction_post = AuctionPost.objects.get(pk=auction_post_id)
        except AuctionPost.DoesNotExist:
            return Response({"detail": "Аукцион не найден."}, status=status.HTTP_404_NOT_FOUND)

        # Проверяем, что текущий пользователь — автор поста
        if auction_post.user != user:
            return Response({"detail": "Вы не являетесь автором этого поста."}, status=status.HTTP_403_FORBIDDEN)

        # Получаем заявки на пост
        bids = Bid.objects.filter(auction_post=auction_post)
        serializer = self.get_serializer(bids, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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

            return Response({"message": "Ссылка для восстановления пароля отправлена на вашу почту."},
                            status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Пользователь с таким email не найден."}, status=status.HTTP_400_BAD_REQUEST)
