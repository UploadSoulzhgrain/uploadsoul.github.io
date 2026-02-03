import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { I18nextProvider, useTranslation } from 'react-i18next'
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
import MVPChinaPage from './pages/MVPChinaPage'
import WarmStoriesPage from './pages/WarmStoriesPage'
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
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import UpdatePasswordPage from './pages/UpdatePasswordPage'
import FounderColumnPage from './pages/FounderColumnPage'
import AnalyticsTracker from './components/analytics/AnalyticsTracker'

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Component to handle language sync from URL prop
const LanguageSync = ({ lang }) => {
  const { i18n: i18nInstance } = useTranslation();

  useEffect(() => {
    if (lang && i18nInstance.language !== lang) {
      i18nInstance.changeLanguage(lang);
    }
  }, [lang, i18nInstance]);

  return (
    <Helmet>
      <html lang={i18nInstance.language} />
    </Helmet>
  );
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AnalyticsTracker />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
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
          <Route path="/mvp-china" element={<MVPChinaPage />} />
          <Route path="/digital-world" element={<DigitalWorldPage />} />
          <Route path="/our-stories" element={<WarmStoriesPage />} />
          <Route path="/founder-column" element={<FounderColumnPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const supportedLangs = ['en', 'zh-TW', 'ja', 'ko', 'es'];

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Explicitly handle supported language prefixes */}
          {supportedLangs.map(lang => (
            <Route
              key={lang}
              path={`/${lang}/*`}
              element={
                <>
                  <LanguageSync lang={lang} />
                  <AppContent />
                </>
              }
            />
          ))}

          {/* Handle default root paths (zh-CN) */}
          <Route path="/*" element={
            <>
              <LanguageSync lang="zh-CN" />
              <AppContent />
            </>
          } />
        </Routes>
      </Router>
    </I18nextProvider>
  )
}

export default App