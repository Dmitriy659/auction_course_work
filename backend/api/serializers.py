from rest_framework import serializers

from .models import User, Bid, AuctionPost


class AuctionPostSerializerCropped(serializers.ModelSerializer):
    class Meta:
        model = AuctionPost
        fields = ['id', 'title', 'description']


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'city', 'telephone', 'telegram']

    def create(self, validated_data):
        # Извлекаем пароль из данных и создаем пользователя
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)  # Здесь устанавливаем пароль
        user.is_active = True
        user.save()
        return user


class AuctionPostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    current_price = serializers.DecimalField(required=False, max_digits=10, decimal_places=2)  #

    class Meta:
        model = AuctionPost
        fields = ['id', 'user', 'title', 'description', 'starting_price', 'current_price', 'end_date', 'start_date',
                  'image', 'city']

    def validate(self, data):
        # Получаем объект аукциона (если редактируем)
        auction_post = self.instance
        if auction_post and 'starting_price' in data and data['starting_price'] != auction_post.starting_price:
            raise serializers.ValidationError("Стартовую цену нельзя изменить после создания аукциона.")
        return data

    def create(self, validated_data):
        # Устанавливаем current_price в starting_price, если он не передан
        if 'current_price' not in validated_data:
            validated_data['current_price'] = validated_data.get('starting_price')

        # Привязываем пользователя
        validated_data['user'] = self.context['request'].user

        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Запрещаем изменение стартовой цены
        if 'starting_price' in validated_data:
            raise serializers.ValidationError("Стартовую цену нельзя изменить.")

        # Оставляем только обновления для остальных полей
        return super().update(instance, validated_data)


class BidSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    auction_post = serializers.PrimaryKeyRelatedField(
        queryset=AuctionPost.objects.all(), write_only=True
    )
    auction_post_data = AuctionPostSerializerCropped(source='auction_post', read_only=True)

    class Meta:
        model = Bid
        fields = ['id', 'auction_post_data', 'auction_post', 'user', 'amount', 'create_time']
        extra_kwargs = {
            'auction_post': {'write_only': True}
        }

    def validate(self, data):
        user = self.context['request'].user
        auction_post = data.get('auction_post')

        if not auction_post:
            raise serializers.ValidationError("Поста не существует")

        # Проверка: автор поста не может оставить заявку на свой пост
        if auction_post.user == user:
            raise serializers.ValidationError("Вы не можете оставить заявку на свой собственный пост.")

        if data.get('amount') < max(auction_post.starting_price, auction_post.current_price):
            raise serializers.ValidationError("Нельзя оставить заявку с ценой ниже текущей")

        # Проверка: пользователь уже оставил заявку на этот пост
        if Bid.objects.filter(user=user, auction_post=auction_post).exists():
            raise serializers.ValidationError("Вы уже оставили заявку на этот пост.")

        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        auction_post = validated_data['auction_post']
        auction_post.current_price = validated_data.get('amount')
        auction_post.save()
        return super().create(validated_data)


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Пользователь с таким email не найден.")
        return value
