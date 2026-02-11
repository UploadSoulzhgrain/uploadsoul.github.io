import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const HistoryHallPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');

  const sagesData = [
    { id: 1, name: '李白', period: '701-762', field: 'poetry', fieldName: '诗人', desc: '盛唐最伟大的浪漫主义诗人，被誉为"诗仙"理论。', theme: 'poetry' },
    { id: 2, name: '苏格拉底', period: '公元前469-399', field: 'philosophy', fieldName: '哲学家', desc: '古希腊哲学家，西方哲学的奠基人之一。', theme: 'philosophy' },
    { id: 3, name: '爱因斯坦', period: '1879-1955', field: 'science', fieldName: '物理学家', desc: '提出相对论，现代物理学的开创者。', theme: 'science' },
    { id: 4, name: '孔子', period: '公元前551-479', field: 'philosophy', fieldName: '思想家', desc: '儒家学派创始人，中国古代伟大的教育家。', theme: 'philosophy' },
    { id: 5, name: '杜甫', period: '712-770', field: 'poetry', fieldName: '诗人', desc: '唐代伟大的现实主义诗人，被誉为"诗圣"。', theme: 'poetry' },
    { id: 6, name: '牛顿', period: '1643-1727', field: 'science', fieldName: '科学家', desc: '经典力学奠基人，发现万有引力定律。', theme: 'science' },
    { id: 7, name: '苏轼', period: '1037-1101', field: 'poetry', fieldName: '文学家', desc: '北宋文学家，唐宋八大家之一，豪放派词人。', theme: 'poetry' },
    { id: 8, name: '亚里士多德', period: '公元前384-322', field: 'philosophy', fieldName: '哲学家', desc: '古希腊哲学家，百科全书式的学者。', theme: 'philosophy' },
    { id: 9, name: '居里夫人', period: '1867-1934', field: 'science', fieldName: '物理学家', desc: '首位获得诺贝尔奖的女性，放射性研究先驱。', theme: 'science' },
    { id: 10, name: '司马迁', period: '公元前145-前86', field: 'poetry', fieldName: '史学家', desc: '《史记》作者，中国历史学之父。', theme: 'poetry' },
    { id: 11, name: '老子', period: '公元前571-前471', field: 'philosophy', fieldName: '哲学家', desc: '道家学派创始人，《道德经》作者。', theme: 'philosophy' },
    { id: 12, name: '达芬奇', period: '1452-1519', field: 'science', fieldName: '博学家', desc: '文艺复兴时期的全才，画家、科学家、发明家。', theme: 'science' }
  ];

  const filteredSages = useMemo(() => {
    return sagesData.filter(sage => {
      const matchesFilter = currentFilter === 'all' || sage.field === currentFilter;
      const matchesSearch = sage.name.includes(searchTerm) || sage.desc.includes(searchTerm);
      return matchesFilter && matchesSearch;
    });
  }, [currentFilter, searchTerm]);

  return (
    <div className="history-hall-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;700&display=swap');

        .history-hall-wrapper {
          font-family: 'Noto Serif SC', 'STSong', 'Songti SC', 'SimSun', serif;
          background: #000;
          color: #d4af37;
          min-height: calc(100vh - 80px); /* 适配 Header */
          overflow-x: hidden;
        }

        .hall-navbar {
          position: sticky;
          top: 0;
          height: 60px;
          background: rgba(10, 10, 10, 0.95);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 1000;
        }

        .hall-navbar-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .hall-back-btn {
          color: #d4af37;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .hall-back-btn:hover { color: #f4d03f; }
        .hall-navbar h1 { font-size: 1.4rem; letter-spacing: 0.2rem; margin: 0; }

        .hall-hero-section {
          height: 220px;
          background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .hall-hero-bg {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, #d4af37 2px, #d4af37 4px);
        }

        .hall-hero-title {
          font-size: 3rem;
          letter-spacing: 0.4rem;
          margin-bottom: 0.6rem;
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
          position: relative;
        }

        .hall-hero-subtitle {
          font-size: 1rem;
          color: #8b7355;
          letter-spacing: 0.2rem;
          position: relative;
        }

        .hall-filter-section {
          background: rgba(10, 10, 10, 0.95);
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          padding: 1.5rem 2rem;
          display: flex;
          gap: 1.5rem;
          align-items: center;
          position: sticky;
          top: 60px;
          z-index: 999;
        }

        .hall-search-box { flex: 1; position: relative; }
        .hall-search-input {
          width: 100%;
          background: rgba(30, 30, 30, 0.7);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 6px;
          padding: 0.7rem 2.5rem 0.7rem 1rem;
          color: #d4af37;
          font-size: 0.95rem;
          font-family: inherit;
        }
        .hall-search-input:focus { outline: none; border-color: #d4af37; }
        .hall-search-icon { position: absolute; right: 0.8rem; top: 50%; transform: translateY(-50%); color: #8b7355; }

        .hall-filter-group { display: flex; gap: 0.8rem; }
        .hall-filter-btn {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
          padding: 0.5rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
          font-size: 0.9rem;
        }
        .hall-filter-btn.active { background: rgba(212, 175, 55, 0.25); border-color: #d4af37; }

        .hall-grid {
          padding: 2.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .hall-card {
          background: rgba(20, 20, 20, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          overflow: hidden;
          transition: 0.3s;
          text-decoration: none;
          color: inherit;
        }
        .hall-card:hover { transform: translateY(-8px); border-color: #d4af37; box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3); }

        .hall-card-bg { height: 160px; position: relative; display: flex; align-items: center; justify-content: center; }
        .hall-card-bg::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(0,0,0,0.5)); }

        .hall-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: radial-gradient(circle, #d4af37, #8b7355);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          color: #000;
          font-weight: 700;
          border: 2px solid #d4af37;
          position: absolute;
          bottom: -45px;
          z-index: 2;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
        }

        .hall-card-content { padding: 3.5rem 1.5rem 1.5rem; text-align: center; }
        .hall-name { font-size: 1.5rem; margin-bottom: 0.3rem; }
        .hall-period { font-size: 0.8rem; color: #8b7355; margin-bottom: 0.8rem; }
        .hall-field-tag { display: inline-block; background: rgba(212, 175, 55, 0.15); padding: 0.2rem 0.8rem; border-radius: 12px; font-size: 0.75rem; margin-bottom: 0.8rem; border: 0.5px solid rgba(212, 175, 55, 0.3); }
        .hall-desc { font-size: 0.85rem; line-height: 1.6; color: rgba(212, 175, 55, 0.7); }

        .hall-empty { text-align: center; padding: 4rem; grid-column: 1 / -1; color: #666; }

        /* Themes */
        .theme-poetry { background: linear-gradient(45deg, #1a0f0a, #2c1a14); }
        .theme-philosophy { background: linear-gradient(45deg, #0a111a, #142232); }
        .theme-science { background: linear-gradient(45deg, #0d1a0d, #1a321a); }

        @media (max-width: 768px) {
          .hall-filter-section { flex-direction: column; }
          .hall-filter-group { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      {/* 虚拟导航 */}
      <nav className="hall-navbar">
        <div className="hall-navbar-left">
          <Link to="/digital-rebirth" className="hall-back-btn">
            <span>◀</span> 返回时空枢纽
          </Link>
          <h1>贤者殿堂</h1>
        </div>
        <div className="hall-navbar-right">
          <Link to="/digital-rebirth/history-creator" className="hall-back-btn">
            + 创建历史人物
          </Link>
        </div>
      </nav>

      <div className="hall-hero-section">
        <div className="hall-hero-bg" />
        <h1 className="hall-hero-title">历史回响</h1>
        <p className="hall-hero-subtitle">HISTORICAL ECHOES / 与千古智慧对话</p>
      </div>

      <div className="hall-filter-section">
        <div className="hall-search-box">
          <input
            type="text"
            className="hall-search-input"
            placeholder="搜索历史人物..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="hall-search-icon">🔍</span>
        </div>
        <div className="hall-filter-group">
          {['all', 'poetry', 'philosophy', 'science', 'politics'].map(f => (
            <button
              key={f}
              className={`hall-filter-btn ${currentFilter === f ? 'active' : ''}`}
              onClick={() => setCurrentFilter(f)}
            >
              {f === 'all' ? '全部' : f === 'poetry' ? '文学' : f === 'philosophy' ? '哲学' : f === 'science' ? '科学' : '政治'}
            </button>
          ))}
        </div>
      </div>

      <div className="hall-grid">
        {filteredSages.length > 0 ? (
          filteredSages.map(sage => (
            <Link key={sage.id} to={`/digital-rebirth/history-dialogue/${sage.id}`} className="hall-card">
              <div className={`hall-card-bg theme-${sage.theme}`}>
                <div className="hall-avatar">{sage.name.charAt(0)}</div>
              </div>
              <div className="hall-card-content">
                <h3 className="hall-name">{sage.name}</h3>
                <div className="hall-period">{sage.period}</div>
                <div className="hall-field-tag">{sage.fieldName}</div>
                <p className="hall-desc">{sage.desc}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="hall-empty">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3>未找到相关历史人物</h3>
            <p>尝试调整搜索条件或筛选类别</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryHallPage;
