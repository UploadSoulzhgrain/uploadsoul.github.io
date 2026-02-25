import React, { useState } from 'react';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';

const DailyCompanionPage = () => {
    const { navigate, l } = useLocalizedNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const aiProfiles = [
        {
            id: 'sunny',
            name: '小晴 (Sunny)',
            tags: '活泼开朗 · 治愈系',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjxAV95ITqD2oLiErbbLq3ezfEDN891Hrc7RbPilGZyaRvIR-9CocAWpAmv0sokIfCeoGIWI38wbdHXhJ3IarD02Aa9Hqpywzw9c-R7JAEUvWYP3oaawr6zOAMUWJQs0ymoXdBYhilyXwLGusYHwDQT7Smb61ZjW1F1ap0HYjWQF1WXTEnvr_UMeghLshW2BA2eFzEgq68SgMn4CgGhZxD069QgsbXnxo_TVxOa2retApke6lN3cOYN5TxaZfFgZqvp3Ze-oh8obU',
            status: 'online',
            personality: '热情、爱笑、乐于助人。她总能带给你满满的正能量，是你心情低落时的最佳倾听者。',
            gender: 'female',
            favorited: true
        },
        {
            id: 'luna',
            name: '露娜 (Luna)',
            tags: '优雅知性 · 倾听者',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU1MBa3KPjN0jMovoP8My79SxlmCcBWf4_RKp9cqHLNJShBovwLS2AIrc2ipJbOiWVbDASwLuZpaGaxPc_SE-bfcmEJePxLtNqoxaheX4AvOAwbNDf8FVQph9PnxojpfYZaVRgy2k19J1TjdC5ihr9rCPKdAbSSS09UW8d50KnNRDsPFyHS6ovQe3m_NMUCgPL5JL5u8MqVs8GA2AjvHSlrsHSeN4hb4l2lNQWB1wUJsM6VTU5r4TRg_iqAVOab0Pbc3RD2ttXVhc',
            status: 'offline',
            personality: '温柔、细腻、博学多才。如果你喜欢深入探讨文学与哲学，露娜会是你最完美的精神伙伴。',
            gender: 'female',
            favorited: false
        },
        {
            id: 'leo',
            name: '阿朗 (Leo)',
            tags: '沉稳果敢 · 理想型',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBy7Q36TDAVh_7cOVBHfMCba8EYbTwVXmkdH9ImOdSZI3ZEPaLsb1nQmslha_GDA1J1paEWcLrKxBcqyX5SBT5ip3aal8XUMLiCnHyuWfhdSXT7Eb26DdabCEIuAu4FNhgebb4F08exILu3CobqojPx97oT990kKhG3Fek4x4rd9pYCk0y7elKiI-5d_nBKl86GryehI0OEp69vUokGEjEgYc7vObQsAa1RK6jJTaARoaHp9ip-XIbn0Mi8rpbs22lwcpCNFIV37Q',
            status: 'online',
            personality: '幽默、自律、充满活力。喜欢运动和旅行？阿朗不仅是你的伙伴，更是你生活中最棒的战友。',
            gender: 'male',
            favorited: false
        },
        {
            id: 'yuki',
            name: '雪儿 (Yuki)',
            tags: '文艺清新 · 艺术家',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbgfp6U8EcsCgCPH6smvmR4I8cm8VoyvdGxoLptC5s3zz2YMMQyIdSSNghLAZ_AkdeAiFtWMUkDY8ON7WehZg6Hr8tml6KeJ8z4ctYrQv0hU4OPpk-7mMbdWRG0CYBcanCarRubcxk6Vh8zUp_Gre0RqD_033SK3k-dTscVyg1G7wTJONVN5VeToBSJ9EKBkImz2yNLpHMZCwllTsYx-8DZEKA1oPoaaManS-0sIQTs7k3Z-pWs6shYsjsYpyVr1qVfo4GDkc85WI',
            status: 'online',
            personality: '安静、感性、富有创意。喜欢绘画和音乐的你，一定会和她在艺术的海洋里找到共鸣。',
            gender: 'female',
            favorited: true
        }
    ];

    return (
        <div className="bg-[#f8f7f6] dark:bg-[#1b130d] font-display text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen">
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    {/* Header/Navigation */}
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#ee7c2b]/10 px-6 md:px-10 py-4 bg-[#f8f7f6]/80 dark:bg-[#1b130d]/80 backdrop-blur-md sticky top-0 z-50">
                        <div className="flex items-center gap-4 md:gap-8">
                            <button
                                onClick={() => navigate(l('/companion'))}
                                className="flex items-center gap-2 md:gap-3 text-[#ee7c2b] hover:opacity-80 transition-opacity"
                            >
                                <div className="size-8 bg-[#ee7c2b] rounded-lg flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined">smart_toy</span>
                                </div>
                                <h2 className="text-slate-900 dark:text-slate-100 text-lg md:text-xl font-bold leading-tight tracking-tight">AI Companion</h2>
                            </button>
                            <nav className="hidden md:flex items-center gap-6">
                                <button onClick={() => navigate(l('/'))} className="text-slate-600 dark:text-slate-400 hover:text-[#ee7c2b] transition-colors text-sm font-medium leading-normal">首页</button>
                                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                <button onClick={() => navigate(l('/companion/daily'))} className="text-[#ee7c2b] text-sm font-semibold border-b-2 border-[#ee7c2b] pb-1">日常陪伴</button>
                                <button onClick={() => navigate(l('/companion/senior'))} className="text-slate-600 dark:text-slate-400 hover:text-[#ee7c2b] transition-colors text-sm font-medium leading-normal">长者关怀</button>
                                <button onClick={() => navigate(l('/companion/mental'))} className="text-slate-600 dark:text-slate-400 hover:text-[#ee7c2b] transition-colors text-sm font-medium leading-normal">心理健康</button>
                                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                {/* 规划中功能按钮 */}
                                <button className="text-slate-400 dark:text-slate-500 hover:text-[#ee7c2b] transition-colors text-sm font-medium">探索</button>
                                <button className="text-slate-400 dark:text-slate-500 hover:text-[#ee7c2b] transition-colors text-sm font-medium">我的伙伴</button>
                            </nav>
                        </div>
                        <div className="flex flex-1 justify-end gap-3 md:gap-6 items-center">
                            <label className="hidden lg:flex flex-col min-w-40 h-10 max-w-64">
                                <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-slate-200/50 dark:bg-slate-800/50 border border-transparent focus-within:border-[#ee7c2b]/30">
                                    <div className="text-slate-500 flex items-center justify-center pl-4 rounded-l-xl">
                                        <span className="material-symbols-outlined text-[20px]">search</span>
                                    </div>
                                    <input className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 h-full placeholder:text-slate-500 px-4 pl-2 text-sm font-normal" placeholder="搜索功能..." />
                                </div>
                            </label>
                            <button onClick={() => navigate(l('/login'))} className="flex min-w-[70px] md:min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-10 px-4 md:px-6 bg-[#ee7c2b] text-white text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-[#ee7c2b]/20">
                                <span className="truncate">登录</span>
                            </button>
                            <div className="hidden sm:block bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-[#ee7c2b]/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDU0w_siZ42eKX4bX3jo_ZbsmPOmW8Yzj9mBUE7lV27pRD4Q_Hsd_VNSSvOS_xr5921Q6rI0OXZWzL10S9Oj6DgrmIQMzBVY7SFLdSS6GP5CXB2JlWWx1RxdNSXAau0OntW6F-3m5unAJCtw48sI9lJoEC6x_Jac94FTlY_CgcbL4LHvMX3PS79laJIEjAKDXg4qNqq92itzl4gsfydmg8aqWr5sDnDnULPaXXilSsi7q6e5uoyBklsiq6DV8bAeS0BjqLRN2a945s")' }}></div>

                            {/* Mobile Menu Toggle */}
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden flex items-center justify-center p-2 text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                            </button>
                        </div>

                        {/* Mobile Dropdown Menu */}
                        {isMobileMenuOpen && (
                            <div className="absolute top-full left-0 right-0 bg-[#f8f7f6] dark:bg-[#1b130d] border-b border-[#ee7c2b]/10 shadow-lg md:hidden flex flex-col p-6 gap-6 z-50 animate-fadeIn">
                                <button onClick={() => { navigate(l('/')); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-200">首页</button>
                                <button onClick={() => { navigate(l('/companion/daily')); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-slate-100 dark:border-slate-800 font-semibold text-[#ee7c2b]">日常陪伴</button>
                                <button onClick={() => { navigate(l('/companion/senior')); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-200">长者关怀</button>
                                <button onClick={() => { navigate(l('/companion/mental')); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-200">心理健康</button>
                                <button onClick={() => { navigate(l('/login')); setIsMobileMenuOpen(false); }} className="w-full py-4 bg-[#ee7c2b] text-white text-center rounded-xl font-bold">登录 / 注册</button>
                            </div>
                        )}
                    </header>

                    <main className="flex flex-col items-center w-full max-w-7xl mx-auto px-6 md:px-10 py-12">
                        {/* Hero Section */}
                        <div className="w-full flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                            <div className="flex flex-col gap-4 max-w-2xl text-left">
                                <h1 className="text-slate-900 dark:text-slate-100 text-3xl md:text-5xl font-black leading-tight tracking-tight">选择您的AI伴侣</h1>
                                <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg font-normal">寻找懂你的数字伙伴，开启每日温馨陪伴。无论是倾听心事，还是分享快乐，他们永远在这里。</p>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="w-full bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-10">
                            <div className="flex flex-col gap-6 font-display text-left">
                                <label className="flex flex-col w-full h-auto min-h-14">
                                    <div className="flex w-full flex-1 flex-col sm:flex-row items-stretch rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-[#ee7c2b]/50">
                                        <div className="flex flex-1">
                                            <div className="text-slate-400 flex items-center justify-center pl-4">
                                                <span className="material-symbols-outlined text-[24px]">search</span>
                                            </div>
                                            <input className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 h-14 placeholder:text-slate-400 px-4 pl-2 text-base md:text-lg font-normal" placeholder="搜索AI伴侣名称或关键词" />
                                        </div>
                                        <button className="bg-[#ee7c2b] text-white px-8 py-3 sm:py-0 font-bold hover:bg-[#ee7c2b]/90 transition-colors">搜索</button>
                                    </div>
                                </label>
                                <div className="flex gap-3 flex-wrap items-center">
                                    <span className="text-sm font-bold text-slate-500 w-full sm:w-auto mb-1 sm:mb-0">筛选条件:</span>
                                    <div className="flex gap-2 flex-wrap">
                                        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#ee7c2b] text-white px-4">
                                            <span className="text-sm font-semibold">全部</span>
                                            <span className="material-symbols-outlined text-[16px]">expand_more</span>
                                        </button>
                                        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 hover:bg-slate-200 transition-colors">
                                            <span className="text-sm font-semibold text-nowrap">女性</span>
                                            <span className="material-symbols-outlined text-[16px]">female</span>
                                        </button>
                                        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 hover:bg-slate-200 transition-colors">
                                            <span className="text-sm font-semibold text-nowrap">男性</span>
                                            <span className="material-symbols-outlined text-[16px]">male</span>
                                        </button>
                                        <div className="hidden sm:block h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 hover:bg-slate-200 transition-colors">
                                            <span className="text-sm font-semibold text-nowrap">甜美系</span>
                                        </button>
                                        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 hover:bg-slate-200 transition-colors">
                                            <span className="text-sm font-semibold text-nowrap">知性</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Profiles Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
                            {aiProfiles.map((profile) => (
                                <div key={profile.id} className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800 group text-left">
                                    <div className="relative w-full aspect-[4/5] overflow-hidden">
                                        <div className="absolute inset-0 bg-center bg-no-repeat bg-cover group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url("${profile.avatar}")` }}></div>
                                        <div className="absolute top-4 left-4">
                                            <span className={`text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${profile.status === 'online' ? 'bg-green-500' : 'bg-slate-400'}`}>
                                                {profile.status === 'online' ? '在线' : '离线'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{profile.name}</h3>
                                            <span className={`${profile.favorited ? 'text-[#ee7c2b]' : 'text-slate-300 dark:text-slate-700'} material-symbols-outlined cursor-pointer hover:scale-110 transition-transform`}>favorite</span>
                                        </div>
                                        <p className="text-[#ee7c2b] font-semibold text-sm mb-3">{profile.tags}</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                                            性格：{profile.personality}
                                        </p>
                                        <div className="mt-auto">
                                            <button onClick={() => navigate(l(`/companion/chat?name=${encodeURIComponent(profile.name)}&gender=${profile.gender}`))} className="w-full py-3 bg-[#ee7c2b] text-white rounded-xl font-bold hover:bg-[#ee7c2b]/90 transition-colors flex items-center justify-center gap-2">
                                                <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                                                开始聊天
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More / Pagination */}
                        <div className="mt-16 flex justify-center">
                            <button className="flex items-center gap-2 px-8 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all">
                                加载更多伙伴
                                <span className="material-symbols-outlined">keyboard_arrow_down</span>
                            </button>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="mt-auto py-12 px-6 md:px-10 border-t border-slate-200 dark:border-slate-800 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 text-[#ee7c2b]">
                                <span className="material-symbols-outlined">smart_toy</span>
                                <span className="font-bold text-lg">AI Companion</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">© 2024 AI Companion. 为您提供全天候的情感支持与陪伴。</p>
                            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-2">
                                <a className="text-slate-400 hover:text-[#ee7c2b] transition-colors text-sm" href="#tos">用户协议</a>
                                <a className="text-slate-400 hover:text-[#ee7c2b] transition-colors text-sm" href="#privacy">隐私政策</a>
                                <a className="text-slate-400 hover:text-[#ee7c2b] transition-colors text-sm" href="#contact">联系我们</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default DailyCompanionPage;
