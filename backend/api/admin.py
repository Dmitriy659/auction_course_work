from django.contrib import admin
from .models import User, AuctionPost, Bid

admin.site.register(User)
admin.site.register(AuctionPost)
admin.site.register(Bid)
