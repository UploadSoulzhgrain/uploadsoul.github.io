import React from 'react';
import { useTranslation } from 'react-i18next';

const AllInOnePage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-purple-900 mb-8">
          {t('allInOne.title')}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Add your content here */}
        </div>
      </div>
    </div>
  );
};

export default AllInOnePage; 