import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CompanionPage from '../pages/CompanionPage';
import DigitalHumanPage from '../pages/DigitalHumanPage';
import FamilyTreePage from '../pages/FamilyTreePage';
import ShopPage from '../pages/ShopPage';
import DigitalRebirthPage from '../pages/DigitalRebirthPage';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const AppRouter = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/companion" element={<CompanionPage />} />
          <Route path="/digital-human" element={<DigitalHumanPage />} />
          <Route path="/digital-human/family-tree/:digitalHumanId?" element={<FamilyTreePage />} />
          <Route path="/digital-rebirth" element={<DigitalRebirthPage />} />
          <Route path="/digital-human/create" element={<DigitalHumanPage create={true} />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRouter;