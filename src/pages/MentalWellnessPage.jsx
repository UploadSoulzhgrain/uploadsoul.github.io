import React from 'react';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';

const MentalWellnessPage = () => {
    const { navigate, l } = useLocalizedNavigate();

    const experts = [
        {
            id: 1,
            name: 'Dr. Serenity',
            title: '资深AI心理顾问',
            tags: '擅长：焦虑缓解、职场压力调解、正念引导。',
            services: '12.5k+',
            online: true,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnqAlbZNaYi5CyPcDWzVLwy-H2uts46t8m66PZUl1XHFeeTgvelKk1ywNJV7DYVGG8NndAdiJ7kt2oXJjPUHjkop-QAz2yCYxT6mqWOe8NAGsKDceppqt_6g0tcV7aDF0UIiwPA22kpqscduUHJKBfMfrECRfutA6xd91Cxtaz3quRbjDonztAbB7N8aMddN4T9lWB2Faqn5uODfL0t_MW-Qkh198OpsaI1tN0u85kckp6DJkdMAbIITl3OuEq6HRHWr5EGhZ-hV0'
        },
        {
            id: 2,
            name: '陈医生',
            title: '情绪管理专家',
            tags: '擅长：认知行为疗法 (CBT)、人际关系疏导。',
            services: '8.2k+',
            online: true,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdTnW4WswlHbNBQYOhu-ts5bWxE3QHNHqbJ3AiemEicX9x-MCpwMnDHXIb2eq3ducrkK0DTxNoJwC1lG7OCUROeaCgrPL76DnkpXJu1UnsIQ1DkdFQpGCWZ5zaN-7B-OsPn8bHaNs-G96vOA6QnbjhDg2XN1Dj61gsZk7NIYuSBo0ARU8frehxvYFUlYhS1Xg1QtPjahR87Pe2XEpil2PcLJc5SanoXE-e4AODXipZsBcjJinP_fix3hKrxWwQW25EU2sTkkrXTtg'
        },
        {
            id: 3,
            name: '林咨询师',
            title: '青少年心理关怀',
            tags: '擅长：亲子教育、青少年成长期困惑咨询。',
            services: '5.6k+',
            online: false,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTCh6ONIXTCEJtjFEMnk6jZceNlkYO36-AsMONW0N3o9qFGl70kyxOjUCpzNdS8wqImUNYRmm2AI03Zc_KYZ13MAirqhD6zuQeiHZnBLPtLIVqHRsNkPw18-dENWWr12EqaOFBs71PJYzuiXi2DAZbG1iyV3dSt3yUuAZtCCzApLT-D_Q-rPQlSYQUw40Kg3UEbicXT2PgNFaw-AcbTSabGVNMPldy4N0ogLewBe51OOKU2TZHa0FpajXRwXc_RV94zUbAifoh3ko'
        },
        {
            id: 4,
            name: 'Dr. Kenji',
            title: '职场心理健康',
            tags: '擅长：高压行业心理支持、高管职业倦怠管理。',
            services: '9.1k+',
            online: true,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW62d7u5r0BvhovNucBQLcnozrhVP8o3NzztmLheZOs0ue1DiwEeVvl6ef4w0qOX4Lonr39nhi9kPWPLP8KzSFxK1rkCJlBQmNzwe52uTKB9Hjq-1WHieGDr_Bd5umBDvvgeg1iAL7Kp9pCYsLVdti7JQLPqZb7VtEMTZCrYjBA3IiR4f9AoBYVpex-_cA9pOrlI63N0KkJzlTedVupO6BX89uUIFONbjn6Bl286w78QjUavxF3VanPr14WowLYaa5WZDTWyrA3dQ'
        }
    ];

    return (
        <div className="bg-[#f8f7f6] dark:bg-[#1b130d] text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen font-display">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                {/* Navigation */}
                <header className="flex items-center justify-between border-b border-[#ee7c2b]/10 px-6 py-4 lg:px-20 bg-white/80 dark:bg-[#1b130d]/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => navigate(l('/companion'))}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                            <div className="bg-[#ee7c2b] p-1.5 rounded-lg text-white">
                                <span className="material-symbols-outlined block">psychology</span>
                            </div>
                            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight">心灵避风港</h2>
                        </button>
                        <nav className="hidden xl:flex items-center gap-6">
                            <button onClick={() => navigate(l('/'))} className="text-slate-600 dark:text-slate-400 hover:text-[#ee7c2b] transition-colors text-sm font-medium leading-normal">首页</button>
                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                            <button onClick={() => navigate(l('/companion/daily'))} className="text-slate-600 dark:text-slate-400 hover:text-[#ee7c2b] transition-colors text-sm font-medium leading-normal">日常陪伴</button>
                            <button onClick={() => navigate(l('/companion/senior'))} className="text-slate-600 dark:text-slate-400 hover:text-[#ee7c2b] transition-colors text-sm font-medium leading-normal">长者关怀</button>
                            <button onClick={() => navigate(l('/companion/mental'))} className="text-[#ee7c2b] font-semibold text-sm border-b-2 border-[#ee7c2b] pb-0.5">心理健康</button>
                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                            {/* 规划中子页功能按钮 */}
                            <button className="text-slate-400 dark:text-slate-500 hover:text-[#ee7c2b] transition-colors text-sm font-medium">专业咨询</button>
                            <button className="text-slate-400 dark:text-slate-500 hover:text-[#ee7c2b] transition-colors text-sm font-medium">情绪追踪</button>
                            <button className="text-slate-400 dark:text-slate-500 hover:text-[#ee7c2b] transition-colors text-sm font-medium">冥想工具</button>
                        </nav>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center bg-[#ee7c2b]/5 dark:bg-white/5 rounded-full px-4 py-2 border border-[#ee7c2b]/10">
                            <span className="material-symbols-outlined text-[#ee7c2b] text-xl">search</span>
                            <input className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder:text-slate-400" placeholder="搜索资源或顾问" type="text" />
                        </div>
                        <button onClick={() => navigate(l('/login'))} className="bg-[#ee7c2b] hover:bg-[#ee7c2b]/90 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-[#ee7c2b]/20 transition-all">
                            个人中心
                        </button>
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-[#ee7c2b]/20">
                            <img alt="Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVSoYtX2H912CeZKBUNGp16mKp2fS2qkSTqzuacCqjLsDndqUCWR-x1Wv7fQg9ZHbh-pjbyoZ3HWNHGxyVovkgcKPtjLB7i3MKd3--BIKMNtxSg5H9wnXjLoqQHdyiSMpXFVSfv0YHiqXkLrI5yMQBHqsCZQtQGJnwtKdkPLAahnRuAmQwTJi8eDHpqHT2GZkUEsup_A3dwesBN7Q1Bh816I_rsHVIIULdgd2zDWX4IUztWCy4lrOkwr-At0JBRQA2yNkoysKBDNk" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 px-6 lg:px-20 py-10">
                    {/* Hero Section */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                        <div className="space-y-8 text-left">
                            <div className="inline-flex items-center gap-2 bg-[#ee7c2b]/10 text-[#ee7c2b] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                <span className="material-symbols-outlined text-sm">verified_user</span>
                                企业级安全隐私保护
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 leading-[1.1]">
                                您的私人<br /><span className="text-[#ee7c2b]">心理健康</span>顾问
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                                在安全、私密的空间里，开启您的心灵愈合之旅。我们的AI专家Dr. Serenity随时为您提供24/7的专业支持。
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="bg-[#ee7c2b] hover:bg-[#ee7c2b]/90 text-white px-8 py-4 rounded-xl text-base font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#ee7c2b]/20">
                                    <span className="material-symbols-outlined">chat</span>
                                    开启私密对话
                                </button>
                                <button className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-8 py-4 rounded-xl text-base font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                                    了解服务详情
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#ee7c2b]/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#ee7c2b]/20 rounded-full blur-3xl"></div>
                            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 relative z-10">
                                <img alt="Counselor" className="w-full h-[500px] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZCDd6-fCRthVhRrS57fl8aFXJ-81NzMON33gmyiv6SzMj3TqzeryVr7ZtGwEhv_ms15BGwS4fAX7I4lIe5TX2ZjweVq8u-NqmXIxuxjqscwIvRwhfVE-Hl-Mg9Asm9DwapyHthdEmivp1CSzIvQYk8ve9zZhAm8DMQaIt1nLWKtgkV-SpSMIQbIlNq3aNpx8QrYllcfvdPAxbe1TemryPUHL-GjjiYn7Vmex_obajRfnPyRSUFCF6EuS3kr7gHXe-2EGtsIJZUeY" />
                                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 dark:bg-[#1b130d]/90 backdrop-blur rounded-2xl border border-white/20 text-left">
                                    <p className="text-[#ee7c2b] font-bold">Dr. Serenity</p>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">资深AI心理学专家 · 已支持1.2万名用户</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Widgets */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow text-left">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined">analytics</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">情绪追踪</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">每日记录心情，AI将为您生成周度情绪健康报告。</p>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-3/4"></div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2">今日情绪平稳度：75%</p>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow text-left">
                            <div className="w-12 h-12 bg-[#ee7c2b]/10 text-[#ee7c2b] rounded-xl flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined">self_improvement</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">放松工具</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">访问正念冥想、白噪音与呼吸练习，舒缓焦虑。</p>
                            <button className="text-[#ee7c2b] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                进入练习室 <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow text-left">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined">lock</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">私密谈话室</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">端到端加密的纯净空间，您的谈话绝对保密。</p>
                            <button className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                立即接入 <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                    {/* Experts Section */}
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <div className="text-left">
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">推荐专家</h2>
                                <p className="text-slate-500 dark:text-slate-400">选择最适合您当前状态的AI或真人专家</p>
                            </div>
                            <button className="text-[#ee7c2b] font-bold hover:underline">查看全部专家</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {experts.map((expert) => (
                                <div key={expert.id} className="group bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 hover:-translate-y-1 transition-all text-left">
                                    <div className="aspect-[3/4] relative overflow-hidden">
                                        <img alt={expert.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={expert.avatar} />
                                        {expert.online && (
                                            <div className="absolute top-4 right-4 bg-emerald-500 w-3 h-3 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-lg font-bold">{expert.name}</h4>
                                        <p className="text-[#ee7c2b] text-xs font-bold mb-2">{expert.title}</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">{expert.tags}</p>
                                        <div className="mt-4 pt-4 border-t border-slate-50 dark:border-white/5 flex justify-between items-center">
                                            <span className="text-xs text-slate-400">服务次数: {expert.services}</span>
                                            <button className="bg-[#ee7c2b]/10 text-[#ee7c2b] px-3 py-1 rounded-lg text-xs font-bold hover:bg-[#ee7c2b] hover:text-white transition-colors">预约</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* B2B Section */}
                    <div className="bg-[#ee7c2b]/5 dark:bg-white/5 rounded-3xl p-10 lg:p-16 border border-[#ee7c2b]/10 flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6 text-left">
                            <h2 className="text-3xl font-bold">面向机构与企业的服务</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg">为您的团队提供系统化的心理健康支持，提升员工幸福感与创造力。</p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[#ee7c2b]">check_circle</span>
                                    <span>企业级后台数据驾驶舱</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[#ee7c2b]">check_circle</span>
                                    <span>定制化AI心理顾问服务</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[#ee7c2b]">check_circle</span>
                                    <span>EAP员工心理援助计划集成</span>
                                </li>
                            </ul>
                            <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">申请演示</button>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="bg-white dark:bg-[#1b130d] p-4 rounded-2xl shadow-xl border border-[#ee7c2b]/5">
                                <img alt="Dashboard" className="rounded-xl w-full h-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuwqarTqSlmac4RU79okbBlH3rzPRJ9ASbghZ2XZQkQ12fby7nUj05SSIs3DMCXVFxSY48m9IE68EIjrSlOIT2o4pFoa52vonLwa78r5VX_8I5xyWh7UgOzhDMAQDKyqD0zfkOwsvExeHaLITlviuS27KpohDTwM1p3q3MidnERqjPLHHMB6Pfmt7RZxb3j7ZAjqJDpcMNtwWd8KIucAuIi9YSeQa2Os1oC4PKXX8aXOiXfNREhiUm6IPD0gMbU5jiwDiRqwe8E1k" />
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-slate-50 dark:bg-white/5 px-6 lg:px-20 py-12 border-t border-slate-100 dark:border-white/5 mt-20">
                    <div className="grid md:grid-cols-4 gap-12 mb-12 text-left">
                        <div className="col-span-1 md:col-span-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#ee7c2b] p-1 rounded-lg text-white">
                                    <span className="material-symbols-outlined text-sm block">psychology</span>
                                </div>
                                <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold">心灵避风港</h2>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                我们致力于通过前沿AI技术与专业心理学知识，让心理支持触手可及。
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-400">产品</h4>
                            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                <li><a className="hover:text-[#ee7c2b] transition-colors" href="#chat">AI 对话</a></li>
                                <li><a className="hover:text-[#ee7c2b] transition-colors" href="#tracker">情绪追踪</a></li>
                                <li><a className="hover:text-[#ee7c2b] transition-colors" href="#mindfulness">正念课程</a></li>
                                <li><a className="hover:text-[#ee7c2b] transition-colors" href="#enterprise">企业版本</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-400">资源</h4>
                            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                <li><a className="hover:text-[#ee7c2b] transition-colors" href="#wiki">心理百科</a></li>
                                <li><a className="hover:text-[#ee7c2b] transition-colors" href="#report">研究报告</a></li>
                                <li><a className="hover:text-[#ee7c2b] transition-colors" href="#privacy">隐私协议</a></li>
                                <li><a className="hover:text-[#ee7c2b] transition-colors" href="#help">紧急帮助</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-400">联系我们</h4>
                            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                <li className="flex items-center gap-2 font-display uppercase tracking-tight"><span className="material-symbols-outlined text-xs">mail</span> support@sanctuary.com</li>
                                <li className="flex items-center gap-2"><span class="material-symbols-outlined text-xs">location_on</span> 上海市徐汇区城市核心区</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
                        <p>© 2024 心灵避风港 Sanctuary. 保留所有权利。</p>
                        <div className="flex gap-6">
                            <a className="hover:text-[#ee7c2b] transition-colors" href="#tos">用户协议</a>
                            <a className="hover:text-[#ee7c2b] transition-colors" href="#privacy">隐私政策</a>
                            <a className="hover:text-[#ee7c2b] transition-colors" href="#cookie">Cookie 设置</a>
                        </div>
                    </div>
                </footer>
            </div >
        </div >
    );
};

export default MentalWellnessPage;
