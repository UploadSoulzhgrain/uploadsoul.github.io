import React from 'react';

export const TemplateSelector = ({ selectedId, onSelect, onPreview }) => {
    const templates = [
        {
            id: 'classic',
            name: '电商详情风',
            subtitle: 'E-commerce Detail Style',
            badgeLabel: 'NARRATIVE',
            badgeColor: 'bg-primary/30 text-primary border-primary/30',
            description: '结构严谨的布局，清晰展示宠物生平、数据统计与成长相册，适合完整记录爱宠的每一个重要时刻。',
            previewContent: (
                <div className="flex flex-col h-full w-full bg-[#f8f7f6] text-[#1a1a1a] p-3">
                    {/* Mini breadcrumb */}
                    <div className="flex items-center gap-1 mb-2 text-[7px] text-slate-400">
                        <span>萌宠首页</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '8px' }}>chevron_right</span>
                        <span className="text-slate-700 font-bold">萌宠·小七</span>
                    </div>
                    {/* Mini product layout */}
                    <div className="flex gap-2 bg-white rounded-lg p-2 mb-2 flex-1">
                        <div className="w-1/2 aspect-square rounded overflow-hidden bg-slate-100 flex-shrink-0">
                            <img alt="Samoyed Dog" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_SAYnnQ3QsNkvvwWRDERIRQUnOd96b06mb9QUQsu0uY5Np1EpItY-JoNDN4cHqLf3NnG8lJdBL1stQyTuCnbiURdmVs9Rj6IJ19mp6w6FbtCa7EJUFtqf5q_oafvadfmcXsyQo371uM1OGeKUAC7CxAPXqFKR1OWmCyU1nYlg4M6mxfWtO7ezyv8w-IIFk_lt1P89HgylGtzhsuliSrp6kKlyI_E5TFdwQ4jpjVasvEE5yJOoOeOTZxlk0RGWfW9XIwIO2hjU3sc" />
                        </div>
                        <div className="flex-1 flex flex-col min-w-0">
                            <p className="text-[9px] font-bold truncate">萌宠·小七 - 萨摩耶</p>
                            <p className="text-[7px] text-slate-400 italic truncate mb-1">"治愈系微笑天使"</p>
                            <div className="rounded px-1.5 py-1 mb-1" style={{ background: 'rgba(238,157,43,0.08)' }}>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[7px] font-bold" style={{ color: '#ee9d2b' }}>元气值</span>
                                    <span className="text-sm font-extrabold" style={{ color: '#ee9d2b' }}>99,800</span>
                                </div>
                            </div>
                            <div className="space-y-0.5 text-[7px] mt-auto">
                                <div className="flex gap-1"><span className="text-slate-400 w-6">品种</span><span className="font-medium">萨摩耶</span></div>
                                <div className="flex gap-1"><span className="text-slate-400 w-6">性格</span><span className="font-medium">粘人、活泼</span></div>
                            </div>
                        </div>
                    </div>
                    {/* Mini tabs */}
                    <div className="flex gap-2 text-[7px] border-b border-slate-200 pb-1 mb-1">
                        <span className="font-bold" style={{ color: '#ee9d2b', borderBottom: '1px solid #ee9d2b' }}>宝贝详情</span>
                        <span className="text-slate-400">生活习性</span>
                        <span className="text-slate-400">成长相册</span>
                    </div>
                </div>
            )
        },
        {
            id: 'playful',
            name: '萌系卡通风',
            subtitle: 'Cute Cartoon Style',
            badgeLabel: 'CARTOON',
            badgeColor: 'bg-[#f4d125]/20 text-[#f4d125] border-[#f4d125]/30',
            description: '明快的黄色调配合趣味十足的对话框与拼贴设计，像漫画书一样记录爱宠充满生命力的每一个瞬间。',
            previewContent: (
                <div className="flex flex-col h-full w-full bg-[#fdfaf1] p-3 relative overflow-hidden">
                    {/* Decorative paw */}
                    <span className="material-symbols-outlined absolute top-2 right-2 text-[#f4d125]/20 text-3xl">pets</span>

                    <div className="flex gap-4 items-center mt-4">
                        <div className="w-24 h-24 bg-white border-4 border-white shadow-md rotate-[-3deg] overflow-hidden" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 30%' }}>
                            <img alt="Cute Golden" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdZNI6IlC1qJgC8SHKH52B56Co0-DLVffYUAcUH3B3-q7t9oUXW-WhG6megCLGJU-14fYXwQ483jXDlIkb0LTsPuzRPkETSsepFq_Robz1Q8OPRhAD5A1_ldi1vnbQ1CgIQ4M8pOKmB00OkWOPNDnXXz9dYqob9ZyjNpM_S-QvrC8EdRcCZ6FjX20Iob7VEZTUcQq_yyX8cRu3rL6kQ0jbE3ZjeKmzD2T28RnCUiSDlSW9y0PE0wTndrCCly7EqRHQpTXu1Nn3dJs" />
                        </div>
                        <div className="flex-1">
                            <div className="bg-white rounded-lg p-2 shadow-sm border-2 border-[#f4d125]/10 relative after:absolute after:left-[-6px] after:top-1/2 after:translate-y-[-50%] after:border-t-4 after:border-t-transparent after:border-b-4 after:border-b-transparent after:border-r-[6px] after:border-r-white">
                                <p className="text-[10px] font-black">嘿！我是小黄！🐾</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="bg-[#f4d125]/10 border-2 border-dashed border-[#f4d125] rounded-xl p-2 text-center">
                            <p className="text-[7px] text-slate-400">元气值</p>
                            <p className="text-[12px] font-black text-slate-800">100%</p>
                        </div>
                        <div className="bg-[#e0f2f1]/30 border-2 border-dashed border-teal-300 rounded-xl p-2 text-center font-bold">
                            <p className="text-[7px] text-slate-400">点赞数</p>
                            <p className="text-[12px] font-black text-slate-800">99k+</p>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2 overflow-hidden">
                        <div className="bg-white p-1 shadow-md border rotate-[2deg] flex-shrink-0 w-20">
                            <div className="aspect-square bg-slate-100 overflow-hidden mb-1">
                                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4rVNVJGOaZ84OOUoPap4S6WMMo0Yv1rPLknP5aWNPttaLa9UsLEcKkDCoFrOpnlndsN1z0rzj7R3S73cxScGyK2YJt0zo84C8EUzIyQmBBffs0HbYcUx_sG0APKilvTF-eYQhREb7hGEm1BI1qi9zGynn83fCR0AcjCXg0PCgxpWIQnJeCUHPs16dEFhs-qLm2MPsmIEjAp7TwICUahJ8SM-p0j_V-LNzScnNEL2VqJyVoPKcr1LlXV8ojV26wkNsAkerB1X9Av0" alt="puppy" />
                            </div>
                            <p className="text-[6px] font-bold text-center">初次见面</p>
                        </div>
                        <div className="bg-white p-1 shadow-md border rotate-[-1deg] flex-shrink-0 w-20">
                            <div className="aspect-square bg-slate-100 overflow-hidden mb-1">
                                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIfou6enkiauN8qCIj6lk7m6XcnsbqAxigxIZBOqYhdtXSSM5CbPfDfOB26kIJktO6aP8KlppS700oNNv03H7bVe0VzcxvPlhFo4QynFDKo3IsPHEHpjeQkRYwNxsR4ktDiMPfDtxqLzjMmrox71oBueIOLp5HQZWW12k1z215wgGPL_CzonIKWdQVlBoU-prLS-74EfVPObTbborRuugT22vKSJCDi8QXVHrp7uWBLQh4P3TzWHSwjndS2KGb5dRikcZyc8jQK9A" alt="friends" />
                            </div>
                            <p className="text-[6px] font-bold text-center">交到好友</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'editorial',
            name: '时尚杂志风',
            subtitle: 'Modern Magazine Style',
            badgeLabel: 'EDITORIAL',
            badgeColor: 'bg-[#64c91d]/20 text-[#64c91d] border-[#64c91d]/30',
            description: '极具张力的留白与非对称排版，配合优雅的衬线字体，将爱宠的一举一动打造为极具艺术感的杂志封面故事。',
            previewContent: (
                <div className="flex flex-col h-full w-full bg-[#f7f8f6] text-[#1a1a1a] relative overflow-hidden">
                    {/* Hero area */}
                    <div className="relative h-2/3 w-full bg-slate-200 overflow-hidden">
                        <img alt="Snowball" className="w-full h-full object-cover grayscale-[0.2]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQQBh1AfM37A9DxkpfJfrKTj-e99CVIOoj3VEBno-x5QfpUIbfcqa2Go1bM2vyFj3BPUZxd1gXfUBge2gp-gZE2Lk3AwGmq2q_cs2qx_hdpyKROmZ7MDGB-nwtW3FLBmNOiAUSylPNRlsftiAF9oSGn4jHiMp0R_MYYCYcH2l7aqT0ZwYwpCsHcYWMJ9-XP7BoIyzhqXFxv8Y4LksDx4QCu_QK7WEDv5AvSbteQP1471AmYmhyyzC301ZyVzlrzGH1id1uhasL8U8" />
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute right-4 top-4 vertical-text text-white">
                            <h4 className="text-2xl font-light tracking-tighter">雪球 <span className="text-[#64c91d] italic">Snowball</span></h4>
                        </div>
                        <div className="absolute bottom-4 left-4 border-l-2 border-[#64c91d] pl-2 text-white">
                            <p className="text-[10px] italic">"在静谧的时光里..."</p>
                        </div>
                    </div>
                    {/* Gallery area */}
                    <div className="p-3 grid grid-cols-2 gap-2 flex-1">
                        <div className="flex flex-col justify-center">
                            <h5 className="text-[10px] font-bold italic mb-1">视觉档案</h5>
                            <p className="text-[7px] text-slate-500 leading-tight">光影在绒毛上跳跃...</p>
                        </div>
                        <div className="rounded overflow-hidden">
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDzX_KiwB5N6QrcOz7JMFcTjHMWW761XOPhp80r0T_DtIGIxBmAJerU2w6OTA9HtCwDNt3wyq020HhGP37lSW81QVDVXSU1zPv0olU6-I-tKBf3RE1TlokueuQrawHv4AKw__mGM0uJKPliCWBKipCp1s4KtCqYv657-bJiIMk7OmZR29hIAbBLMPIdwmmtIeiWOoXfap3-PkUyW0RI-HXABY4Kl2H12eUW_2JzZhQ8GoC6DCWh9uR7zW4Bn8SglWi7SJJ5Wk88YE" alt="vision" />
                        </div>
                    </div>
                    {/* Footnote */}
                    <div className="absolute bottom-2 left-0 right-0 px-3 flex justify-between items-center opacity-30">
                        <span className="text-[6px] tracking-widest uppercase">Special Edition 03</span>
                        <span className="text-[6px]">© 2024 MOCHONG</span>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-20">
            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {templates.map((tpl) => (
                    <div key={tpl.id} className="flex flex-col group">
                        {/* Card with Preview */}
                        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white border-2 border-transparent transition-all duration-300"
                            style={{ '--tw-border-opacity': 1 }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--pet-primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                        >
                            {/* Mockup Content */}
                            <div className="h-full w-full overflow-hidden relative">
                                {tpl.previewContent}
                            </div>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                            {/* Badge & Title */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 backdrop-blur-md border ${tpl.badgeColor}`}>
                                    {tpl.badgeLabel}
                                </span>
                                <h3 className="text-2xl font-bold text-white">{tpl.name}</h3>
                                <p className="text-slate-300 text-sm mt-1">{tpl.subtitle}</p>
                            </div>
                        </div>

                        {/* Description & Button */}
                        <div className="mt-6 space-y-4">
                            <p className="text-slate-400 text-sm leading-relaxed">{tpl.description}</p>
                            <button
                                onClick={() => { onSelect(tpl.id); onPreview(tpl.id); }}
                                className="w-full py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-white"
                                style={{
                                    background: selectedId === tpl.id ? 'var(--pet-primary)' : 'var(--pet-primary)',
                                    opacity: selectedId === tpl.id ? 0.8 : 1,
                                    boxShadow: '0 0 20px rgba(236, 182, 19, 0.3)'
                                }}
                            >
                                <span className="material-symbols-outlined text-xl">auto_awesome</span>
                                {selectedId === tpl.id ? '当前使用中' : '生成专属网页'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Share & Link Section */}
            <div className="pd-glass rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="p-2 rounded-lg" style={{ background: 'rgba(236,182,19,0.1)' }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--pet-primary)' }}>share</span>
                        </span>
                        <h3 className="text-2xl font-bold text-white">分享与链接</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                        选择模板并生成后，您将获得一个永久有效的专属链接及二维码。您可以将其分享给亲友，或将其贴在宝贝的展示位上。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 rounded-lg px-4 py-3 text-slate-400 font-mono text-sm flex items-center overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            https://uploadsoul.com/pet/p/memory-spirit-2024
                        </div>
                        <button className="px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-white" style={{ background: 'var(--pet-primary)' }}>
                            <span className="material-symbols-outlined text-lg">content_copy</span>
                            复制链接
                        </button>
                    </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="w-full max-w-[200px] aspect-square relative group">
                    <div className="absolute inset-0 blur-xl rounded-full transition-all" style={{ background: 'rgba(236,182,19,0.2)' }}></div>
                    <div className="relative w-full h-full rounded-xl p-4 shadow-2xl flex flex-col items-center justify-center text-center" style={{ background: 'var(--pet-surface-dark)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2" style={{ borderColor: 'var(--pet-border-dark)' }}>
                            <span className="material-symbols-outlined text-4xl text-slate-600">qr_code_2</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Waiting for Selection</span>
                        </div>
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] px-3 py-1 rounded-full text-slate-500" style={{ background: 'var(--pet-bg-dark)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        二维码预览
                    </div>
                </div>
            </div>

            {/* Help Link */}
            <div className="text-center text-slate-500 text-sm">
                <p>需要帮助？请联系我们的 <a className="hover:underline" style={{ color: 'var(--pet-primary)' }} href="#">档案馆小管家</a></p>
            </div>
        </div>
    );
};
