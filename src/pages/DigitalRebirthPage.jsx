import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const DigitalRebirthPage = () => {
  const particlesRef = useRef(null);
  const nexusRef = useRef(null);

  useEffect(() => {
    // Generate particles
    const particlesContainer = particlesRef.current;
    if (particlesContainer) {
      const particleCount = 50;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'rebirth-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (5 + Math.random() * 5) + 's';
        particlesContainer.appendChild(particle);
      }
    }

    // Parallax effect
    const handleMouseMove = (e) => {
      if (nexusRef.current) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        nexusRef.current.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="uploadsoul-rebirth-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;700&display=swap');

        .uploadsoul-rebirth-wrapper {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Noto Serif SC', 'STSong', 'Songti SC', 'SimSun', serif;
          background: #0a0a0a;
          color: #d4af37;
          overflow: hidden;
          position: relative;
          width: 100%;
          height: calc(100vh - 80px); /* 适配 Header 高度 */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 背景粒子效果 */
        .rebirth-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .rebirth-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #d4af37;
          border-radius: 50%;
          opacity: 0;
          animation: rebirth-float-up 8s infinite;
        }

        @keyframes rebirth-float-up {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0;
          }
        }

        /* 中央浑天仪 */
        .chrono-nexus {
          position: absolute;
          width: 400px;
          height: 400px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
          pointer-events: none;
        }

        .armillary-sphere {
          width: 100%;
          height: 100%;
          position: relative;
          animation: rotate-slow 60s linear infinite;
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .ring {
          position: absolute;
          border: 2px solid rgba(212, 175, 55, 0.4);
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
        }

        .ring-1 {
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          animation: pulse 4s ease-in-out infinite;
        }

        .ring-2 {
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          transform: rotate(60deg);
          animation: pulse 4s ease-in-out infinite 1s;
        }

        .ring-3 {
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
          transform: rotate(120deg);
          animation: pulse 4s ease-in-out infinite 2s;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        .center-core {
          position: absolute;
          width: 80px;
          height: 80px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, #d4af37, transparent);
          border-radius: 50%;
          box-shadow: 0 0 40px #d4af37;
          animation: glow 3s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 40px #d4af37; }
          50% { box-shadow: 0 0 80px #d4af37, 0 0 120px rgba(212, 175, 55, 0.5); }
        }

        /* 标题 */
        .rebirth-title {
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 10;
        }

        .rebirth-title h1 {
          font-size: 3.5rem;
          letter-spacing: 0.5rem;
          margin-bottom: 1rem;
          text-shadow: 0 0 30px rgba(212, 175, 55, 0.8);
          background: linear-gradient(to right, #d4af37, #f4d03f, #d4af37);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }

        .rebirth-title .subtitle {
          font-size: 1.2rem;
          color: #8b7355;
          letter-spacing: 0.3rem;
          font-weight: 300;
        }

        /* 左右入口 */
        .portal {
          position: absolute;
          width: 350px;
          height: 480px;
          background: linear-gradient(135deg, rgba(15, 15, 15, 0.95), rgba(30, 30, 30, 0.9));
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          cursor: pointer;
          transition: all 0.5s ease;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-decoration: none;
          color: inherit;
        }

        .portal:hover {
          transform: scale(1.05) translateY(-10px);
          border-color: #d4af37;
          box-shadow: 0 20px 60px rgba(212, 175, 55, 0.4);
        }

        .portal-left {
          left: 8%;
          top: 50%;
          transform: translateY(-50%);
        }

        .portal-left:hover {
          transform: translateY(-50%) scale(1.05) translateY(-10px);
        }

        .portal-right {
          right: 8%;
          top: 50%;
          transform: translateY(-50%);
        }

        .portal-right:hover {
          transform: translateY(-50%) scale(1.05) translateY(-10px);
        }

        .portal-icon {
          width: 100px;
          height: 100px;
          margin-bottom: 2rem;
          position: relative;
        }

        .portal-icon svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.6));
        }

        .portal h2 {
          font-size: 1.8rem;
          margin-bottom: 1.2rem;
          letter-spacing: 0.3rem;
          text-align: center;
        }

        .portal-en {
          font-size: 0.9rem;
          color: #8b7355;
          margin-bottom: 1.5rem;
          letter-spacing: 0.2rem;
          font-family: 'Times New Roman', serif;
        }

        .portal p {
          font-size: 1rem;
          line-height: 1.8;
          text-align: center;
          color: #a0a0a0;
          font-weight: 300;
        }

        /* 底部版权 */
        .rebirth-footer {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          color: #666;
          font-size: 0.8rem;
          z-index: 10;
          letter-spacing: 0.1rem;
        }

        .rebirth-footer a {
          color: #8b7355;
          text-decoration: none;
          transition: color 0.3s;
        }

        .rebirth-footer a:hover {
          color: #d4af37;
        }

        @media (max-width: 1024px) {
          .portal {
            width: 280px;
            height: 400px;
            padding: 1.5rem;
          }
          .portal h2 { font-size: 1.5rem; }
          .chrono-nexus { width: 300px; height: 300px; }
        }
      `}</style>

      {/* 粒子背景 */}
      <div className="rebirth-particles" id="particles" ref={particlesRef}></div>

      {/* 标题 */}
      <div className="rebirth-title">
        <h1>数字重生</h1>
        <div className="subtitle">PROJECT: REBIRTH / 光阴回廊</div>
      </div>

      {/* 中央浑天仪 */}
      <div className="chrono-nexus" ref={nexusRef}>
        <div className="armillary-sphere">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
          <div className="center-core"></div>
        </div>
      </div>

      {/* 左侧入口：家族传承 */}
      <Link to="/digital-rebirth/family-galaxy" className="portal portal-left">
        <div className="portal-icon">
          <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="30" r="12" fill="none" stroke="#d4af37" strokeWidth="2" />
            <circle cx="40" cy="70" r="10" fill="none" stroke="#d4af37" strokeWidth="2" />
            <circle cx="80" cy="70" r="10" fill="none" stroke="#d4af37" strokeWidth="2" />
            <circle cx="30" cy="100" r="8" fill="none" stroke="#d4af37" strokeWidth="2" />
            <circle cx="50" cy="100" r="8" fill="none" stroke="#d4af37" strokeWidth="2" />
            <circle cx="70" cy="100" r="8" fill="none" stroke="#d4af37" strokeWidth="2" />
            <circle cx="90" cy="100" r="8" fill="none" stroke="#d4af37" strokeWidth="2" />
            <line x1="60" y1="42" x2="40" y2="60" stroke="#d4af37" strokeWidth="1.5" />
            <line x1="60" y1="42" x2="80" y2="60" stroke="#d4af37" strokeWidth="1.5" />
            <line x1="40" y1="80" x2="30" y2="92" stroke="#d4af37" strokeWidth="1.5" />
            <line x1="40" y1="80" x2="50" y2="92" stroke="#d4af37" strokeWidth="1.5" />
            <line x1="80" y1="80" x2="70" y2="92" stroke="#d4af37" strokeWidth="1.5" />
            <line x1="80" y1="80" x2="90" y2="92" stroke="#d4af37" strokeWidth="1.5" />
            <circle cx="60" cy="30" r="12" fill="#d4af37" opacity="0.2" />
          </svg>
        </div>
        <h2>家族传承</h2>
        <div className="portal-en">FAMILY LEGACY</div>
        <p>血脉不仅是基因的延续<br />更是记忆的共鸣<br />在这里，重建您的家族星系</p>
      </Link>

      {/* 右侧入口：历史回响 */}
      <Link to="/digital-rebirth/history-hall" className="portal portal-right">
        <div className="portal-icon">
          <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M 60 20 Q 45 25 45 40 L 45 60 Q 45 75 60 75 Q 75 75 75 60 L 75 40 Q 75 25 60 20"
              fill="none" stroke="#d4af37" strokeWidth="2" />
            <circle cx="60" cy="35" r="8" fill="none" stroke="#d4af37" strokeWidth="2" />
            <path d="M 35 80 Q 60 70 85 80" fill="none" stroke="#d4af37" strokeWidth="2" />
            <path d="M 30 95 Q 60 85 90 95" fill="none" stroke="#d4af37" strokeWidth="1.5" />
            <line x1="40" y1="90" x2="40" y2="105" stroke="#d4af37" strokeWidth="1.5" />
            <line x1="60" y1="88" x2="60" y2="103" stroke="#d4af37" strokeWidth="1.5" />
            <line x1="80" y1="90" x2="80" y2="105" stroke="#d4af37" strokeWidth="1.5" />
            <circle cx="60" cy="35" r="20" fill="#d4af37" opacity="0.1" />
          </svg>
        </div>
        <h2>历史回响</h2>
        <div className="portal-en">HISTORICAL ECHOES</div>
        <p>与千古智慧对话<br />让历史不再是文字<br />而是鲜活的灵魂</p>
      </Link>

      {/* 底部版权 */}
      <div className="rebirth-footer">
        © 2026 <a href="https://www.uploadsoul.com" target="_blank" rel="noopener noreferrer">UploadSoul.com</a> | 数字永生·数字重生
      </div>
    </div>
  );
};

export default DigitalRebirthPage;