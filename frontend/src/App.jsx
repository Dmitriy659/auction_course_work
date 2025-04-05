import React from "react";
import { Route, Routes } from "react-router-dom";
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
import PrivateRoute from "./routes/PrivateRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";

function App() {
  return (
    <div className="App">
      <Header />
      <main className="p-4">
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<Home />} />
          <Route path="/auctions/:id" element={<AuctionDetailsPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Приватные маршруты */}
          <Route
            path="/my-auctions"
            element={
              <PrivateRoute>
                <MyAuctionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-auction"
            element={
              <PrivateRoute>
                <CreateAuction />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-auction/:id"
            element={
              <PrivateRoute>
                <EditAuctionPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <EditUserPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-bids"
            element={
              <PrivateRoute>
                <MyBidsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/myauction-bids/:id"
            element={
              <PrivateRoute>
                <AuctionBidsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
