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
import VirtualLove from './pages/VirtualLove'
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
import SitemapPage from './pages/SitemapPage'

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
              <Route path="/virtual-love" element={<VirtualLove />} />
              <Route path="/digital-immortality" element={<DigitalImmortalityPage />} />
              <Route path="/digital-immortality/create" element={<CreateDigitalHumanPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/digital-rebirth" element={<DigitalRebirthPage />} />
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </I18nextProvider>
  )
}

export default App