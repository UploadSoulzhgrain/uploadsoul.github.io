import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18n'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/home-page'
import CompanionPage from './pages/companion-page'
import PetPage from './pages/pet-page'
import DigitalHumanPage from './pages/digital-human-page'
import ShopPage from './pages/shop-page'
import DigitalRebirthPage from './pages/digital-rebirth-page'
import CreateDigitalHumanPage from './pages/create-digital-human-page'
import VirtualLove from './pages/virtual-love'
import DigitalHumanExperiencePage from './pages/digital-human-experience-page'
import MVPTestPage from './pages/mvp-test-page'
import DigitalImmortalityPage from './pages/digital-immortality-page'
import AboutPage from './pages/about-page'
import TeamPage from './pages/team-page'
import ContactPage from './pages/contact-page'
import JoinPage from './pages/join-page'
import VRPage from './pages/vr-page'
import AllInOnePage from './pages/all-in-one-page'
import PrivacyPage from './pages/privacy-page'
import TermsPage from './pages/terms-page'
import SitemapPage from './pages/sitemap-page'

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