from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_joined = models.DateTimeField(auto_now_add=True)
    city = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20, null=True, blank=True)
    telegram = models.CharField(max_length=20, null=True, blank=True)

    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions_set",
        blank=True
    )


class AuctionPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=100)
    description = models.TextField()
    starting_price = models.DecimalField(max_digits=12, decimal_places=2)
    current_price = models.DecimalField(max_digits=12, decimal_places=2)
    city = models.CharField(max_length=100, null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    start_date = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='', null=True, blank=True)
    is_active = models.BooleanField(default=True)


class Bid(models.Model):
    auction_post = models.ForeignKey(AuctionPost, on_delete=models.CASCADE, related_name='bids')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bids')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    create_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['auction_post', 'user'], name='unique_bid_per_post_user')
        ]
