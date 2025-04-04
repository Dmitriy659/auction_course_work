// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Home from "./Pages/Home.jsx";
import MyAuctionsPage from "./Pages/MyAuctionPages.jsx";
import CreateAuction from "./Pages/CreateAuction.jsx";
import EditAuctionPage from "./Pages/EditAuction/EditAuction.jsx";
import EditUserPage from "./Pages/User/EditProfile.jsx";
import AuctionDetailsPage from "./Pages/AuctionPage/AuctionPage.jsx";
import MyBidsPage from "./Pages/MyBids/MyBids.jsx";
import AuctionBidsPage from "./Pages/AuctionBids/AuctionBids.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-auctions" element={<MyAuctionsPage />} />
            <Route path="/create-auction" element={<CreateAuction />} />
            <Route path="/edit-auction/:id" element={<EditAuctionPage />}/>
            <Route path="/auctions/:id" element={<AuctionDetailsPage />}/>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<EditUserPage />} />
            <Route path="/my-bids" element={<MyBidsPage />} />
            <Route path="/myauction-bids/:id" element={<AuctionBidsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
