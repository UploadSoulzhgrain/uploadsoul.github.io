import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SitemapPage = () => {
  const { t } = useTranslation();

  const pages = [
    { path: '/', name: t('header.home') },
    { path: '/our-stories', name: t('home.features.warmStories.title') },
    { path: '/founder-column', name: t('home.features.founderColumn.title') },
    { path: '/mvp-china', name: t('home.hero.mvpChina') },
    { path: '/mvp-test', name: t('home.hero.mvpTest') },
    { path: '/digital-immortality', name: t('header.digitalImmortality') },
    { path: '/virtual-love', name: t('header.virtualLove') },
    { path: '/companion', name: t('header.companion') },
    { path: '/pet', name: t('header.pet') },
    { path: '/digital-rebirth', name: t('header.digitalRebirth') },
    { path: '/digital-rebirth/family-tree', name: t('header.familyTree') },
    { path: '/digital-rebirth/reunion-space', name: t('header.reunionSpace') },
    { path: '/digital-world', name: t('header.digitalWorld') },
    { path: '/vr', name: t('header.vr') },
    { path: '/shop', name: t('header.shop') },
    { path: '/about', name: t('header.about') },
    { path: '/team', name: t('header.team') },
    { path: '/contact', name: t('header.contact') },
    { path: '/join', name: t('header.join') },
    { path: '/privacy', name: t('footer.privacy') },
    { path: '/terms', name: t('footer.terms') },
    { path: '/sitemap', name: t('footer.sitemap') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">{t('footer.sitemap')}</h1>
          <p className="text-xl text-gray-600">{t('sitemap.description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pages.map((page) => (
            <Link
              key={page.path}
              to={page.path}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-purple-800 mb-2">{page.name}</h2>
              <p className="text-gray-600">{page.path}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SitemapPage; 