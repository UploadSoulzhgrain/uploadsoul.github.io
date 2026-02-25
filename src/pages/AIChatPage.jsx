import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';

const FEMALE_VIDEO_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBuei5DkjZH1gG-hi7V1Hfk7moeLBAnJGc1fYWQDST5rz-yhtZY9DozgHh_XjoluI_oeXQSZuCS8-SA_k9QiYb4rqc1x3VVEQpFnAfaJdomsIW630EpdjV3wrTfNi-xmvma84NFQaAvpCjOg-uNPJ5tZyhMge_l53CEyyeRRxw8DIM6YhmNfLsULEHMx18QgERpzgyrPUhpOwufJQbqOUjqe5lNKXe7EcxVAcHUFebAVF4l1fT26A20pkNbpG9cDlCkOFu-kffad4';
const MALE_VIDEO_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN60NHQM6eVvb-cbruLEBJiQWFcFgsBNfMuAP1ZcOdPJcHMgU8ik_TguYf2sOOd9k-BNPqrWPhIrh921mJrLJQucGuqu_ebtEnCdrPiWZZk35inJSbqlBanUX1hZDpyIXFOa9ZziB0CcGigCwGA50-CRxaEf-lq3bampnpR8OjqU-91zR2OIEJEz6TnAovYp1Cu2OSZqxWKIEJOtF0wjIkQ1OVMCkrZSMT_NYDRtcizxJ6kbhbWQsm6QU4kkN9TQ8Jx-I9nWVGj_A';
const USER_CAMERA_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN60NHQM6eVvb-cbruLEBJiQWFcFgsBNfMuAP1ZcOdPJcHMgU8ik_TguYf2sOOd9k-BNPqrWPhIrh921mJrLJQucGuqu_ebtEnCdrPiWZZk35inJSbqlBanUX1hZDpyIXFOa9ZziB0CcGigCwGA50-CRxaEf-lq3bampnpR8OjqU-91zR2OIEJEz6TnAovYp1Cu2OSZqxWKIEJOtF0wjIkQ1OVMCkrZSMT_NYDRtcizxJ6kbhbWQsm6QU4kkN9TQ8Jx-I9nWVGj_A';

const AIChatPage = () => {
    const { navigate, l } = useLocalizedNavigate();
    const [searchParams] = useSearchParams();

    const companionName = searchParams.get('name') || 'AI Companion';
    const gender = searchParams.get('gender') || 'female';

    const mainVideoImg = gender === 'male' ? MALE_VIDEO_IMG : FEMALE_VIDEO_IMG;

    const [muted, setMuted] = useState(false);
    const [cameraOn, setCameraOn] = useState(true);
    const [callTime, setCallTime] = useState('00:00');

    // Simple timer
    React.useEffect(() => {
        let seconds = 0;
        const timer = setInterval(() => {
            seconds++;
            const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
            const secs = String(seconds % 60).padStart(2, '0');
            setCallTime(`${mins}:${secs}`);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative flex flex-col h-screen w-full bg-slate-900 font-display text-white antialiased overflow-hidden">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/40 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="size-10 flex items-center justify-center bg-[#ee7c2b] rounded-lg shadow-lg shadow-[#ee7c2b]/20">
                        <span className="material-symbols-outlined text-white text-2xl">psychology</span>
                    </div>
                    <div>
                        <h1 className="text-white text-xl font-bold leading-tight tracking-tight">UploadSoul</h1>
                        <div className="flex items-center gap-2">
                            <span className="flex size-2 rounded-full bg-green-500 animate-pulse"></span>
                            <p className="text-white/80 text-xs font-medium">{companionName} - 在线</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-400 text-sm">signal_cellular_alt</span>
                            <span className="text-white text-xs font-medium">连接状态: 稳定</span>
                        </div>
                        <div className="w-px h-3 bg-white/20"></div>
                        <div className="flex items-center gap-2 text-white text-xs font-medium">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span>{callTime}</span>
                        </div>
                    </div>
                    <button className="p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full text-white transition-all">
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                </div>
            </header>

            {/* Main Video Area */}
            <main className="relative flex-1 w-full overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                    <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
                        style={{ backgroundImage: `url('${mainVideoImg}')` }}
                    ></div>
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(34, 24, 16, 0.8) 0%, rgba(34, 24, 16, 0) 30%)' }}></div>
                </div>

                {/* Subtitle Area */}
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 text-center z-10">
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
                        <p className="text-white text-lg md:text-xl font-medium leading-relaxed tracking-wide">
                            " 今天能在这里见到你真好，你想聊聊什么呢？ "
                        </p>
                    </div>
                </div>

                {/* Control Bar */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                    <div className="flex items-center gap-4 p-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl">
                        <button
                            onClick={() => setMuted(!muted)}
                            className={`flex size-12 items-center justify-center rounded-full transition-colors ${muted ? 'bg-red-500/30 text-red-300' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                        >
                            <span className="material-symbols-outlined">{muted ? 'mic_off' : 'mic'}</span>
                        </button>
                        <button
                            onClick={() => setCameraOn(!cameraOn)}
                            className={`flex size-12 items-center justify-center rounded-full transition-colors ${!cameraOn ? 'bg-red-500/30 text-red-300' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                        >
                            <span className="material-symbols-outlined">{cameraOn ? 'videocam' : 'videocam_off'}</span>
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex size-14 items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-3xl">call_end</span>
                        </button>
                        <button className="flex size-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                            <span className="material-symbols-outlined">chat_bubble</span>
                        </button>
                        <button
                            onClick={() => {
                                if (document.fullscreenElement) {
                                    document.exitFullscreen();
                                } else {
                                    document.documentElement.requestFullscreen();
                                }
                            }}
                            className="flex size-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">fullscreen</span>
                        </button>
                    </div>
                </div>

                {/* Picture-in-Picture (User Camera) */}
                {cameraOn && (
                    <div className="absolute bottom-8 right-8 z-20 group">
                        <div className="relative w-48 h-64 md:w-60 md:h-80 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-800">
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${USER_CAMERA_IMG}')` }}
                            ></div>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                            <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-md">
                                <p className="text-[10px] text-white font-bold uppercase tracking-wider">You</p>
                            </div>
                            <div className="absolute bottom-3 right-3">
                                <button className="p-2 bg-[#ee7c2b] hover:bg-[#ee7c2b]/90 rounded-full text-white shadow-lg transition-transform hover:rotate-12">
                                    <span className="material-symbols-outlined text-sm">flip_camera_ios</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mode Toggle (Desktop) */}
                <div className="absolute top-24 left-8 flex-col gap-3 z-10 hidden lg:flex">
                    <button className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/20 transition-all">
                        <span className="material-symbols-outlined text-[#ee7c2b]">auto_awesome</span>
                        <span className="text-sm font-medium italic tracking-wide">沉浸模式</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/20 transition-all opacity-60">
                        <span className="material-symbols-outlined">view_sidebar</span>
                        <span className="text-sm font-medium tracking-wide">分屏模式</span>
                    </button>
                </div>
            </main>

            {/* Left Sidebar (Desktop) */}
            <div className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 flex-col gap-6 px-4 py-8 bg-black/20 backdrop-blur-md border-r border-white/10 rounded-r-3xl z-30">
                <button onClick={() => navigate(l('/'))} className="group relative">
                    <span className="material-symbols-outlined text-white/50 group-hover:text-[#ee7c2b] transition-colors">home</span>
                    <span className="absolute left-full ml-4 px-2 py-1 bg-[#ee7c2b] text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">首页</span>
                </button>
                <button className="group relative">
                    <span className="material-symbols-outlined text-[#ee7c2b]">video_chat</span>
                    <span className="absolute left-full ml-4 px-2 py-1 bg-[#ee7c2b] text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">通话</span>
                </button>
                <button className="group relative">
                    <span className="material-symbols-outlined text-white/50 group-hover:text-[#ee7c2b] transition-colors">history</span>
                    <span className="absolute left-full ml-4 px-2 py-1 bg-[#ee7c2b] text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">记录</span>
                </button>
                <div className="w-full h-px bg-white/10"></div>
                <button className="group relative">
                    <span className="material-symbols-outlined text-white/50 group-hover:text-[#ee7c2b] transition-colors">person_add</span>
                    <span className="absolute left-full ml-4 px-2 py-1 bg-[#ee7c2b] text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">添加</span>
                </button>
            </div>
        </div>
    );
};

export default AIChatPage;
