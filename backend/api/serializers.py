from rest_framework import serializers

from .models import User, Bid


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

    class Meta:
        model = Bid
        fields = ['id', 'user', 'title', 'description', 'starting_price', 'current_price', 'end_date', 'start_date',
                  'image', 'is_active']


class BidSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    auction = AuctionPostSerializer(read_only=True)

    class Meta:
        model = Bid
        fields = ['id', 'auction_post', 'user', 'amount', 'create_time']


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Пользователь с таким email не найден.")
        return value
