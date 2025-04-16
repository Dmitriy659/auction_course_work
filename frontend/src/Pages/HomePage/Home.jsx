import React from 'react';
import AuctionList from '../../components/Auction/AuctionList';
import "./Home.css";

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Добро пожаловать на главную страницу аукциона!
      </h1>
      <AuctionList />
    </div>
  );
}

export default Home;
