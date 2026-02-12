import React from 'react';
import SectionHeading from '../components/common/SectionHeading';

const BabyResumePage = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#0A0A0F]">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="萌宝简历"
          subtitle="记录宝宝成长的每一步"
          centered={true}
        />
        <div className="mt-12 text-center text-gray-400">
          <p>功能开发中...</p>
        </div>
      </div>
    </div>
  );
};

export default BabyResumePage;
