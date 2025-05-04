from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from .models import AuctionPost

User = get_user_model()

class APILogicTests(APITestCase):
    def setUp(self):
        # Create two users: owner and other
        self.owner = User.objects.create_user(username='owner', email='owner@example.com', password='pass')
        self.other = User.objects.create_user(username='other', email='other@example.com', password='pass')
        # Obtain tokens
        resp = self.client.post(reverse('token_obtain_pair'), {'username': 'owner', 'password': 'pass'})
        self.owner_token = resp.data['access']
        resp = self.client.post(reverse('token_obtain_pair'), {'username': 'other', 'password': 'pass'})
        self.other_token = resp.data['access']
        # Create an auction by owner
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.owner_token}')
        self.auction_data = {'title': 'Test Auction', 'description': 'Desc', 'starting_price': '100.00', 'city': 'City'}
        resp = self.client.post(reverse('auctionpost-list'), self.auction_data)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.auction_id = resp.data['id']

    def test_get_me_authenticated(self):
        url = reverse('user-get-me')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.owner_token}')
        resp = self.client.get(url)
        self.assertTrue(resp.data['is_authenticated'])
        self.assertEqual(resp.data['id'], self.owner.id)

    def test_update_me_permission(self):
        url = reverse('user-update-me')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.other_token}')
        resp = self.client.patch(url, {'first_name': 'NewName'})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_create_bid_success(self):
        # other user bids on owner's auction
        url = reverse('bid-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.other_token}')
        data = {'auction_post': self.auction_id, 'amount': '150.00'}
        resp = self.client.post(url, data)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        # Auction current price updated
        self.auction = AuctionPost.objects.get(id=self.auction_id)
        self.assertEqual(str(self.auction.current_price), '150.00')

    def test_create_bid_by_owner_forbidden(self):
        url = reverse('bid-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.owner_token}')
        data = {'auction_post': self.auction_id, 'amount': '200.00'}
        resp = self.client.post(url, data)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_destroy_bid_and_price_revert(self):
        # Create two bids by other and new user
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.other_token}')
        url = reverse('bid-list')
        resp1 = self.client.post(url, {'auction_post': self.auction_id, 'amount': '150.00'})
        self.assertEqual(resp1.status_code, status.HTTP_201_CREATED)
        # New other2 user
        User.objects.create_user(username='u2', email='u2@example.com', password='pass')
        resp = self.client.post(reverse('token_obtain_pair'), {'username': 'u2', 'password': 'pass'})
        token2 = resp.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token2}')
        resp2 = self.client.post(url, {'auction_post': self.auction_id, 'amount': '200.00'})
        bid2_id = resp2.data['id']
        # Delete highest bid
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token2}')
        del_url = reverse('bid-detail', args=[str(bid2_id)])
        resp_del = self.client.delete(del_url)
        self.assertEqual(resp_del.status_code, status.HTTP_204_NO_CONTENT)
        # Check current_price reverted to 150.00
        auction = AuctionPost.objects.get(id=self.auction_id)
        self.assertEqual(str(auction.current_price), '150.00')

    def test_my_auctions_endpoint(self):
        url = reverse('auctionpost-my-auctions')
        # as owner
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.owner_token}')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(len(resp.data) >= 1)
        # unauthenticated
        self.client.credentials()
        resp2 = self.client.get(url)
        self.assertEqual(resp2.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_my_bids_action(self):
        # other bids
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.other_token}')
        resp = self.client.post(reverse('bid-list'), {'auction_post': self.auction_id, 'amount': '120.00'})
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        # get my-bids
        url = reverse('bid-my-bids')
        resp2 = self.client.get(url)
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        self.assertTrue(len(resp2.data) == 1)

    def test_auction_bids_action(self):
        # create bid
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.other_token}')
        self.client.post(reverse('bid-list'), {'auction_post': self.auction_id, 'amount': '110.00'})
        # owner views auction-bids
        url = reverse('bid-auction-bids', args=[str(self.auction_id)])
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.owner_token}')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(len(resp.data) == 1)
        # other forbidden
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.other_token}')
        resp2 = self.client.get(url)
        self.assertEqual(resp2.status_code, status.HTTP_403_FORBIDDEN)

class PasswordResetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='u', email='u@example.com', password='pass')

    def test_password_reset_request_valid(self):
        url = reverse('password_reset')
        resp = self.client.post(url, {'email': 'u@example.com'})
        self.assertEqual(resp.status_code, status.HTTP_302_FOUND)

