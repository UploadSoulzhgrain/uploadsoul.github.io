import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18n'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CompanionPage from './pages/CompanionPage'
import PetPage from './pages/PetPage'
import DigitalHumanPage from './pages/DigitalHumanPage'
import ShopPage from './pages/ShopPage'
import DigitalRebirthPage from './pages/DigitalRebirthPage'
import CreateDigitalHumanPage from './pages/CreateDigitalHumanPage'
import VirtualLovePage from './pages/VirtualLovePage'
import DigitalHumanExperiencePage from './pages/DigitalHumanExperiencePage'
import MVPTestPage from './pages/MVPTestPage'
import DigitalImmortalityPage from './pages/DigitalImmortalityPage'
import AboutPage from './pages/AboutPage'
import TeamPage from './pages/TeamPage'
import ContactPage from './pages/ContactPage'
import JoinPage from './pages/JoinPage'
import VRPage from './pages/VRPage'
import AllInOnePage from './pages/AllInOnePage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ReunionSpacePage from './pages/ReunionSpacePage'
import FamilyTreePage from './pages/FamilyTreePage'
import DigitalWorldPage from './pages/DigitalWorldPage'
import NotFoundPage from './pages/NotFoundPage'
import SitemapPage from './pages/SitemapPage'
import { Helmet } from 'react-helmet-async'

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Helmet>
            <html lang={i18n.language} />
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="canonical" href={window.location.href} />
          </Helmet>
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/companion" element={<CompanionPage />} />
              <Route path="/pet" element={<PetPage />} />
              <Route path="/virtual-love" element={<VirtualLovePage />} />
              <Route path="/digital-immortality" element={<DigitalImmortalityPage />} />
              <Route path="/digital-immortality/create" element={<CreateDigitalHumanPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/digital-rebirth" element={<DigitalRebirthPage />} />
              <Route path="/digital-rebirth/reunion-space" element={<ReunionSpacePage />} />
              <Route path="/digital-rebirth/family-tree" element={<FamilyTreePage />} />
              <Route path="/start-experience" element={<DigitalHumanPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/digital-human-experience" element={<DigitalHumanExperiencePage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/join" element={<JoinPage />} />
              <Route path="/vr" element={<VRPage />} />
              <Route path="/all-in-one" element={<AllInOnePage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/sitemap" element={<SitemapPage />} />
              <Route path="/mvp-test" element={<MVPTestPage />} />
              <Route path="/digital-world" element={<DigitalWorldPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </I18nextProvider>
  )
}

export default App