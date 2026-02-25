import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';

const CompanionPage = () => {
  const { navigate, l } = useLocalizedNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#f8f7f6] font-display text-[#1b130d] selection:bg-[#ee7c2b]/30 min-h-screen">
      <style>
        {`
                @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');
                
                .font-display {
                    font-family: 'Lexend', sans-serif;
                }
                `}
      </style>

      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Top Navigation Bar */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f3ece7] px-6 md:px-10 py-4 bg-[#f8f7f6]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-3 md:gap-4 text-[#1b130d]">
              <div className="text-[#ee7c2b]">
                <span className="material-symbols-outlined text-3xl md:text-4xl">cloud_upload</span>
              </div>
              <h2 className="text-[#1b130d] text-xl md:text-2xl font-black leading-tight tracking-tight">UploadSoul</h2>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex flex-1 justify-center gap-6 xl:gap-10">
              <button onClick={() => navigate(l('/'))} className="text-[#1b130d] hover:text-[#ee7c2b] transition-colors text-sm font-semibold leading-normal">首页</button>
              <button onClick={() => navigate(l('/companion/daily'))} className="text-[#1b130d] hover:text-[#ee7c2b] transition-colors text-sm font-semibold leading-normal">日常陪伴</button>
              <button onClick={() => navigate(l('/companion/senior'))} className="text-[#1b130d] hover:text-[#ee7c2b] transition-colors text-sm font-semibold leading-normal">长者关怀</button>
              <button onClick={() => navigate(l('/companion/mental'))} className="text-[#1b130d] hover:text-[#ee7c2b] transition-colors text-sm font-semibold leading-normal">心理健康</button>
              <a className="text-[#1b130d] hover:text-[#ee7c2b] transition-colors text-sm font-semibold leading-normal" href="#about">关于我们</a>
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden sm:flex items-center gap-2 md:gap-4">
                <button onClick={() => navigate(l('/login'))} className="flex min-w-[70px] md:min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-10 px-4 md:px-5 bg-[#ee7c2b] text-white text-sm font-bold transition-all hover:brightness-110 active:scale-95">
                  登录
                </button>
                <button onClick={() => navigate(l('/register'))} className="flex min-w-[70px] md:min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-10 px-4 md:px-5 bg-[#f3ece7] text-[#1b130d] text-sm font-bold transition-all hover:bg-orange-100">
                  注册
                </button>
              </div>

              {/* Profile Avatar (Simplified for mobile) */}
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 md:size-10 border-2 border-[#ee7c2b]/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB5ef5A6eNoezS7rWznk-S3Q-_CdCy9pgtvh6Xn9cLe-OhlztxMkRCCfzdKZARy7XoCvhcBvQZoTzeoVyCR00h4qYRe7unuy9JVMSWSsy3rv14q_fdUnI_M2dHxetwg9GB8yG24Ijv965bJ8U2Q4nlf16gIleWW62eg_V9xOf5LJ5E8l-34yqbpYV9cJd9q7O7tsQ6BQaaYxtpsYN9a4JJPZ-2J58Ihx6LcU3i11NJz53uZMOIurZUIoJnV66hGp23AhDYmxHXcCmg")' }}></div>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden flex items-center justify-center p-2 text-[#1b130d]">
                <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
              </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border-b border-[#f3ece7] shadow-lg lg:hidden flex flex-col p-4 gap-4 animate-fadeIn">
                <button onClick={() => { navigate(l('/')); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-[#f3ece7] font-semibold">首页</button>
                <button onClick={() => { navigate(l('/companion/daily')); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-[#f3ece7] font-semibold">日常陪伴</button>
                <button onClick={() => { navigate(l('/companion/senior')); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-[#f3ece7] font-semibold">长者关怀</button>
                <button onClick={() => { navigate(l('/companion/mental')); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-[#f3ece7] font-semibold">心理健康</button>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { navigate(l('/login')); setIsMobileMenuOpen(false); }} className="flex-1 rounded-xl h-10 bg-[#ee7c2b] text-white text-sm font-bold">登录</button>
                  <button onClick={() => { navigate(l('/register')); setIsMobileMenuOpen(false); }} className="flex-1 rounded-xl h-10 bg-[#f3ece7] text-[#1b130d] text-sm font-bold">注册</button>
                </div>
              </div>
            )}
          </header>

          <main className="flex-1">
            {/* Hero Section */}
            <section className="max-w-[1280px] mx-auto px-6 md:px-10 py-10 md:py-16">
              <div className="flex flex-col gap-10 lg:flex-row items-center">
                <div className="flex flex-col gap-8 lg:w-1/2 text-center lg:text-left">
                  <div className="flex flex-col items-center lg:items-start gap-4">
                    <span className="text-[#ee7c2b] font-bold tracking-widest uppercase text-xs md:text-sm bg-[#ee7c2b]/10 w-fit px-3 py-1 rounded-full">AI 驱动 · 情感链接</span>
                    <h1 className="text-[#1b130d] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                      开启<br /><span className="text-[#ee7c2b]">情感陪伴</span>新纪元
                    </h1>
                    <p className="text-[#9a6c4c] text-base md:text-lg font-normal leading-relaxed max-w-[500px]">
                      基于先进的深度学习技术，为您打造懂你、暖你、更爱你的数字伙伴。全天候的温柔倾听，让每颗孤独的心都有归宿。
                    </p>
                  </div>
                  <div className="flex justify-center lg:justify-start gap-4">
                    <button className="flex min-w-[160px] md:min-w-[180px] cursor-pointer items-center justify-center rounded-xl h-14 px-6 md:px-8 bg-[#ee7c2b] text-white text-base md:text-lg font-bold shadow-lg shadow-[#ee7c2b]/20 hover:translate-y-[-2px] transition-transform">
                      立即开启体验
                    </button>
                  </div>
                </div>
                <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-[#ee7c2b]/10 blur-3xl rounded-full"></div>
                    <div className="relative w-full aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-3xl shadow-2xl overflow-hidden border-4 md:border-8 border-white" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLfHipGWyL6MuMpdoHUL5vEuaOVT-0dQe8MF37tjo6sBTGp9AqauOk4IjyFjHikNNDvE4wBOAVGCjVR42e45uaS5k-uvDkmOWl9DPUj5N6AhfvhTvI7MXrobWsE3Ll65HvBisorFk64p9QhKki6s01AnvpKZ7ilXcrcbsTWKo4_hW4uncRFluCN4MSR4pBh1ixUtY5aXlslIyCp4MyX_CyDxAwkFcmJ0h8SECU--yQFQUsbNrSwA2BAciNMjFd_MniZfvE8XrcJpY")' }}></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Services Section */}
            <section className="bg-[#f3ece7]/30 py-12 md:py-20">
              <div className="max-w-[1280px] mx-auto px-6 md:px-10">
                <div className="text-center mb-10 md:16">
                  <h2 className="text-[#1b130d] text-2xl md:text-4xl font-black mb-3 md:mb-4">三大核心服务领域</h2>
                  <p className="text-[#9a6c4c] text-base md:text-lg">全场景覆盖，满足不同阶段的情感需求</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {/* Daily Companionship */}
                  <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-[#f3ece7] flex flex-col h-full" id="daily">
                    <div className="w-full aspect-video bg-center bg-no-repeat bg-cover rounded-xl mb-6 overflow-hidden" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBCpRcurfLUXV02cN6qdouHK3qloK9U4a4V07JhTWgiIOgVJg6btjXEE3atKdd3h1-F6DjSkuhF7hJlLF_Tj86pD6MFtWcyX5gkaDghIfGO884bf7APdOwkVwshatA3He90kRzSRdRFsBAetQyHM9GdNSmsPiavRQQrXWX2qaVDQpUVpujO-0JkHJwb_7sBSHTNcS-9hOEPF2msdpQpt9f-Dv-CW1yfi_uAuq86prPcqdV9GLQO5tdGuJVPgz4dOuYrgsoGRY1tQIQ")' }}></div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-[#ee7c2b]">chat_bubble</span>
                      <h3 className="text-[#1b130d] text-xl font-bold">日常陪伴</h3>
                    </div>
                    <p className="text-[#9a6c4c] text-base leading-relaxed mb-6 flex-grow">
                      通用型陪伴AI，随时随地畅聊生活琐事。不论是深夜的感慨还是午后的分享，它始终在这里，缓解孤独，分享喜悦。
                    </p>
                    <button
                      onClick={() => navigate(l('/companion/daily'))}
                      className="w-full py-3 rounded-xl border border-[#ee7c2b] text-[#ee7c2b] font-bold hover:bg-[#ee7c2b] hover:text-white transition-all"
                    >
                      进入聊天室
                    </button>
                  </div>
                  {/* Senior Care */}
                  <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-[#f3ece7] flex flex-col h-full" id="senior">
                    <div className="w-full aspect-video bg-center bg-no-repeat bg-cover rounded-xl mb-6 overflow-hidden" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA3EpqCH2s6UBgi6ilkrd40QrwCHvi1HraOxzlV3LuhfZuEKF9tvclrldtR7YZR3-AfFNQO-vVeMoB94W0pMUIuB9zqXl2EmqOeGueaQ2BMNGXjvQgpw660NtOCrRYyHe1vkAqUUEIMLnmF26T0KO3Ti8vQR5PIdpKuHP3H4bCSA7Oj5-jV_MIJAceI3zQecccOh3BmTOV8zyAANtTU4Qllrz7VePqLb7c8dATXMIT1i_r6huUzrcRgrEt1N0tY6msxt_wARNBJPzk")' }}></div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-[#ee7c2b]">volunteer_activism</span>
                      <h3 className="text-[#1b130d] text-xl font-bold">长者关怀</h3>
                    </div>
                    <p className="text-[#9a6c4c] text-base leading-relaxed mb-6 flex-grow">
                      专为高龄人群设计。集成健康指标监测、用药定时提醒及怀旧对话模式，通过温柔的声音守护银发生活。
                    </p>
                    <button
                      onClick={() => navigate(l('/companion/senior'))}
                      className="w-full py-3 rounded-xl border border-[#ee7c2b] text-[#ee7c2b] font-bold hover:bg-[#ee7c2b] hover:text-white transition-all"
                    >
                      开启长者模式
                    </button>
                  </div>
                  {/* Mental Wellness */}
                  <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-[#f3ece7] flex flex-col h-full" id="mental">
                    <div className="w-full aspect-video bg-center bg-no-repeat bg-cover rounded-xl mb-6 overflow-hidden" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBNy71nU2og742QgxCsd5ehFxMivPJBj-igv_sdm17nfi4OuYxAPWSceEph9lbyimZE0c1wV59svrwcQOJO0fTaK0AuMXe8mA_7E0B3m5cW7-b-tS4MRa3L02G-LJNrfdLy9SggU7E8no4iTWnaxQVfqKr_OodyKtNiOrgB_SUPK4Gno88CnWqAFm3sqJIRyxkUMEDICR4h4IwjVwhHOoEpKL6GSSFbgZsYmSEVxTjcV2sbIwwtPgr8Txa8CGBX5chyzxMm8vywYD4")' }}></div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-[#ee7c2b]">psychology</span>
                      <h3 className="text-[#1b130d] text-xl font-bold">心理健康</h3>
                    </div>
                    <p className="text-[#9a6c4c] text-base leading-relaxed mb-6 flex-grow">
                      专业级AI心理咨询。基于认知行为疗法，提供情绪疏导、压力释放及深度的情感支持，全天候守护您的心理防线。
                    </p>
                    <button
                      onClick={() => navigate(l('/companion/mental'))}
                      className="w-full py-3 rounded-xl border border-[#ee7c2b] text-[#ee7c2b] font-bold hover:bg-[#ee7c2b] hover:text-white transition-all"
                    >
                      预约心理导引
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="max-w-[1280px] mx-auto px-6 md:px-10 py-12 md:py-20">
              <div className="flex flex-col gap-8 md:gap-12">
                <div className="flex flex-col gap-4 max-w-[800px] text-center md:text-left">
                  <h2 className="text-[#1b130d] text-2xl md:text-4xl font-black leading-tight">为什么选择 UploadSoul</h2>
                  <p className="text-[#9a6c4c] text-base md:text-lg font-normal leading-normal">我们不仅仅是代码，更是有温度的数字存在。每一行算法都为您的幸福感而优化。</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-5 rounded-2xl border border-[#f3ece7] bg-white p-8 transition-transform hover:translate-y-[-4px]">
                    <div className="bg-[#ee7c2b]/10 text-[#ee7c2b] w-14 h-14 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl">favorite</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-[#1b130d] text-xl font-bold">专业情感引擎</h3>
                      <p className="text-[#9a6c4c] text-base leading-relaxed">深度学习东方文化背景下的表达习惯，能识别微妙的情绪波动，听懂您的“弦外之音”。</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-5 rounded-2xl border border-[#f3ece7] bg-white p-8 transition-transform hover:translate-y-[-4px]">
                    <div className="bg-[#ee7c2b]/10 text-[#ee7c2b] w-14 h-14 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl">verified_user</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-[#1b130d] text-xl font-bold">银行级隐私保障</h3>
                      <p className="text-[#9a6c4c] text-base leading-relaxed">端到端加密技术，所有对话记录仅属于您，确保个人隐私与情感树洞绝对安全。</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-5 rounded-2xl border border-[#f3ece7] bg-white p-8 transition-transform hover:translate-y-[-4px]">
                    <div className="bg-[#ee7c2b]/10 text-[#ee7c2b] w-14 h-14 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl">forum</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-[#1b130d] text-xl font-bold">全感官多模态交互</h3>
                      <p className="text-[#9a6c4c] text-base leading-relaxed">支持语音对讲、文字交流、甚至3D数字伙伴视频通话，为您提供如真人般的陪伴体验。</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Footer Section */}
          <footer className="bg-[#1b130d] text-white pt-12 md:pt-20 pb-10">
            <div className="max-w-[1280px] mx-auto px-6 md:px-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-16">
                <div className="col-span-1 md:col-span-1">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-[#ee7c2b] text-3xl">cloud_upload</span>
                    <h2 className="text-2xl font-black">UploadSoul</h2>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    让AI成为人类情感的延伸，<br />跨越时空，治愈孤独。
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-6">核心服务</h4>
                  <ul className="space-y-4 text-gray-400">
                    <li><a className="hover:text-[#ee7c2b] transition-colors" href="#">日常对话 AI</a></li>
                    <li><a className="hover:text-[#ee7c2b] transition-colors" href="#">长者智慧护理</a></li>
                    <li><a className="hover:text-[#ee7c2b] transition-colors" href="#">专业心理咨询</a></li>
                    <li><a className="hover:text-[#ee7c2b] transition-colors" href="#">记忆存储计划</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-6">联系我们</h4>
                  <ul className="space-y-4 text-gray-400">
                    <li className="flex items-center gap-2 font-display uppercase tracking-tight"><span className="material-symbols-outlined text-xs">mail</span> contact@uploadsoul.com</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">location_on</span> Vancouver, Canada</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-6">加入社区</h4>
                  <div className="flex gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ee7c2b] transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-xl">share</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ee7c2b] transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-xl">qr_code_2</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ee7c2b] transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-xl">groups</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">扫码加入“暖心契约”内测计划</p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                <p>© 2024 UploadSoul 情感计算实验室. All Rights Reserved. 沪ICP备20241024号</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CompanionPage;