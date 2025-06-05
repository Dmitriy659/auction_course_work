import pytest
from hypothesis import given, strategies as st
from django.core.exceptions import ValidationError
from .models import User, AuctionPost, Bid

phone_strategy = st.from_regex(r'^\+?\d{1,15}$', fullmatch=False)
email_strategy = st.emails()
short_text = st.text(min_size=1, max_size=50)
long_text = st.text(min_size=1, max_size=1000)
decimal_strategy = st.decimals(min_value=0, max_value=10_000_000, places=2)
date_strategy = st.dates()


@pytest.mark.django_db
@given(
    email=email_strategy,
    first_name=short_text,
    last_name=short_text,
    city=short_text,
    telephone=st.one_of(phone_strategy, st.none()),
    telegram=st.one_of(short_text, st.none()),
)
def test_user_model(email, first_name, last_name, city, telephone, telegram):
    user = User(
        username=email.split('@')[0],
        email=email,
        first_name=first_name,
        last_name=last_name,
        city=city,
        telephone=telephone,
        telegram=telegram,
    )
    try:
        user.full_clean()
        user.save()
    except ValidationError:
        pass


@pytest.mark.django_db
@given(
    user_id=st.integers(min_value=1, max_value=10 ** 6),
    title=st.text(min_size=1, max_size=100),
    description=long_text,
    starting_price=decimal_strategy,
    current_price=decimal_strategy,
    city=st.one_of(short_text, st.none()),
    # end_date может быть None или дата в будущем
    end_date=st.one_of(date_strategy, st.none()),
)
def test_auction_post_model(user_id, title, description, starting_price, current_price, city, end_date):
    # Для теста создадим фиктивного пользователя (без сохранения в БД)
    user = User(id=user_id)

    auction = AuctionPost(
        user=user,
        title=title,
        description=description,
        starting_price=starting_price,
        current_price=current_price,
        city=city,
        end_date=end_date,
    )
    try:
        auction.full_clean()
        auction.save()
    except ValidationError:
        pass


@pytest.mark.django_db
@given(
    auction_post_id=st.integers(min_value=1, max_value=10 ** 6),
    user_id=st.integers(min_value=1, max_value=10 ** 6),
    amount=decimal_strategy,
)
def test_bid_model(auction_post_id, user_id, amount):
    auction_post = AuctionPost(id=auction_post_id)
    user = User(id=user_id)

    bid = Bid(
        auction_post=auction_post,
        user=user,
        amount=amount,
    )
    try:
        bid.full_clean()
        bid.save()
    except ValidationError:
        pass
