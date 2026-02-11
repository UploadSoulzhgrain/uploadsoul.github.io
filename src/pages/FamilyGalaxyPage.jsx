import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const FamilyGalaxyPage = () => {
    const navigate = useNavigate();
    const [selectedMember, setSelectedMember] = useState(null);
    const [isPanelActive, setIsPanelActive] = useState(false);
    const [panState, setPanState] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const galaxyRef = useRef(null);
    const familyTreeRef = useRef(null);

    // 家族成员数据
    const familyData = [
        {
            id: 1,
            name: '李明远',
            relation: '祖父',
            birth: '1930',
            death: '2015',
            status: 'deceased',
            x: 50,
            y: 20,
            size: 80,
            bio: '出生于战乱年代，经历了新中国的建立与发展。一生勤勉，教书育人四十载。',
            memories: '最爱在院子里的老槐树下给孙辈讲故事。'
        },
        {
            id: 2,
            name: '王秀英',
            relation: '祖母',
            birth: '1935',
            death: '2018',
            status: 'deceased',
            x: 65,
            y: 25,
            size: 75,
            bio: '贤惠温柔，擅长刺绣和烹饪。家中的凝聚力量。',
            memories: '每逢佳节必做一手好菜，最拿手的是红烧肉。'
        },
        {
            id: 3,
            name: '李建国',
            relation: '父亲',
            birth: '1960',
            death: null,
            status: 'alive',
            x: 35,
            y: 45,
            size: 70,
            bio: '工程师，参与了多项国家重点工程建设。',
            memories: '工作严谨，对子女教育严格但充满关爱。'
        },
        {
            id: 4,
            name: '张丽华',
            relation: '母亲',
            birth: '1962',
            death: null,
            status: 'alive',
            x: 50,
            y: 50,
            size: 70,
            bio: '医生，救死扶伤三十余年。',
            memories: '温柔体贴，是家中的温暖港湾。'
        },
        {
            id: 5,
            name: '李伟',
            relation: '叔父',
            birth: '1968',
            death: null,
            status: 'alive',
            x: 70,
            y: 48,
            size: 65,
            bio: '企业家，白手起家创办公司。',
            memories: '幽默风趣，总能给家庭聚会带来欢笑。'
        },
        {
            id: 6,
            name: '李天',
            relation: '本人',
            birth: '1990',
            death: null,
            status: 'alive',
            x: 40,
            y: 70,
            size: 75,
            bio: '科技从业者，致力于人工智能研究。',
            memories: '继承家族的勤奋与智慧，探索未知领域。'
        },
        {
            id: 7,
            name: '李思',
            relation: '妹妹',
            birth: '1995',
            death: null,
            status: 'alive',
            x: 60,
            y: 72,
            size: 65,
            bio: '艺术家，专注于数字艺术创作。',
            memories: '自由奔放，用艺术诠释生活的美好。'
        }
    ];

    const connections = [
        [1, 3], [2, 3],
        [1, 5], [2, 5],
        [3, 6], [4, 6],
        [3, 7], [4, 7]
    ];

    useEffect(() => {
        // Generate background stars
        const starsBg = document.getElementById('starsBg');
        if (starsBg && starsBg.children.length === 0) {
            for (let i = 0; i < 200; i++) {
                const star = document.createElement('div');
                star.className = 'rebirth-star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.width = (Math.random() * 2 + 1) + 'px';
                star.style.height = star.style.width;
                star.style.animationDelay = Math.random() * 3 + 's';
                starsBg.appendChild(star);
            }
        }
    }, []);

    const handleMouseDown = (e) => {
        if (e.button !== 0) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX - panState.x, y: e.clientY - panState.y });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPanState({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setScale(prev => Math.max(0.5, Math.min(2, prev * delta)));
    };

    const showMemberInfo = (member) => {
        setSelectedMember(member);
        setIsPanelActive(true);
    };

    const closeInfoPanel = () => {
        setIsPanelActive(false);
    };

    return (
        <div className="family-galaxy-wrapper" onWheel={handleWheel}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;700&display=swap');

        .family-galaxy-wrapper {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Noto Serif SC', 'STSong', 'Songti SC', 'SimSun', serif;
          background: #000;
          color: #d4af37;
          overflow: hidden;
          width: 100%;
          height: calc(100vh - 80px);
          position: relative;
        }

        /* 顶部导航 */
        .rebirth-navbar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: rgba(10, 10, 10, 0.85);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 1000;
        }

        .rebirth-navbar-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .back-btn {
          color: #d4af37;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
        }

        .back-btn:hover {
          color: #f4d03f;
        }

        .rebirth-navbar h1 {
          font-size: 1.4rem;
          letter-spacing: 0.2rem;
          margin: 0;
        }

        .rebirth-navbar-right {
          display: flex;
          gap: 1rem;
        }

        .nav-btn {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.85rem;
        }

        .nav-btn:hover {
          background: rgba(212, 175, 55, 0.2);
          border-color: #d4af37;
        }

        /* 星系画布 */
        .galaxy-container {
          position: relative;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at center, #0a0a0a 0%, #000 100%);
          cursor: grab;
        }

        .galaxy-container:active {
          cursor: grabbing;
        }

        .stars-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .rebirth-star {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          animation: rebirth-twinkle 3s infinite;
        }

        @keyframes rebirth-twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .family-tree-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-origin: center center;
          transition: transform 0.1s ease-out;
        }

        /* 家族成员节点 */
        .family-member {
          position: absolute;
          cursor: pointer;
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .member-star {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .member-core {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle, #d4af37, rgba(212, 175, 55, 0.3));
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 2px solid #d4af37;
          transition: all 0.3s ease;
        }

        .member-initial {
          font-size: 1.5rem;
          font-weight: bold;
          color: #000;
        }

        .family-member:hover .member-core {
          transform: scale(1.15);
          box-shadow: 0 0 40px rgba(212, 175, 55, 0.9);
        }

        .member-name {
          position: absolute;
          top: 110%;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 0.85rem;
          color: #d4af37;
          text-shadow: 0 0 8px rgba(0, 0, 0, 0.9);
          pointer-events: none;
        }

        .member-status {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1.5px solid #000;
          z-index: 2;
        }

        .status-alive {
          background: #4CAF50;
          box-shadow: 0 0 8px #4CAF50;
        }

        .status-deceased {
          background: #8b7355;
          box-shadow: 0 0 8px #8b7355;
        }

        /* 连接线 */
        .connection-line {
          position: absolute;
          height: 1.5px;
          background: linear-gradient(90deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.05));
          transform-origin: left center;
          pointer-events: none;
        }

        /* 侧边信息面板 */
        .info-panel {
          position: absolute;
          right: -350px;
          top: 60px;
          width: 350px;
          height: calc(100% - 60px);
          background: rgba(15, 15, 15, 0.96);
          border-left: 1px solid rgba(212, 175, 55, 0.2);
          backdrop-filter: blur(15px);
          padding: 1.5rem;
          transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 999;
          overflow-y: auto;
        }

        .info-panel.active {
          right: 0;
        }

        .info-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #d4af37;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .info-avatar-box {
          width: 120px;
          height: 120px;
          margin: 0.5rem auto 1.5rem;
          border-radius: 50%;
          border: 2px solid #d4af37;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
          overflow: hidden;
          background: radial-gradient(circle, #d4af37, #8b7355);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: #000;
        }

        .info-name {
          text-align: center;
          font-size: 1.6rem;
          margin-bottom: 0.4rem;
          letter-spacing: 0.1rem;
        }

        .info-dates {
          text-align: center;
          color: #8b7355;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .info-section {
          margin-bottom: 1.5rem;
        }

        .info-section h3 {
          font-size: 1rem;
          margin-bottom: 0.8rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }

        .info-section p {
          line-height: 1.6;
          color: #a0a0a0;
          font-size: 0.9rem;
        }

        .action-btns {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-top: 1.5rem;
        }

        .action-btn {
          padding: 0.8rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9rem;
          text-decoration: none;
          text-align: center;
        }

        .action-btn:hover {
          background: rgba(212, 175, 55, 0.2);
        }

        /* 添加成员按钮 */
        .add-member-button {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border: none;
          color: #000;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);
          transition: all 0.3s;
          z-index: 998;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-member-button:hover {
          transform: scale(1.1) rotate(90deg);
        }

        /* 提示文本 */
        .galaxy-help-text {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          color: #666;
          font-size: 0.75rem;
          text-align: center;
          z-index: 100;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .info-panel { width: 100%; right: -100%; top: 60px; height: calc(100% - 60px); }
          .rebirth-navbar h1 { font-size: 1.1rem; }
          .portal { width: 260px; }
        }
      `}</style>

            {/* 导航栏 */}
            <nav className="rebirth-navbar">
                <div className="rebirth-navbar-left">
                    <Link to="/digital-rebirth" className="back-btn">
                        <span>◀</span> 返回时空枢纽
                    </Link>
                    <h1>家族星系</h1>
                </div>
                <div className="rebirth-navbar-right">
                    <button className="nav-btn" onClick={() => alert('家族年轮功能开发中')}>家族年轮</button>
                    <button className="nav-btn" onClick={() => alert('导出家谱功能开发中')}>导出家谱</button>
                </div>
            </nav>

            {/* 星系画布 */}
            <div
                className="galaxy-container"
                id="galaxyContainer"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div className="stars-bg" id="starsBg"></div>
                <div
                    className="family-tree-layer"
                    ref={familyTreeRef}
                    style={{
                        transform: `translate(${panState.x}px, ${panState.y}px) scale(${scale})`,
                        width: '100%',
                        height: '100%'
                    }}
                >
                    {/* 连接线 */}
                    {connections.map(([id1, id2], idx) => {
                        const m1 = familyData.find(m => m.id === id1);
                        const m2 = familyData.find(m => m.id === id2);
                        if (!m1 || !m2) return null;

                        const dx = m2.x - m1.x;
                        const dy = m2.y - m1.y;
                        const length = Math.sqrt(dx * dx + dy * dy);
                        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                        return (
                            <div
                                key={`line-${idx}`}
                                className="connection-line"
                                style={{
                                    left: `${m1.x}%`,
                                    top: `${m1.y}%`,
                                    width: `${length}%`,
                                    transform: `rotate(${angle}deg)`
                                }}
                            />
                        );
                    })}

                    {/* 成员节点 */}
                    {familyData.map(member => (
                        <div
                            key={member.id}
                            className="family-member"
                            style={{
                                left: `${member.x}%`,
                                top: `${member.y}%`,
                                width: `${member.size}px`,
                                height: `${member.size}px`,
                                transform: 'translate(-50%, -50%)'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                showMemberInfo(member);
                            }}
                        >
                            <div className="member-star">
                                <div className="member-core">
                                    <span className="member-initial">{member.name.charAt(0)}</span>
                                    <div className={`member-status ${member.status === 'alive' ? 'status-alive' : 'status-deceased'}`}></div>
                                </div>
                            </div>
                            <div className="member-name">{member.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 侧边信息面板 */}
            <div className={`info-panel ${isPanelActive ? 'active' : ''}`} id="infoPanel">
                <button className="info-close" onClick={closeInfoPanel}>✕</button>
                {selectedMember && (
                    <div id="panelContent">
                        <div className="info-avatar-box">
                            {selectedMember.name.charAt(0)}
                        </div>
                        <div className="info-name">{selectedMember.name}</div>
                        <div className="info-dates">
                            {selectedMember.birth} - {selectedMember.death || '至今'}
                            <br />
                            <span style={{ color: selectedMember.status === 'alive' ? '#4CAF50' : '#8b7355' }}>
                                {selectedMember.status === 'alive' ? '● 在世' : '● 已故'}
                            </span>
                        </div>

                        <div className="info-section">
                            <h3>关系</h3>
                            <p>{selectedMember.relation}</p>
                        </div>

                        <div className="info-section">
                            <h3>生平简介</h3>
                            <p>{selectedMember.bio}</p>
                        </div>

                        <div className="info-section">
                            <h3>珍贵回忆</h3>
                            <p>{selectedMember.memories}</p>
                        </div>

                        <div className="action-btns">
                            {selectedMember.status === 'deceased' ? (
                                <>
                                    <Link to={`/digital-rebirth/reunion-space?member=${selectedMember.id}`} className="action-btn">
                                        进入团聚空间
                                    </Link>
                                    <button className="action-btn" onClick={() => alert('编辑记忆功能开发中')}>
                                        补充记忆
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="action-btn" onClick={() => alert('发送消息功能开发中')}>
                                        发送消息
                                    </button>
                                    <button className="action-btn" onClick={() => alert('编辑资料功能开发中')}>
                                        编辑资料
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* 添加成员按钮 */}
            <button
                className="add-member-button"
                onClick={() => navigate('/digital-rebirth/create')}
                title="添加家族成员"
            >
                +
            </button>

            {/* 帮助提示 */}
            <div className="galaxy-help-text">
                点击任意星辰查看详情 | 拖拽可移动视角 | 滚轮进行缩放
            </div>
        </div>
    );
};

export default FamilyGalaxyPage;
