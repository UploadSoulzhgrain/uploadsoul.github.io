import React, { useState } from 'react';
import {
  ShoppingBag,
  Globe,
  User,
  Users,
  Shirt,
  Box,
  Zap,
  Sun,
  ArrowLeft,
  Share2,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---
const PRODUCTS = [
  // Environments
  {
    id: '1',
    name: '云端雪域庄园',
    category: 'Environments',
    price: 3500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA35P0KHdk4kG0tyfVzN7anExBoeuozFcE1SrSWsSiQTZOAqvutPa0Qr-S5BrJGCbL-vLlhnWYUrq8Ud3GtrAoToTzFNUzlls9EEFwz9yI4Su4tddVx9gnqa65yww3no6ayisbBYOuWaSCTY1y3bpCRtIIkNLD83fSEOQtKZH7HMG-kEa73oc28CLYlSeVIwqS99cGlptri9HgaXu0M6AALlrvV0g1J2wVGGXP_2_SdmkhR-9JfGGHE6KLqTl47Iq8ncKTjaFjD3xq1',
    tag: '至臻写实',
    features: ['全景视野', '恒温系统', '私人管家'],
    specs: {
      '纹理质量': '8K 超清',
      '交互点': '18个',
      '空间面积': '1200㎡',
      '文件格式': 'USDZ, GLB'
    },
    description: '坐落于阿尔卑斯山脉之巅的私人庄园。在这里，您可以与爱人共赏窗外的皑皑白雪，享受顶级的恒温生活空间与管家式服务。'
  },
  {
    id: '2',
    name: '山水禅意别院',
    category: 'Environments',
    price: 4800,
    image: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=1000',
    tag: '中式古典',
    features: ['瀑布流水', '室外篝火', '躺椅闲谈'],
    specs: {
      '纹理质量': '8K PBR',
      '交互点': '15个',
      '风格': '山水禅意',
      '文件格式': 'USDZ, FBX'
    },
    description: '隐于名山大川之间的禅意别院。拥有壮丽的瀑布景观与繁茂绿植，室外设有篝火与舒适躺椅，是好友围炉夜话、感悟自然的绝佳居所。'
  },
  {
    id: '5',
    name: '翡翠湾沙滩椰林',
    category: 'Environments',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
    tag: '度假天堂',
    features: ['海浪音效', '动态椰林', '日光浴场'],
    specs: {
      '纹理质量': '4K 实时',
      '交互点': '12个',
      '植被密度': '高',
      '文件格式': 'USDZ, GLB'
    },
    description: '阳光、沙滩、椰林。翡翠湾为您还原最真实的马尔代夫度假体验。在这里，您可以尽情享受日光浴，聆听海浪拍打沙滩的声音。'
  },
  // Real Estate
  {
    id: '3',
    name: '寰宇天际大平层',
    category: 'Real Estate',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000',
    tag: '无敌视野',
    features: ['270°全景', '无边泳池', '智能家居'],
    specs: {
      '纹理质量': '16K 贴图',
      '交互点': '32个',
      '视野范围': '全无遮挡',
      '文件格式': 'GLB, FBX'
    },
    description: '位于城市最顶端的寰宇天际公寓。270度无死角全景落地窗，将整座城市的繁华与远方的地平线尽收眼底，尽显王者气概。'
  },
  {
    id: '6',
    name: '深海亚特兰蒂斯',
    category: 'Real Estate',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=1000',
    tag: '深海奇观',
    features: ['水下全景', '海洋生物交互', '压力平衡系统'],
    specs: {
      '深度': '水下200米',
      '视野': '360°海底',
      '交互点': '45个',
      '文件格式': 'GLB'
    },
    description: '深藏于大洋底部的未来主义居所。透过超强度透明穹顶，您可以近距离观察深海生物，体验前所未有的水下生活。'
  },
  // Apparel
  {
    id: '7',
    name: '星云流光礼服',
    category: 'Apparel',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000',
    tag: '数字高定',
    features: ['自发光材质', '粒子特效', '动态剪裁'],
    specs: {
      '材质': '液态光子',
      '动态级别': 'Level 5',
      '适用场合': '虚拟晚宴',
      '文件格式': 'GLB, VRM'
    },
    description: '采用液态光子技术打造的数字礼服。裙摆间流淌着星云般的色彩，随数字人的动作产生绚丽的粒子拖尾。'
  },
  {
    id: '8',
    name: '赛博机能战甲',
    category: 'Apparel',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=1000',
    tag: '硬核装备',
    features: ['外骨骼增强', '多功能UI', '环境自适应'],
    specs: {
      '材质': '碳纤维复合',
      '防御等级': '虚拟防护 A级',
      '交互点': '12个',
      '文件格式': 'GLB'
    },
    description: '专为虚拟探险设计的机能战甲。不仅拥有极具冲击力的视觉外观，还集成了多种虚拟探测功能。'
  },
  // Props
  {
    id: '4',
    name: '皇家典藏壁炉书阁',
    category: 'Props',
    price: 5200,
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1000',
    tag: '奢华至极',
    features: ['万卷藏书', '真火壁炉', '古典交响'],
    specs: {
      '纹理质量': '8K PBR',
      '交互点': '20个',
      '层高': '8米挑高',
      '文件格式': 'USDZ, GLB'
    },
    description: '一座宏伟奢华的皇家级私人图书馆。八米挑高的空间，整面墙的珍贵藏书，伴随着壁炉中跳动的火焰，为您提供最尊贵的阅读体验。'
  },
  {
    id: '9',
    name: '智能机械宠物犬',
    category: 'Props',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1589127017022-45ca48d329eb?auto=format&fit=crop&q=80&w=1000',
    tag: '智能伴侣',
    features: ['AI情感交互', '自动跟随', '多种皮肤'],
    specs: {
      'AI等级': 'Level 4',
      '动作库': '200+动作',
      '交互模式': '语音/手势',
      '文件格式': 'GLB'
    },
    description: '您的数字空间完美伴侣。采用先进的AI情感引擎，能够识别您的情绪并作出相应的互动反馈。'
  },
  {
    id: '10',
    name: '云端奢华宠物屋',
    category: 'Props',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=1000',
    tag: '宠物奢享',
    features: ['恒温控制', '自动清洁', '舒缓音乐'],
    specs: {
      '材质': '航空级复合材料',
      '功能': '全自动环境调节',
      '适用': '中小型犬/猫',
      '文件格式': 'GLB, USDZ'
    },
    description: '为您的数字宠物打造的顶级居所。集成恒温控制系统与自动清洁功能，让您的宠物在虚拟世界也能享受五星级待遇。'
  },
  {
    id: '11',
    name: '多维空间猫爬架',
    category: 'Props',
    price: 950,
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=1000',
    tag: '猫咪乐园',
    features: ['多层交互', '磨爪材质', '悬浮球玩具'],
    specs: {
      '结构': '模块化设计',
      '交互点': '8个',
      '高度': '2.5米',
      '文件格式': 'GLB'
    },
    description: '专为数字猫咪设计的立体游乐场。多层错落的空间结构，配合丰富的交互玩具，极大丰富了虚拟宠物的日常活动。'
  }
];

const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'Environments', name: '场景', icon: Sun },
    { id: 'Real Estate', name: '房产', icon: Globe },
    { id: 'Apparel', name: '服饰', icon: Shirt },
    { id: 'Props', name: '道具', icon: Box },
  ];

  return (
    <div className="flex gap-4 p-4 overflow-x-auto no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`flex flex-col items-center gap-2 min-w-[72px] transition-all ${activeCategory === cat.id ? 'opacity-100' : 'opacity-40 grayscale'
            }`}
        >
          <div className={`size-14 rounded-2xl flex items-center justify-center border ${activeCategory === cat.id ? 'bg-[#ec5b13]/10 border-[#ec5b13]/50 text-[#ec5b13]' : 'glass-card border-white/10 text-slate-300'
            }`}>
            <cat.icon className="size-6" />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${activeCategory === cat.id ? 'text-[#ec5b13]' : 'text-slate-400'}`}>
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  );
};

function ProductCard({ product, onClick }) {
  return (
    <motion.div
      layoutId={`card-${product.id}`}
      onClick={onClick}
      className="glass-card rounded-2xl overflow-hidden mb-6 cursor-pointer group hover:border-[#ec5b13]/30 transition-colors"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0705]/90 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex gap-2">
          {product.features.slice(0, 2).map((feat, idx) => (
            <span key={idx} className="text-[9px] font-bold px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 flex items-center gap-1 uppercase tracking-tighter text-white">
              {feat}
            </span>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-[10px] text-[#ec5b13] font-black uppercase tracking-[0.2em] mb-1">{product.tag}</p>
          <h3 className="text-xl font-bold leading-tight">{product.name}</h3>
        </div>
      </div>

      <div className="p-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">所有权费用</span>
          <span className="text-lg font-black tracking-tight text-white">{product.price.toLocaleString()} SOUL</span>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl glass-card text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors text-white">
            预览
          </button>
          <button className="px-4 py-2 rounded-xl bg-[#ec5b13] text-white text-[10px] font-bold uppercase tracking-widest neon-glow hover:brightness-110 transition-all">
            购买
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductDetail({ product, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0a0705] overflow-y-auto no-scrollbar"
    >
      <div className="sticky top-0 z-50 flex items-center justify-between p-6 bg-[#0a0705]/80 backdrop-blur-md">
        <button onClick={onClose} className="flex items-center justify-center size-10 rounded-full glass-card border-white/10 text-white">
          <ArrowLeft className="size-5" />
        </button>
        <h2 className="text-base font-bold text-white">资产详情</h2>
        <button className="flex items-center justify-center size-10 rounded-full glass-card border-white/10 text-white">
          <Share2 className="size-5" />
        </button>
      </div>

      <div className="px-6 pb-32 max-w-2xl mx-auto">
        <motion.div
          layoutId={`card-${product.id}`}
          className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/5"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0705] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6">
            <span className="px-3 py-1 bg-[#ec5b13] text-white text-[10px] font-black rounded-full tracking-widest uppercase">
              {product.tag}
            </span>
          </div>
        </motion.div>

        <div className="mt-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black tracking-tighter mb-1 text-white">{product.name}</h1>
              <p className="text-[#ec5b13] font-bold text-xs tracking-[0.2em] uppercase opacity-80">{product.category}</p>
            </div>
            <div className="text-right">
              <p className="text-[#ec5b13] text-2xl font-black">{product.price.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Soul Credits</p>
            </div>
          </div>

          <div className="flex gap-2 mt-6 overflow-x-auto pb-2 no-scrollbar">
            {product.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border-white/5 shrink-0 text-white">
                <Zap className="size-3 text-[#ec5b13] fill-[#ec5b13]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{feat}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-2xl glass-card border-white/5 space-y-4">
            <h3 className="text-[10px] font-black text-[#ec5b13] tracking-[0.3em] uppercase">设计理念</h3>
            <p className="text-slate-300 text-sm leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="p-4 rounded-2xl glass-card border-white/5 text-white">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{key}</p>
                <p className="text-sm font-bold">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#0a0705]/95 backdrop-blur-2xl border-t border-white/5 flex items-center gap-4 z-[110]">
        <button className="flex items-center justify-center size-14 rounded-2xl glass-card border-white/10 text-slate-300 hover:text-primary transition-colors">
          <Heart className="size-6" />
        </button>
        <button className="flex-1 h-14 bg-[#ec5b13] rounded-2xl flex items-center justify-center gap-3 text-white font-black text-sm tracking-widest uppercase shadow-[0_8px_30px_rgba(236,91,19,0.4)] hover:scale-[1.02] transition-transform active:scale-95">
          <ShoppingCart className="size-5" />
          <span>购买并部署</span>
        </button>
      </div>
    </motion.div>
  );
}

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/10 px-8 pt-4 pb-8 flex justify-between items-center bg-[#0a0705]/80">
    <button className="flex flex-col items-center gap-1.5 text-[#ec5b13]">
      <ShoppingBag className="size-6 fill-[#ec5b13]/20" />
      <span className="text-[9px] font-black uppercase tracking-widest">商城</span>
    </button>
    <button className="flex flex-col items-center gap-1.5 text-slate-500">
      <Globe className="size-6" />
      <span className="text-[9px] font-black uppercase tracking-widest">世界</span>
    </button>
    <button className="flex flex-col items-center gap-1.5 text-slate-500">
      <Shirt className="size-6" />
      <span className="text-[9px] font-black uppercase tracking-widest">衣橱</span>
    </button>
    <button className="flex flex-col items-center gap-1.5 text-slate-500">
      <Users className="size-6" />
      <span className="text-[9px] font-black uppercase tracking-widest">社交</span>
    </button>
    <button className="flex flex-col items-center gap-1.5 text-slate-500">
      <User className="size-6" />
      <span className="text-[9px] font-black uppercase tracking-widest">我的</span>
    </button>
  </nav>
);

const ShopPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Environments');

  const filteredProducts = PRODUCTS.filter(p => p.category === activeCategory);

  const categoryTitles = {
    'Environments': { title: '精选生活空间', subtitle: '数字人沉浸式体验' },
    'Real Estate': { title: '顶级数字房产', subtitle: '独一无二的虚拟居所' },
    'Apparel': { title: '数字高定服饰', subtitle: '展现您的虚拟个性' },
    'Props': { title: '交互式数字道具', subtitle: '丰富您的虚拟生活' },
  };

  return (
    <div className="min-h-screen flex flex-col w-full max-w-7xl mx-auto relative shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-[#0a0705]">
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .neon-glow {
          box-shadow: 0 0 20px rgba(236, 91, 19, 0.3);
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>

      <div className="pt-24 flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
          <div className="max-w-4xl mx-auto">
            <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          </div>

          <section className="px-4 py-4 md:px-8 lg:px-12">
            <div className="flex items-end justify-between mb-8 max-w-4xl mx-auto lg:max-w-none text-white">
              <div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter">
                  {categoryTitles[activeCategory].title}
                </h2>
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                  {categoryTitles[activeCategory].subtitle}
                </p>
              </div>
              <button className="text-[10px] md:text-xs text-[#ec5b13] font-black uppercase tracking-widest">查看全部</button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </section>
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="w-full max-w-md pointer-events-auto">
            <BottomNav />
          </div>
        </div>

        <AnimatePresence>
          {selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ShopPage;