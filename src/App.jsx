import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18n'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import CompanionPage from './pages/CompanionPage'
import PetPage from './pages/PetPage'
import DigitalHumanPage from './pages/DigitalHumanPage'
import ShopPage from './pages/ShopPage'
import DigitalRebirthPage from './pages/DigitalRebirthPage'
import CreateDigitalHumanPage from './pages/CreateDigitalHumanPage'
import VirtualLovePage from './pages/VirtualLovePage'

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/companion" element={<CompanionPage />} />
              <Route path="/pet" element={<PetPage />} />
              <Route path="/virtual-love" element={<VirtualLovePage />} />
              <Route path="/digital-human" element={<DigitalHumanPage />} />
              <Route path="/digital-human/create" element={<CreateDigitalHumanPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/digital-rebirth" element={<DigitalRebirthPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </I18nextProvider>
  )
}

export default App