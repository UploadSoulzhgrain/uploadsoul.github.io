import React from 'react';
import { motion } from 'framer-motion';

export const PlayfulLayout = ({ data, onBack }) => {
    const petName = data.name || '小黄';
    const species = data.species || '金毛犬';
    const age = data.birthday ? `${new Date().getFullYear() - new Date(data.birthday).getFullYear()}岁` : '2岁';
    const bio = data.bio || '一只超级爱吃零食的阳光金毛寻回犬。欢迎来到我的数字小天地，这里记录了我所有的调皮瞬间和温馨回忆！';

    return (
        <div className="min-h-screen selection:bg-[#f4d125]/30 text-slate-900" style={{ backgroundColor: '#fdfaf1', fontFamily: '"Spline Sans", "Noto Sans SC", sans-serif' }}>
            <style>
                {`
                .wobbly-border {
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                }
                .speech-bubble {
                    position: relative;
                }
                .speech-bubble::after {
                    content: '';
                    position: absolute;
                    bottom: -15px;
                    left: 40px;
                    border-width: 15px 15px 0;
                    border-style: solid;
                    border-color: white transparent;
                    display: block;
                    width: 0;
                }
                .sticky-note {
                    transform: rotate(-1deg);
                    transition: transform 0.3s ease;
                }
                .sticky-note:nth-child(even) {
                    transform: rotate(2deg);
                }
                .sticky-note:hover {
                    transform: scale(1.05) rotate(0deg);
                }
                .bg-pattern {
                    background-image: radial-gradient(#f4d125 0.5px, transparent 0.5px);
                    background-size: 20px 20px;
                }
                `}
            </style>

            {/* Back Button */}
            <nav className="fixed top-6 left-6 z-50">
                <button
                    onClick={onBack}
                    className="bg-white px-6 py-3 rounded-full shadow-lg border-2 border-[#f4d125] flex items-center gap-2 font-bold text-slate-900 hover:scale-105 transition-transform"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span>返回档案馆</span>
                </button>
            </nav>

            {/* Decorative Floating Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
                <span className="material-symbols-outlined absolute top-10 left-10 text-[#f4d125] text-6xl">pets</span>
                <span className="material-symbols-outlined absolute top-1/4 right-20 text-[#f4d125] text-4xl">favorite</span>
                <span className="material-symbols-outlined absolute bottom-1/4 left-20 text-[#f4d125] text-5xl">skeleton</span>
                <span className="material-symbols-outlined absolute bottom-10 right-10 text-[#f4d125] text-7xl">pets</span>
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 bg-pattern">
                {/* Hero Section */}
                <section className="flex flex-col lg:flex-row items-center gap-12 mb-20 pt-16">
                    <div className="relative w-full lg:w-1/2">
                        {/* Whimsical Photo Frame */}
                        <motion.div
                            initial={{ rotate: -5, scale: 0.9 }}
                            animate={{ rotate: 0, scale: 1 }}
                            className="wobbly-border bg-[#f4d125]/20 p-4"
                        >
                            <div className="wobbly-border overflow-hidden bg-white border-8 border-white shadow-xl aspect-square">
                                <img
                                    className="w-full h-full object-cover"
                                    src={data.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAdZNI6IlC1qJgC8SHKH52B56Co0-DLVffYUAcUH3B3-q7t9oUXW-WhG6megCLGJU-14fYXwQ483jXDlIkb0LTsPuzRPkETSsepFq_Robz1Q8OPRhAD5A1_ldi1vnbQ1CgIQ4M8pOKmB00OkWOPNDnXXz9dYqob9ZyjNpM_S-QvrC8EdRcCZ6FjX20Iob7VEZTUcQq_yyX8cRu3rL6kQ0jbE3ZjeKmzD2T28RnCUiSDlSW9y0PE0wTndrCCly7EqRHQpTXu1Nn3dJs"}
                                    alt={petName}
                                />
                            </div>
                        </motion.div>
                        {/* Floating Badge */}
                        <div className="absolute -top-4 -right-4 bg-[#f4d125] text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg transform rotate-12">
                            人气王 ✨
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 space-y-8">
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-white p-10 rounded-3xl speech-bubble shadow-xl border-4 border-[#f4d125]/10"
                        >
                            <h1 className="text-5xl font-black text-slate-900 mb-4 leading-tight">
                                嘿！我是{petName}！🐾
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                {bio}
                            </p>
                        </motion.div>

                        <div className="flex flex-wrap gap-4">
                            <button className="bg-[#f4d125] hover:scale-105 active:scale-95 transition-transform text-slate-900 font-black px-8 py-4 rounded-full text-lg shadow-[0_8px_0_0_#d4b51a] flex items-center gap-2">
                                <span className="material-symbols-outlined">favorite</span>
                                给它点个赞
                            </button>
                            <button className="bg-white hover:scale-105 active:scale-95 transition-transform text-slate-900 font-bold px-8 py-4 rounded-full text-lg border-2 border-[#f4d125] shadow-lg flex items-center gap-2">
                                <span className="material-symbols-outlined">chat</span>
                                打个招呼
                            </button>
                        </div>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    <div className="bg-[#f4d125]/10 border-2 border-dashed border-[#f4d125] rounded-3xl p-6 text-center group hover:bg-[#f4d125]/20 transition-colors">
                        <span className="material-symbols-outlined text-4xl text-[#f4d125] mb-2">cake</span>
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">我的年龄</p>
                        <p className="text-3xl font-black text-slate-900">{age}</p>
                    </div>
                    <div className="bg-[#e0f2f1]/30 border-2 border-dashed border-teal-300 rounded-3xl p-6 text-center group hover:bg-[#e0f2f1]/50 transition-colors">
                        <span className="material-symbols-outlined text-4xl text-teal-500 mb-2">fingerprint</span>
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">我的品种</p>
                        <p className="text-3xl font-black text-slate-900">{species}</p>
                    </div>
                    <div className="bg-[#fce4ec]/30 border-2 border-dashed border-pink-300 rounded-3xl p-6 text-center group hover:bg-[#fce4ec]/50 transition-colors">
                        <span className="material-symbols-outlined text-4xl text-pink-500 mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">元气值</p>
                        <p className="text-3xl font-black text-slate-900">100%</p>
                    </div>
                    <div className="bg-[#f4d125]/10 border-2 border-dashed border-[#f4d125] rounded-3xl p-6 text-center group hover:bg-[#f4d125]/20 transition-colors">
                        <span className="material-symbols-outlined text-4xl text-[#f4d125] mb-2">fitness_center</span>
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">我的体重</p>
                        <p className="text-3xl font-black text-slate-900">{data.weight || '28kg'}</p>
                    </div>
                </section>

                {/* Habits Section */}
                <section className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="bg-[#f4d125] p-3 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-900">auto_awesome</span>
                        </span>
                        <h2 className="text-4xl font-black">生活习性</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-3xl border-t-8 border-[#f4d125] shadow-xl relative overflow-hidden sticky-note">
                            <div className="flex items-start gap-4 text-left">
                                <div className="bg-[#f4d125]/20 p-4 rounded-2xl">
                                    <span className="material-symbols-outlined text-[#f4d125] text-3xl">restaurant</span>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-2xl font-black mb-2 truncate">最爱零食</h3>
                                    <p className="text-slate-600 text-lg leading-relaxed">
                                        {data.favoriteFood || '除了狗粮，我最喜欢冻干鸡肉、蓝莓和香蕉。每当主人打开冰箱，我都会光速出现！'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border-t-8 border-teal-300 shadow-xl relative overflow-hidden sticky-note">
                            <div className="flex items-start gap-4 text-left">
                                <div className="bg-[#e0f2f1] p-4 rounded-2xl">
                                    <span className="material-symbols-outlined text-teal-600 text-3xl">park</span>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-2xl font-black mb-2 truncate">每日散步</h3>
                                    <p className="text-slate-600 text-lg leading-relaxed">
                                        每天傍晚是我最期待的时刻。我们会在公园里跑上两圈，追逐落日下的蝴蝶。
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border-t-8 border-pink-300 shadow-xl relative overflow-hidden sticky-note">
                            <div className="flex items-start gap-4 text-left">
                                <div className="bg-[#fce4ec] p-4 rounded-2xl">
                                    <span className="material-symbols-outlined text-pink-600 text-3xl">bedtime</span>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-2xl font-black mb-2 truncate">睡眠习惯</h3>
                                    <p className="text-slate-600 text-lg leading-relaxed">
                                        我是个专业的呼噜大师！喜欢趴在凉席上或者主人的拖鞋旁边睡觉，非常有安全感。
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border-t-8 border-[#f4d125] shadow-xl relative overflow-hidden sticky-note">
                            <div className="flex items-start gap-4 text-left">
                                <div className="bg-[#f4d125]/20 p-4 rounded-2xl">
                                    <span className="material-symbols-outlined text-[#f4d125] text-3xl">toys</span>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-2xl font-black mb-2 truncate">调皮瞬间</h3>
                                    <p className="text-slate-600 text-lg leading-relaxed">
                                        {data.favoriteToy ? `最喜欢玩${data.favoriteToy}。` : ''}偶尔我会化身“拆家小能手”，特别是喜欢藏主人的袜子。那是我的秘密宝藏！
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Memory Wall */}
                <section className="mb-20 text-left">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="bg-[#f4d125] p-3 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-900">photo_library</span>
                        </span>
                        <h2 className="text-4xl font-black">珍贵回忆</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(data.memories || []).length > 0 ? data.memories.map((memory, i) => (
                            <div key={i} className="sticky-note bg-white p-4 shadow-xl border border-slate-100 flex flex-col rounded-sm">
                                <div className="bg-slate-200 aspect-square mb-4 rounded-sm overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={memory.image || `https://picsum.photos/seed/mem-${i}/600/600`}
                                        alt={memory.title}
                                    />
                                </div>
                                <div className="px-2 pb-2">
                                    <h4 className="font-bold text-lg mb-1">{memory.title}</h4>
                                    <p className="text-slate-500 text-sm italic">{memory.date}</p>
                                </div>
                            </div>
                        )) : [
                            { title: '初次见面', date: '2022年10月15日', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4rVNVJGOaZ84OOUoPap4S6WMMo0Yv1rPLknP5aWNPttaLa9UsLEcKkDCoFrOpnlndsN1z0rzj7R3S73cxScGyK2YJt0zo84C8EUzIyQmBBffs0HbYcUx_sG0APKilvTF-eYQhREb7hGEm1BI1qi9zGynn83fCR0AcjCXg0PCgxpWIQnJeCUHPs16dEFhs-qLm2MPsmIEjAp7TwICUahJ8SM-p0j_V-LNzScnNEL2VqJyVoPKcr1LlXV8ojV26wkNsAkerB1X9Av0' },
                            { title: '交到新朋友', date: '2023年3月20日', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIfou6enkiauN8qCIj6lk7m6XcnsbqAxigxIZBOqYhdtXSSM5CbPfDfOB26kIJktO6aP8KlppS700oNNv03H7bVe0VzcxvPlhFo4QynFDKo3IsPHEHpjeQkRYwNxsR4ktDiMPfDtxqLzjMmrox71oBueIOLp5HQZWW12k1z215wgGPL_CzonIKWdQVlBoU-prLS-74EfVPObTbborRuugT22vKSJCDi8QXVHrp7uWBLQh4P3TzWHSwjndS2KGb5dRikcZyc8jQK9A' },
                            { title: '两岁生日', date: '2024年10月15日', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4F6wQkV4jlvPhUaCW1pbHRoq6us73U1ybm94UUr9728WKSjpL9LiAqTZqYDMgsqFuTOQSLR6HghOshvFi483QFGgh2z7Iyse8BgAPi5BgZTrrJUD2yLdJAhT5sMtMpRDgOZD-XHZaBy4T6wg-33VvNu0GJJvk2BtDlvzkEd5z-QZKUSOyL37tc5ZvTuRk5fFC32rOSDMEu8AtTyQHhIuV61Rh7vQDuXoFaXN3QEPO87jygcCQc7YF7UcUBBiC0-u8x121fUkYHAw' }
                        ].map((m, i) => (
                            <div key={i} className="sticky-note bg-white p-4 shadow-xl border border-slate-100 flex flex-col rounded-sm">
                                <div className="bg-slate-200 aspect-square mb-4 rounded-sm overflow-hidden">
                                    <img className="w-full h-full object-cover" src={m.img} alt={m.title} />
                                </div>
                                <div className="px-2 pb-2">
                                    <h4 className="font-bold text-lg mb-1">{m.title}</h4>
                                    <p className="text-slate-500 text-sm italic">{m.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="text-center py-20 mt-12 border-t border-slate-200">
                    <div className="inline-flex flex-col items-center gap-6">
                        <div className="bg-[#f4d125]/20 p-8 rounded-full">
                            <span className="material-symbols-outlined text-[#f4d125] text-6xl">waving_hand</span>
                        </div>
                        <h3 className="text-3xl font-black">记得常来找我玩哦！</h3>
                        <div className="flex gap-4">
                            <span className="bg-[#f4d125]/10 text-[#f4d125] px-4 py-2 rounded-full font-bold">#{species}</span>
                            <span className="bg-[#f4d125]/10 text-[#f4d125] px-4 py-2 rounded-full font-bold">#萌宠专区</span>
                            <span className="bg-[#f4d125]/10 text-[#f4d125] px-4 py-2 rounded-full font-bold">#元气满满</span>
                        </div>
                        <p className="text-slate-400 text-sm mt-8">© 2024 萌宠档案页 | 记录每一刻萌动瞬间</p>
                    </div>
                </footer>
            </main>
        </div>
    );
};
