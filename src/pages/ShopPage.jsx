// pages/ShopPage.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ShopPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Mock product data
  useEffect(() => {
    setProducts([
      {
        id: '1',
        name: '高级会员月卡',
        price: 30,
        image: '/assets/shop/membership.jpg',
        category: 'membership',
        description: '30天高级会员权限，解锁所有角色和无限对话次数',
        popular: true
      },
      {
        id: '2',
        name: '高级会员年卡',
        price: 298,
        image: '/assets/shop/membership-year.jpg',
        category: 'membership',
        description: '365天高级会员权限，比月卡更划算，享受全年无限服务',
        popular: true,
        discount: true,
        originalPrice: 360
      },
      {
        id: '3',
        name: '时尚风衣',
        price: 15,
        image: '/assets/shop/coat.jpg',
        category: 'character',
        description: '给你的AI角色穿上这件时尚风衣，展现不同风格',
        forType: 'character'
      },
      {
        id: '4',
        name: '复古眼镜',
        price: 8,
        image: '/assets/shop/glasses.jpg',
        category: 'character',
        description: '复古风格眼镜，为AI角色增添知性魅力',
        forType: 'character'
      },
      {
        id: '5',
        name: '豪华猫窝',
        price: 12,
        image: '/assets/shop/pet-bed.jpg',
        category: 'pet',
        description: '舒适的豪华猫窝，提升宠物幸福感和休息质量',
        forType: 'pet'
      },
      {
        id: '6',
        name: '宠物玩具套装',
        price: 20,
        image: '/assets/shop/pet-toys.jpg',
        category: 'pet',
        description: '多种互动玩具组合，让您的虚拟宠物玩得更开心',
        forType: 'pet',
        discount: true,
        originalPrice: 25
      },
      {
        id: '7',
        name: '海滩别墅场景',
        price: 25,
        image: '/assets/shop/beach-scene.jpg',
        category: 'scene',
        description: '浪漫的海滩别墅场景，适合放松心情和特别的约会',
        forType: 'scene'
      },
      {
        id: '8',
        name: '雪山木屋场景',
        price: 25,
        image: '/assets/shop/snow-scene.jpg',
        category: 'scene',
        description: '温馨的雪山木屋场景，壁炉、热巧克力和皑皑白雪',
        forType: 'scene'
      },
      {
        id: '9',
        name: '声音模型训练',
        price: 50,
        image: '/assets/shop/voice-training.jpg',
        category: 'digital-human',
        description: '为您的数字人创建定制声音模型，让交流更加真实',
        forType: 'digital-human'
      },
      {
        id: '10',
        name: '高清3D模型定制',
        price: 99,
        image: '/assets/shop/3d-model.jpg',
        category: 'digital-human',
        description: '根据照片创建高清3D人物模型，支持VR互动',
        forType: 'digital-human'
      }
    ]);
  }, []);
  
  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  
  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };
  
  // Update product quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Get filtered products based on category
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);
  
  // Product Card Component
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow overflow-hidden transition hover:shadow-md">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover" 
        />
        {product.popular && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            热门
          </span>
        )}
        {product.discount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            优惠
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        <div className="flex items-center mt-1">
          <span className="text-purple-600 font-bold">¥{product.price}</span>
          {product.originalPrice && (
            <span className="text-gray-400 text-sm line-through ml-2">¥{product.originalPrice}</span>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-1">{product.description}</p>
        <button
          onClick={() => addToCart(product)}
          className="mt-3 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          添加到购物车
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{t('header.shop')}</h1>
            <p className="text-gray-600 mt-1">选购虚拟物品，升级您的AI伙伴体验</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <button 
              onClick={() => setShowCart(!showCart)}
              className="flex items-center bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              购物车 ({cart.reduce((total, item) => total + item.quantity, 0)})
            </button>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="mb-6 bg-white rounded-lg shadow p-4 overflow-x-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-lg ${activeCategory === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              全部
            </button>
            <button
              onClick={() => setActiveCategory('membership')}
              className={`px-4 py-2 rounded-lg ${activeCategory === 'membership' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              会员服务
            </button>
            <button
              onClick={() => setActiveCategory('character')}
              className={`px-4 py-2 rounded-lg ${activeCategory === 'character' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              角色装扮
            </button>
            <button
              onClick={() => setActiveCategory('pet')}
              className={`px-4 py-2 rounded-lg ${activeCategory === 'pet' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              宠物用品
            </button>
            <button
              onClick={() => setActiveCategory('scene')}
              className={`px-4 py-2 rounded-lg ${activeCategory === 'scene' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              场景背景
            </button>
            <button
              onClick={() => setActiveCategory('digital-human')}
              className={`px-4 py-2 rounded-lg ${activeCategory === 'digital-human' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              数字人服务
            </button>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* Shopping Cart Slide-in */}
        {showCart && (
          <div className="fixed inset-0 z-50 overflow-hidden" onClick={() => setShowCart(false)}>
            <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <div 
                className="w-screen max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">购物车</h2>
                      <button 
                        onClick={() => setShowCart(false)}
                        className="ml-3 h-7 w-7 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-gray-500"
                      >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mt-8">
                      {cart.length === 0 ? (
                        <div className="text-center py-10">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p className="mt-4 text-gray-500">您的购物车是空的</p>
                          <button 
                            onClick={() => setShowCart(false)}
                            className="mt-4 text-purple-600 hover:text-purple-800"
                          >
                            继续购物
                          </button>
                        </div>
                      ) : (
                        <div className="flow-root">
                          <ul className="-my-6 divide-y divide-gray-200">
                            {cart.map(item => (
                              <li key={item.id} className="py-6 flex">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="ml-4 flex-1 flex flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>{item.name}</h3>
                                      <p className="ml-4">¥{item.price * item.quantity}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{item.description.substring(0, 40)}...</p>
                                  </div>
                                  <div className="flex-1 flex items-end justify-between text-sm">
                                    <div className="flex items-center border rounded">
                                      <button 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                      >
                                        -
                                      </button>
                                      <span className="px-4 py-1 border-x">{item.quantity}</span>
                                      <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                      >
                                        +
                                      </button>
                                    </div>
                                    <div className="flex">
                                      <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="font-medium text-red-600 hover:text-red-800"
                                      >
                                        删除
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {cart.length > 0 && (
                    <div className="border-t border-gray-200 p-6 space-y-4">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>合计</p>
                        <p>¥{totalPrice}</p>
                      </div>
                      <p className="text-sm text-gray-500">运费与税费将在结账时计算</p>
                      <div>
                        <button 
                          onClick={() => {
                            alert('此功能仅作演示，不会实际处理支付');
                          }}
                          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium"
                        >
                          支付
                        </button>
                      </div>
                      <div className="flex justify-center">
                        <button 
                          onClick={() => setShowCart(false)}
                          className="text-sm font-medium text-purple-600 hover:text-purple-800"
                        >
                          继续购物 →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Featured Products */}
        <div className="mt-10 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">会员特权</h2>
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg overflow-hidden">
            <div className="md:flex items-center">
              <div className="md:w-2/3 p-6 md:p-8">
                <div className="inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-white text-sm font-medium mb-3">
                  限时优惠
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">高级会员年卡</h3>
                <p className="text-white text-opacity-90 mb-4 max-w-md">
                  解锁所有高级功能，包括无限对话、优先客服、专属角色定制、VR高级场景等特权。
                </p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">¥298</span>
                  <span className="text-xl line-through text-white text-opacity-70 ml-2">¥360</span>
                  <span className="ml-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                    省¥62
                  </span>
                </div>
                <button 
                  onClick={() => addToCart(products.find(p => p.id === '2'))}
                  className="bg-white text-purple-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
                >
                  立即订购
                </button>
              </div>
              <div className="md:w-1/3 p-6">
                <img 
                  src="/assets/shop/vip-card.png" 
                  alt="VIP Card" 
                  className="w-full max-w-xs mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;