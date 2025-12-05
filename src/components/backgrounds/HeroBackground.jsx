import React from 'react';

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50"></div>
      
      {/* 装饰圆圈 */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-200 opacity-40"></div>
      <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-indigo-200 opacity-30"></div>
      <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-purple-300 opacity-20"></div>
      
      {/* 网格背景 */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNmMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNnptMCAzMGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNmMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNnptLTIwLTE1YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02Yy0zLjMxNCAwLTYgMi42ODYtNiA2czIuNjg2IDYgNiA2eiIgc3Ryb2tlPSIjYzRiNWZkIiBzdHJva2Utb3BhY2l0eT0iLjIiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik00MCAzMHYtNm0wLTZoLTZ2NmgxMm0tNiAwdjYiIHN0cm9rZT0iI2M0YjVmZCIgc3Ryb2tlLW9wYWNpdHk9Ii4yIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMjIgMzB2LTZtMC02aC02djZoMTJtLTYgMHY2IiBzdHJva2U9IiNjNGI1ZmQiIHN0cm9rZS1vcGFjaXR5PSIuMiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
    </div>
  );
};

export default HeroBackground; 