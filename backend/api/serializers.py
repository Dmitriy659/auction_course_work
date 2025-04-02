from rest_framework import serializers

from .models import User, Bid, AuctionPost


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'city']

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
                  'image', 'is_active']

    def create(self, validated_data):
        # Устанавливаем current_price в starting_price, если он не передан
        print(validated_data['image'])
        print(validated_data['is_active'])
        if 'current_price' not in validated_data:
            validated_data['current_price'] = validated_data.get('starting_price')

        # Привязываем пользователя
        validated_data['user'] = self.context['request'].user

        return super().create(validated_data)


class BidSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    auction_post = serializers.PrimaryKeyRelatedField(queryset=AuctionPost.objects.all())

    class Meta:
        model = Bid
        fields = ['id', 'auction_post', 'user', 'amount', 'create_time']

    def validate(self, data):
        user = self.context['request'].user
        auction_post = data.get('auction_post')

        # Проверка: автор поста не может оставить заявку на свой пост
        if auction_post.user == user:
            raise serializers.ValidationError("Вы не можете оставить заявку на свой собственный пост.")

        # Проверка: пользователь уже оставил заявку на этот пост
        if Bid.objects.filter(user=user, auction_post=auction_post).exists():
            raise serializers.ValidationError("Вы уже оставили заявку на этот пост.")

        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Пользователь с таким email не найден.")
        return value
