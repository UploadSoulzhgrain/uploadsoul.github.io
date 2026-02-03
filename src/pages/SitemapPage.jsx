import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SitemapPage = () => {
  const { t } = useTranslation();

  const siteStructure = [
    {
      title: t('sitemap.sections.main'),
      links: [
        { path: '/', name: t('header.home') },
        { path: '/about', name: t('header.about') },
        { path: '/team', name: t('header.team') },
        { path: '/contact', name: t('header.contact') },
        { path: '/join', name: t('header.join') },
      ]
    },
    {
      title: t('sitemap.sections.services'),
      links: [
        { path: '/companion', name: t('footer.services.holographicCompanion') },
        { path: '/pet', name: t('header.pet') },
        { path: '/virtual-love', name: t('header.virtualLove') },
        { path: '/digital-immortality', name: t('header.digitalImmortality') },
        { path: '/digital-immortality/create', name: t('sitemap.pages.createDigitalHuman') },
        { path: '/digital-rebirth', name: t('header.digitalRebirth') },
        { path: '/digital-rebirth/reunion-space', name: t('header.reunionSpace') },
        { path: '/digital-rebirth/family-tree', name: t('header.familyTree') },
        { path: '/vr', name: t('header.vr') },
        { path: '/all-in-one', name: t('footer.services.aiAllInOne') },
        { path: '/digital-world', name: t('header.digitalWorld') },
        { path: '/shop', name: t('header.shop') },
      ]
    },
    {
      title: t('sitemap.sections.experience'),
      links: [
        { path: '/start-experience', name: t('sitemap.pages.startExperience') },
        { path: '/digital-human-experience', name: t('sitemap.pages.digitalHumanExperience') },
        { path: '/mvp-china', name: t('home.hero.mvpChina') },
        { path: '/mvp-test', name: t('home.hero.mvpTest') },
      ]
    },
    {
      title: t('sitemap.sections.content'),
      links: [
        { path: '/our-stories', name: t('home.features.warmStories.title') },
        { path: '/founder-column', name: t('home.features.founderColumn.title') },
      ]
    },
    {
      title: t('sitemap.sections.user'),
      links: [
        { path: '/login', name: t('header.login') },
        { path: '/register', name: t('header.signup') },
        { path: '/dashboard', name: t('sitemap.pages.dashboard') },
      ]
    },
    {
      title: t('sitemap.sections.legal'),
      links: [
        { path: '/privacy', name: t('footer.privacy') },
        { path: '/terms', name: t('footer.terms') },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{t('footer.sitemap')} | UploadSoul</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
            {t('footer.sitemap')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('sitemap.description')}
          </p>
        </div>

        <div className="space-y-12">
          {siteStructure.map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
              <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
                <h2 className="text-xl font-bold text-purple-900 flex items-center">
                  <span className="w-1.5 h-6 bg-purple-600 rounded-full mr-3"></span>
                  {section.title}
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {section.links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="group flex items-center p-3 rounded-lg hover:bg-purple-50 transition-all duration-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-300 group-hover:bg-purple-600 mr-3 transition-colors"></div>
                      <div>
                        <span className="block text-gray-700 font-medium group-hover:text-purple-700 transition-colors">
                          {link.name}
                        </span>
                        <span className="text-xs text-gray-400 group-hover:text-purple-400 transition-colors font-mono">
                          {link.path}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SitemapPage; 