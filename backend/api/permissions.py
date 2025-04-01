from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    """
        Разрешает изменения только владельцу объекта, остальным — только чтение
    """
    def has_object_permission(self, request, view, obj):
        return request.method in SAFE_METHODS or obj.user == request.user


class IsOwnerOrAdmin(BasePermission):
    """
    Только владелец или администратор может редактировать
    """
    def has_object_permission(self, request, view, obj):
        return request.user == obj or request.user.is_staff


class IsAuthenticatedOrReadOnly(BasePermission):
    """
    Чтение для всех, создание/изменение — только для авторизованных
    """
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or request.user.is_authenticated


class CanViewOwnOrAuctionOwnerBids(BasePermission):
    """
    Пользователь видит свои заявки, автор поста видит заявки на свой пост.
    Редактировать или удалять заявку может только её автор.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return obj.user == request.user or obj.auction_post.user == request.user

        return obj.user == request.user

