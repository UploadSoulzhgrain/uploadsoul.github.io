import React from 'react';
import { motion } from 'framer-motion';

export const EditorialLayout = ({ data, onBack }) => {
    const petName = data.name || '雪球';
    const petEnglishName = 'Snowball';
    const species = data.species || '布偶猫';
    const bio = data.bio || '“在静谧的时光里，它是唯一的旋律。记录关于灵魂交汇的每一个瞬间。”';
    const habits = data.habits || ['日光浴学者', '深夜伴读', '挑剔的美食家'];

    return (
        <div className="min-h-screen selection:bg-[#64c91d]/30 text-slate-900" style={{ backgroundColor: '#f7f8f6', fontFamily: "'Newsreader', serif" }}>
            <style>
                {`
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
                .drop-cap::first-letter {
                    float: left;
                    font-size: 4rem;
                    line-height: 1;
                    padding-right: 0.5rem;
                    color: #64c91d;
                }
                .asymmetric-grid {
                    display: grid;
                    grid-template-columns: repeat(12, 1fr);
                    gap: 1.5rem;
                }
                @keyframes reveal {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .reveal-on-scroll {
                    animation: reveal 1s ease-out forwards;
                }
                `}
            </style>

            {/* Sidebar Navigation */}
            <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-6 text-[10px] tracking-[0.2em] uppercase text-slate-400">
                <a className="hover:text-[#64c91d] transition-colors" href="#hero">01 Intro</a>
                <a className="hover:text-[#64c91d] transition-colors" href="#gallery">02 Vision</a>
                <a className="hover:text-[#64c91d] transition-colors" href="#narrative">03 Narrative</a>
                <a className="hover:text-[#64c91d] transition-colors" href="#habits">04 Life</a>
                <button onClick={onBack} className="mt-8 hover:text-[#64c91d] transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">arrow_back</span>
                    BACK
                </button>
            </nav>

            <main className="max-w-[1440px] mx-auto overflow-x-hidden">
                {/* Hero Spread Section */}
                <section className="relative h-screen w-full flex items-center justify-center px-10 py-20" id="hero">
                    <div className="relative w-full h-full overflow-hidden rounded-xl bg-slate-200">
                        <div className="absolute inset-0 bg-black/20 z-10"></div>
                        <img
                            className="w-full h-full object-cover"
                            src={data.bannerUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAQQBh1AfM37A9DxkpfJfrKTj-e99CVIOoj3VEBno-x5QfpUIbfcqa2Go1bM2vyFj3BPUZxd1gXfUBge2gp-gZE2Lk3AwGmq2q_cs2qx_hdpyKROmZ7MDGB-nwtW3FLBmNOiAUSylPNRlsftiAF9oSGn4jHiMp0R_MYYCYcH2l7aqT0ZwYwpCsHcYWMJ9-XP7BoIyzhqXFxv8Y4LksDx4QCu_QK7WEDv5AvSbteQP1471AmYmhyyzC301ZyVzlrzGH1id1uhasL8U8"}
                            alt={petName}
                        />
                        <div className="absolute right-12 top-12 z-20 vertical-text h-fit">
                            <motion.h1
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1 }}
                                className="text-white text-8xl font-light tracking-tighter leading-none opacity-90"
                            >
                                {petName} <span className="text-[#64c91d] italic">{petEnglishName}</span>
                            </motion.h1>
                            <p className="text-white/70 text-sm tracking-[0.5em] mt-8 uppercase">Special Editorial Issue No. 03</p>
                        </div>
                        <div className="absolute bottom-12 left-12 z-20 max-w-md">
                            <motion.p
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="text-white text-xl font-light leading-relaxed italic"
                            >
                                {bio}
                            </motion.p>
                            <div className="mt-6 h-[1px] w-24 bg-[#64c91d]"></div>
                        </div>
                    </div>
                </section>

                {/* Asymmetrical Gallery (Vision) */}
                <section className="py-32 px-10" id="gallery">
                    <div className="flex flex-col mb-20 text-center">
                        <span className="text-[#64c91d] text-xs tracking-widest uppercase mb-4">Chapter 01</span>
                        <h2 className="text-5xl font-light tracking-tight">视觉档案 / Vision Archive</h2>
                    </div>
                    <div className="asymmetric-grid">
                        <div className="col-span-7 row-span-2 group overflow-hidden rounded-lg">
                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                <img
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    src={data.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDDzX_KiwB5N6QrcOz7JMFcTjHMWW761XOPhp80r0T_DtIGIxBmAJerU2w6OTA9HtCwDNt3wyq020HhGP37lSW81QVDVXSU1zPv0olU6-I-tKBf3RE1TlokueuQrawHv4AKw__mGM0uJKPliCWBKipCp1s4KtCqYv657-bJiIMk7OmZR29hIAbBLMPIdwmmtIeiWOoXfap3-PkUyW0RI-HXABY4Kl2H12eUW_2JzZhQ8GoC6DCWh9uR7zW4Bn8SglWi7SJJ5Wk88YE"}
                                    alt="Vision 1"
                                />
                                <div className="absolute bottom-4 left-4 text-white text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                                    MORNING LIGHT IN THE STUDY / 07:45 AM
                                </div>
                            </div>
                        </div>
                        <div className="col-span-5 flex flex-col justify-center px-12">
                            <h3 className="text-3xl font-light italic mb-6">晨曦中的静谧</h3>
                            <p className="text-slate-500 leading-relaxed font-light">
                                当第一缕阳光穿透百叶窗，它总是准时出现在那把老橡树椅上。光影在它的绒毛上跳跃，仿佛一场无声的交响乐。
                            </p>
                        </div>
                        <div className="col-span-4 mt-12 overflow-hidden rounded-lg">
                            <div className="relative aspect-[3/4] w-full">
                                <img
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1V4cB3mF7-mYG-SH43PUMZvKTdaTBCtrbJZKqdymt0A3rzC-xNFactk_SPAyK4PWGsybRP7qxCwOF-T1K5bh4Y7qHMmfeNIz6f9ZjvIWMAm1jgrelcl4wqMgD2mwuPp90RO5BzAVpsHmvilRb7LUYnUjqj3RAemsOfkjGb2pKHicr-ZsZyf9ipkkZ29k0Z8VyBXPwzNdvwHokI8X4bVOSSRMrog_SpaC5iUJIesPAhfF_tG3A7BxQbNs6ZFg-nogOwspkPJt8TvU"
                                    alt="Vision 2"
                                />
                            </div>
                        </div>
                        <div className="col-span-5 mt-[-4rem] z-10 overflow-hidden rounded-lg shadow-2xl">
                            <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center">
                                <img
                                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFXrTvDIU9MEXAwijxiS239pSU_8zv1CLn8yU5UDD7aRThmrOyR-Qni38Yz-E_1-Ld14E_JUTc__o0cAQqY13hFgMuPFafV99S3_KqVpcA8tu2yZtrO8iabLlRwh7iyHzy70wxv2jaxteyYDxcsgSMzOz4-Xocrsi4WMqtfTfYNwvH_W-N8BSfczMkcax6EKEaEGxzHOZjwLXLG8nYeK66-ka5ncbnjETriutNmXrvMxGegqMU8NxqSgLDsxxyLGctNg2U8t44fSU"
                                    alt="Video still"
                                />
                                <span className="material-symbols-outlined text-white text-6xl font-extralight cursor-pointer hover:scale-110 transition-transform">play_circle</span>
                            </div>
                            <div className="bg-white p-6">
                                <p className="text-[10px] uppercase tracking-widest text-[#64c91d] font-bold">Cinematic Loop</p>
                                <p className="text-sm italic text-slate-400 mt-2">The rhythmic movement of a heartbeat.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Editorial Text Block (Narrative) */}
                <section className="py-32 bg-white" id="narrative">
                    <div className="max-w-4xl mx-auto px-10">
                        <div className="mb-16 border-b border-slate-100 pb-12">
                            <h2 className="text-6xl font-light mb-4">深度记忆</h2>
                            <p className="text-[#64c91d] italic text-lg">A Narrative of Growth and Connection</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            <div className="space-y-6">
                                <p className="drop-cap text-slate-700 dark:text-slate-300 leading-loose text-justify">
                                    生活在一座快节奏的城市，我们往往忽略了生命的细微之处。直到它的出现，那种纯粹的、不带任何目的的陪伴，重新定义了我对“家”的理解。它不是一个过客，而是一位无言的思想家，用每一次温柔的触碰消解白日的疲惫。
                                </p>
                                <p className="text-slate-700 dark:text-slate-300 leading-loose text-justify">
                                    从最初小心翼翼的试探，到如今无所顾忌的信赖，这段跨越物种的友谊在季节流转中沉淀。
                                </p>
                            </div>
                            <div className="space-y-6">
                                <p className="text-slate-700 dark:text-slate-300 leading-loose text-justify">
                                    记忆被碎片化地保存在相册里：它对飘落雪花的困惑，它在书桌旁陪我熬过的漫长夜晚，还有它那标志性的、带有一丝傲娇的凝视。每一个瞬间都像是精心构思的电影分镜。
                                </p>
                                <blockquote className="border-l-2 border-[#64c91d] pl-6 py-2 italic text-slate-500 text-lg">
                                    "爱不仅是言语，更是那些在静默中共同渡过的平庸日常。"
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Attributes Grid (Habits) */}
                <section className="py-32 px-10" id="habits">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <span className="text-[#64c91d] text-xs tracking-widest uppercase mb-4 block">Section 03</span>
                            <h2 className="text-5xl font-light">生活图鉴 / Daily Rituals</h2>
                        </div>
                        <div className="text-right text-slate-400 text-sm italic font-light">
                            Observed Behaviors & Individual Quirks
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-slate-200 border border-slate-200">
                        {habits.map((habit, idx) => (
                            <div key={idx} className="bg-[#f7f8f6] p-12 hover:bg-white transition-colors">
                                <span className="material-symbols-outlined text-[#64c91d] mb-6 scale-125">
                                    {idx === 0 ? 'wb_sunny' : idx === 1 ? 'menu_book' : 'filter_vintage'}
                                </span>
                                <h4 className="text-xl font-medium mb-4">{habit}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {idx === 0 ? '每日下午两点，精准占据客厅东南角的阳光带。那是它思考猫生、进行光合作用的神圣时刻。' :
                                        idx === 1 ? '它对书本翻动的声音有着特殊的迷恋，总是在我翻开书页时，轻轻跳上膝盖。' :
                                            '不仅对食材有着严格要求，甚至对盛放食物的瓷碗形状都有着微妙的坚持。'}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Cinematic Feature */}
                <section className="relative w-full aspect-[21/9] overflow-hidden group">
                    <img
                        className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7gMmleY84O6J2QqfvUDonMDgoJ__cIsek1B6Bq3T01AGkMfr-1_2HAyM8z-T-WF0RLILwkrhsQo2m_YKoEUXVczFZyPH_cfgwHToFzoTfAcDX6_gDDvX4PHGdtffiZd1qA8goZo6nGwFMtIrD0X3kIEE-lwsRkod5Vc7l3zACkCjmM6u8pXwsEczW5m6guSlqqa2o30UQ7uzXSmiy2ST_2YZN59xUHly2x93uX0GTB28IowBzG7bgxUv0FleSnuHcOOJak41NOLg"
                        alt="Cinematic feature"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center text-white">
                        <p className="text-[10px] tracking-[0.5em] uppercase opacity-60 mb-4">Final Movement</p>
                        <h3 className="text-4xl font-extralight tracking-widest italic">永恒的温柔</h3>
                    </div>
                </section>

                {/* Signature Footer */}
                <footer className="py-32 px-10 border-t border-slate-100">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="text-center md:text-left">
                            <p className="text-[#64c91d] italic text-2xl mb-2">{petName}'s Legacy</p>
                            <p className="text-xs tracking-widest text-slate-400 uppercase">Limited Edition Digital Archival / 2024</p>
                        </div>
                        <div className="flex gap-8 items-center text-slate-400">
                            <span className="material-symbols-outlined cursor-pointer hover:text-[#64c91d] transition-colors">share</span>
                            <span className="material-symbols-outlined cursor-pointer hover:text-[#64c91d] transition-colors">download</span>
                            <div className="h-10 w-[1px] bg-slate-200 mx-4"></div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold tracking-tighter">Authored By</p>
                                <p className="italic text-lg text-slate-600">Aris Zhao</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-20 text-center opacity-20">
                        <p className="text-[8px] tracking-[1em] uppercase">© 2024 萌宠档案馆 | 让每一份陪伴都被珍藏</p>
                    </div>
                </footer>
            </main>
        </div>
    );
};
