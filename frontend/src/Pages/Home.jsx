import React from 'react';
import AuctionList from '../components/Auction/AuctionList';

function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Добро пожаловать на главную страницу аукциона!</h1>
      <AuctionList />
    </div>
  );
}

export default Home;
