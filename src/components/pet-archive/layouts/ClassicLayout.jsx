import React, { useState } from 'react';
import { format } from 'date-fns';

export const ClassicLayout = ({ data, onBack }) => {
    const [mainImage, setMainImage] = useState(
        data.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_SAYnnQ3QsNkvvwWRDERIRQUnOd96b06mb9QUQsu0uY5Np1EpItY-JoNDN4cHqLf3NnG8lJdBL1stQyTuCnbiURdmVs9Rj6IJ19mp6w6FbtCa7EJUFtqf5q_oafvadfmcXsyQo371uM1OGeKUAC7CxAPXqFKR1OWmCyU1nYlg4M6mxfWtO7ezyv8w-IIFk_lt1P89HgylGtzhsuliSrp6kKlyI_E5TFdwQ4jpjVasvEE5yJOoOeOTZxlk0RGWfW9XIwIO2hjU3sc'
    );

    const galleryThumbs = [
        data.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDueVB3md0ICI-zT7UE3NO8Wm9FNZHf3Q542DSvosnoF1yK2jJdZzVFTRTyKAjUC5PC5fDmtr_uTKyc0FiQPjJvTUW4xT0Jn6ZrY8Fd_3zPSFHsDZSpN2Jz9o7vlFAqrYmwsLekhCgOi13P-iOI-U7HFCKgi-Nw91lDs4u2CbCZ4BrDK07x3RMjM5ipghvMj79jc8k-SN67nKZts7rkQJmgPKcKHrDO_F5hsz5eQXMSS-Wy5H7aJn1Y3h5YFv-xmMnO6weAgJ7Tf4',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCuflvDNi2mfGJy5xRxDYTebimK-U_7fkYqp4FobVjM2Rn44ASZWBp7bqYp3dWtU9fiHyPMvum1DBEOy1C-LgCooTHI-sHLBK4wzQgZcxurYVonjdNSc-Hy7tmC08dqc0DX8zCTIRzjyDfNR0hF6Vci_4ywOuMEI0eLtGzHJQ2Nigk8LDI7LDmr5zFf_sgxDgzj7TOsvkXIlJeo7KD3prF5NQaTdNm_ptDYEdHcwKaZclMyyMl7F_5r9dq5hdp_HL23nSJ51rn3Lys',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCYyouWMStK7-PezUJVL4bW6yqomL5A6zm5YKzqV8AFsTVYu-XRwukFTkGkku48Y6F9Iw_uX5SIdUTxfCxloZNHFf0p8UrTBDjCtGeJTg8Z8JA2dc6UZrhoqidyeAILbzJgBaNFwvcv1VcWNwxy1e9mucKfAfbG1NEmsa8a09Fgkjo7vL3IXTckgP6trgg-x233BWouYMVX3g8wi5SQ8CqNJafjYUPe8hDXbRj1lPBYAhA35m_voTTEUPUwG626Y5nbLmYXAlu_6Zo',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAxhYB3GrkaBcM7sYI3Ha-hjZfj7AWo1KCW8EKFZJ2hkvz9VrQbnR9xaFq_zNl__AtkP6m56uM5TGdQ49MBp_G5X44X0d9oPNkcRw7GjLyrB1hBppzI7bNRGFuyOoKsAugXJQJIxzy-8PRsczkBHRL970t9uP9eUQ9eHtn5tPtJpe4uMUykcSafgburMW53LzIPfkFq1wsbRgSn06FGANupUdhZ4HYGZ6tt-2sQlsKBlVP-6KmNlFUz3lsm4Hx1HGAcK2565BE2sYE',
    ];

    const petName = data.name || '小七';
    const species = data.species || '萨摩耶 (Samoyed)';
    const birthday = data.birthday ? format(new Date(data.birthday), 'M月d日') : '10月12日';
    const bio = data.bio || '"治愈系微笑天使，温暖你的每一个清晨与黄昏。"';
    const habits = data.habits?.length > 0 ? data.habits : ['粘人', '活泼', '贪吃'];

    return (
        <div className="min-h-screen text-slate-900" style={{ background: '#f8f7f6', fontFamily: "'Plus Jakarta Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif" }}>
            <div className="max-w-[1200px] mx-auto px-4 py-8">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-6 text-sm">
                    <button onClick={onBack} className="text-slate-500 hover:text-[#ee9d2b] transition-colors">萌宠首页</button>
                    <span className="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
                    <span className="text-slate-500">治愈系宠物</span>
                    <span className="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
                    <span className="text-slate-900 font-bold">萌宠·{petName}</span>
                </nav>

                {/* Hero Section: Product Layout */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row gap-8 p-6 mb-8">
                    {/* Left: Gallery */}
                    <div className="w-full md:w-[480px] flex-shrink-0">
                        <div className="w-full aspect-square rounded-lg overflow-hidden mb-4 bg-slate-100">
                            <img alt="Main Pet Photo" className="w-full h-full object-cover" src={mainImage} />
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {galleryThumbs.map((thumb, i) => (
                                <div
                                    key={i}
                                    onClick={() => setMainImage(thumb)}
                                    className={`aspect-square rounded overflow-hidden cursor-pointer border-2 transition-colors ${mainImage === thumb ? 'border-[#ee9d2b]' : 'border-slate-200 hover:border-[#ee9d2b]'}`}
                                >
                                    <img className="w-full h-full object-cover" src={thumb} alt={`Gallery ${i + 1}`} />
                                </div>
                            ))}
                            <div className="aspect-square rounded border border-slate-200 overflow-hidden cursor-pointer bg-slate-100 flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined">play_circle</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Specs Panel */}
                    <div className="flex-1 flex flex-col">
                        <h1 className="text-3xl font-bold mb-2">萌宠 · {petName} - {species}</h1>
                        <p className="text-slate-500 mb-6 italic">{bio}</p>

                        <div className="rounded-lg p-5 mb-6" style={{ background: 'rgba(238,157,43,0.05)', border: '1px solid rgba(238,157,43,0.1)' }}>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-sm font-bold" style={{ color: '#ee9d2b' }}>元气值</span>
                                <span className="text-4xl font-extrabold tracking-tight" style={{ color: '#ee9d2b' }}>99,800</span>
                                <span className="text-sm ml-2" style={{ color: 'rgba(238,157,43,0.7)' }}>Aura Level: Max</span>
                            </div>
                            <div className="flex gap-4 mt-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white" style={{ background: '#ee9d2b' }}>限量级</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" style={{ background: 'rgba(238,157,43,0.2)', color: '#ee9d2b' }}>高阶成长期</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400 text-sm w-16">品种</span>
                                <span className="text-slate-700 font-medium">{species}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400 text-sm w-16">年龄</span>
                                <span className="text-slate-700 font-medium">{data.birthday ? `${new Date().getFullYear() - new Date(data.birthday).getFullYear()}岁` : '3岁 / 成犬'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400 text-sm w-16">纪念日</span>
                                <span className="text-slate-700 font-medium">{birthday}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400 text-sm w-16">性别</span>
                                <span className="text-slate-700 font-medium">小公举</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400 text-sm w-16">性格</span>
                                <span className="text-slate-700 font-medium">{habits.join('、')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400 text-sm w-16">坐标</span>
                                <span className="text-slate-700 font-medium">云端萌宠社区</span>
                            </div>
                        </div>

                        <div className="mt-auto flex gap-4">
                            <button className="flex-1 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95" style={{ background: '#ee9d2b', boxShadow: '0 10px 25px rgba(238,157,43,0.2)' }}>
                                <span className="material-symbols-outlined">chat</span>
                                联系主人
                            </button>
                            <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 border border-slate-200">
                                <span className="material-symbols-outlined">favorite</span>
                                送它零食 (留言)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sticky Navigation Tabs */}
                <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm mb-8 -mx-4 px-4 md:mx-0 md:rounded-lg">
                    <div className="flex gap-8 overflow-x-auto">
                        <a className="py-4 font-bold whitespace-nowrap border-b-2" href="#intro" style={{ color: '#ee9d2b', borderColor: '#ee9d2b' }}>宝贝详情</a>
                        <a className="py-4 text-slate-500 hover:text-[#ee9d2b] transition-colors font-medium whitespace-nowrap" href="#habits">生活习性</a>
                        <a className="py-4 text-slate-500 hover:text-[#ee9d2b] transition-colors font-medium whitespace-nowrap" href="#gallery">成长相册</a>
                        <a className="py-4 text-slate-500 hover:text-[#ee9d2b] transition-colors font-medium whitespace-nowrap" href="#honors">荣誉勋章</a>
                        <a className="py-4 text-slate-500 hover:text-[#ee9d2b] transition-colors font-medium whitespace-nowrap" href="#blessings">累计祝福 (2.3k+)</a>
                    </div>
                </div>

                {/* Main Detail Content */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Side: Detail Panels */}
                    <div className="flex-1 space-y-8">
                        {/* Graphic-Text Section */}
                        <section className="bg-white rounded-xl overflow-hidden shadow-sm" id="intro">
                            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                                <span className="material-symbols-outlined" style={{ color: '#ee9d2b' }}>description</span>
                                <h2 className="text-xl font-bold">图文详情</h2>
                            </div>
                            <div className="p-0 space-y-0">
                                <img className="w-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjrBZAAtVis_Uz7KLdhcmG9sTwWD0Jw1Eg0XzjDtQNSUMoRsHTiXrQyeZdHPcVcOPB72K2hC2I2fmlu5iPd7uPCrYOruFpv0FiJED0X6aREuLIViwkWeRS4uigkfCwQIVLk8CmfgTKao9xac_cNvbzLgz2Bh3n60aX7zE3yq_9MBu9JNhtyKbCIhJMw3wzFJ4fDOAo312u5Upk-AME-gFmLv9RnDE2MkHjCDbIqeOnF1QTHEqsh_GL3R_bqymgMdQerpjrjIbRhB0" alt="Pet scenic" />
                                <div className="p-10 text-center max-w-2xl mx-auto space-y-6">
                                    <h3 className="text-2xl font-bold text-slate-800">每一刻都是独一无二的珍藏</h3>
                                    <p className="text-slate-500 leading-relaxed">
                                        {petName}不仅是一只{data.species || '萨摩耶'}，更是家庭中不可或缺的快乐源泉。从它第一天来到社区，那一抹治愈的微笑就俘获了所有邻居的心。我们用镜头记录下它的成长，从步履蹒跚到奔跑如风。
                                    </p>
                                </div>
                                <img className="w-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8ISYY1XWMHNZLNacYtdy9wTAqURKtCWlsQgx_wf09UCjfjhRQ5wsSwXVx6mY2WShR6jQfWICprNHhsQG1oldNkXUKv1HRhpbwG-mcjWZ9SHhBqI_0ijqGLb_OZgh3zF-dDblU8rCO0Vom3-V2W1UcoejKNFuptpen_1zSqSUgSoiWOnXukXFBaSZtJW613Ye3oHw0JE17QWioKjZvOPenMjMLIOH3Nz1RlYMDglJB-YYmGXDVCrL-ASqlDwDQmkJSqf1ok4qAg_s" alt="Pet golden hour" />
                                <div className="grid grid-cols-2 gap-4 p-8 bg-slate-50">
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-lg flex items-center gap-2" style={{ color: '#ee9d2b' }}>
                                            <span className="material-symbols-outlined">restaurant</span> 最爱清单
                                        </h4>
                                        <ul className="space-y-2 text-slate-600">
                                            <li>• {data.favoriteFood || '冻干鸡肉干'} (每日必备)</li>
                                            <li>• 新鲜蓝莓 (磨牙解闷)</li>
                                            <li>• 手作宠物蛋糕 (特别纪念日)</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-lg flex items-center gap-2" style={{ color: '#ee9d2b' }}>
                                            <span className="material-symbols-outlined">sports_baseball</span> 兴趣爱好
                                        </h4>
                                        <ul className="space-y-2 text-slate-600">
                                            {habits.map((h, i) => (
                                                <li key={i}>• {h}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Stats Table */}
                        <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-100" id="habits">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined" style={{ color: '#ee9d2b' }}>analytics</span> 核心参数
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {[
                                    { label: '活跃程度', value: '非常活跃' },
                                    { label: '社交性', value: '社交达人' },
                                    { label: '健康状态', value: '极其健康', color: '#22c55e' },
                                    { label: '训练等级', value: '五星精通' },
                                    { label: '掉毛指数', value: '全屋飞雪' },
                                    { label: '护主意识', value: '极其敏锐' },
                                ].map((stat, i) => (
                                    <div key={i} className="p-4 rounded-lg text-center" style={{ background: '#f8f7f6' }}>
                                        <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                                        <p className="text-lg font-bold" style={stat.color ? { color: stat.color } : { color: '#334155' }}>{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Message Board */}
                        <section className="bg-white rounded-xl p-6 shadow-sm" id="blessings">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined" style={{ color: '#ee9d2b' }}>volunteer_activism</span> 爱心留言板
                                </h2>
                                <span className="text-slate-400 text-sm">共有 2,342 条祝福</span>
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden" style={{ background: 'rgba(238,157,43,0.2)' }}>
                                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs-B23L_nO8YcZ45FsXyI2kd-QBGOzuN_5zu5sDHRJ4AQEzwONJ_fGNNNqQAgknfqJyiXxDFuzIXQOHnkLBd9PY_3HVb3DMhDvZeGuuNazjws6DqvA6qFVyntqGEZebbXQDy9Y1EOz-hKP-162Zt7u4NCZA5DHLvmn6B8WuxCi3g-JMR6n_MFT6t6Y5OaTJIVYGHP7aJlP03zpro4bFGIQXE2f1h3SaME_8OWM1eaiB3krAZydpm-LFxtmf0dN4sRsV-8empKgNSo" alt="User" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-slate-50 p-4 rounded-xl rounded-tl-none">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-sm">爱狗狗的阿强</span>
                                                <span className="text-xs text-slate-400">2小时前</span>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed">{petName}太可爱了！那治愈的笑容真的看一次心化一次。送上一根虚拟大骨头，要健康快乐长大哦！</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden" style={{ background: 'rgba(238,157,43,0.2)' }}>
                                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLAGgS4MqKXBiow3b8JdnRsN5agV3i0N31G28wxdo_4mc8W1M4C_2MhrgBFrQerg0OwgnQo_scENxXXOwrufJqZN8QUJ11gsPvVK7mikdyCdMH1SJeza4B98owBSa941mgW1OBggdL4l2Gvp1XW9iNaSGOdvBxCK4GJYA9OdMBu6p6Et7gb3r7gwfiEE6XEtOD8A9Eym4jXcrClNfThrwMKVbCdrzEjuipkZwxfqN3aOf0mhFIVVEgdZYzcyp0Jm6ROMr4RthzdZg" alt="User" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-slate-50 p-4 rounded-xl rounded-tl-none">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-sm">软萌猫主子</span>
                                                <span className="text-xs text-slate-400">昨天</span>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed">虽然我是猫派，但{petName}的颜值真的没话说。果然是微笑天使！</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <textarea className="w-full p-4 rounded-lg bg-slate-50 border-none focus:ring-2 mb-4 text-sm" style={{ '--tw-ring-color': '#ee9d2b' }} placeholder={`我也想给${petName}送上祝福...`} rows="3"></textarea>
                                <div className="flex justify-end">
                                    <button className="text-white font-bold px-6 py-2 rounded-lg transition-colors" style={{ background: '#ee9d2b' }}>发布祝福</button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Side: Sidebar Content */}
                    <div className="w-full md:w-[320px] space-y-6">
                        {/* Owner Profile Card */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">宠主信息</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full overflow-hidden" style={{ border: '2px solid rgba(238,157,43,0.2)' }}>
                                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3rVylld-6LoE929FlwYA7o6Rb7s81kMa1w9l1DhV6teUQKHxzebZdILVFFsc3nc6DaBtSpq4pgyWtLtJ0nK8Z52WT_nUg6eWdxuYqvOs8P1RjBLoeZNLXSV26oA073-1EYJsV-oIWY-FjTLeF-6C8wSVzzPr7-6KFV6Z9CSqvkiSzznQM8nGUAfSV2e7L3bKUsmC4j9J39aurBDp3-tc-qUx6KVMjc1FsyRXIicvumVaIxsOB1FEmz1PvimH82MPwzgdA0nDjUN4" alt="Owner" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">陈先生 (Leo)</p>
                                    <p className="text-xs flex items-center gap-1" style={{ color: '#ee9d2b' }}>
                                        <span className="material-symbols-outlined text-xs">verified</span> 资深宠主认证
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">回复速度</span>
                                    <span className="text-slate-700 font-medium">极速 (5分钟内)</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">互动次数</span>
                                    <span className="text-slate-700 font-medium">1,280+ 次</span>
                                </div>
                            </div>
                            <button className="w-full py-3 rounded-lg font-bold transition-colors" style={{ border: '1px solid #ee9d2b', color: '#ee9d2b' }}>
                                进店逛逛
                            </button>
                        </div>

                        {/* Honor Wall */}
                        <div className="bg-white rounded-xl p-6 shadow-sm" id="honors">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">荣誉勋章</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-yellow-100 flex items-center justify-center text-yellow-600">
                                        <span className="material-symbols-outlined">workspace_premium</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">年度人气萌宠</p>
                                        <p className="text-[10px] text-slate-400">2023 云端社区评选</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                                        <span className="material-symbols-outlined">military_tech</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">运动健将</p>
                                        <p className="text-[10px] text-slate-400">飞盘精英赛冠军</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center text-green-600">
                                        <span className="material-symbols-outlined">health_and_safety</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">健康达人</p>
                                        <p className="text-[10px] text-slate-400">满分体检认证</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Community Recommendation */}
                        <div className="rounded-xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(to bottom right, #ee9d2b, #f97316)', boxShadow: '0 10px 25px rgba(238,157,43,0.2)' }}>
                            <h3 className="font-bold text-lg mb-2">加入萌宠社区</h3>
                            <p className="text-white/80 text-sm mb-4">与千位志同道合的宠友分享快乐点滴，赢取限量专属周边。</p>
                            <button className="w-full py-2 bg-white font-bold rounded-lg text-sm shadow-sm hover:bg-slate-50 transition-colors" style={{ color: '#ee9d2b' }}>
                                立即加入
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-20 border-t border-slate-200 bg-white py-12 text-center text-slate-400 text-sm">
                <p>© 2024 萌宠档案馆 - 让每一份陪伴都被珍藏</p>
                <p className="mt-2">云端服务 | 安全认证 | 萌宠协议</p>
            </footer>
        </div>
    );
};
