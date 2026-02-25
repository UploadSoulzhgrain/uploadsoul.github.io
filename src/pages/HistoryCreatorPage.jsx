import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HistoryCreatorPage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        period: '',
        field: '文学',
        title: '',
        biography: '',
        quotes: '',
        coreValues: ''
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const submitForm = () => {
        if (!formData.name || !formData.period || !formData.biography) {
            alert('请填写所有必填项 (*)');
            return;
        }

        setIsSubmitting(true);

        // Simulate AI learning process
        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/digital-rebirth/history-hall');
        }, 3000);
    };

    return (
        <div className="history-creator-wrapper">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;700&display=swap');

        .history-creator-wrapper {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Noto Serif SC', 'STSong', 'Songti SC', 'SimSun', serif;
          background: #0a0a0a;
          color: #d4af37;
          min-height: calc(100vh - 80px); /* 适配 Header */
          padding-top: 60px; /* 适配内部 Navbar */
        }

        .creator-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: rgba(10, 10, 10, 0.95);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          padding: 0 1rem;
          z-index: 1000;
        }

        @media (min-width: 768px) {
          .creator-navbar {
            padding: 0 2rem;
          }
        }

        .creator-back-btn {
          color: #d4af37;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .creator-back-btn:hover { color: #f4d03f; }

        .creator-container {
          padding: 2.5rem 1.5rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .creator-title-area {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .creator-title {
          font-size: 1.5rem;
          letter-spacing: 0.15rem;
          margin-bottom: 0.6rem;
          text-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
        }

        @media (min-width: 768px) {
          .creator-title {
            font-size: 2.2rem;
            letter-spacing: 0.3rem;
          }
        }

        .creator-subtitle {
          color: #8b7355;
          font-size: 1rem;
        }

        .creator-section {
          background: rgba(20, 20, 20, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          padding: 2rem;
          margin-bottom: 1.5rem;
          animation: creatorFadeUp 0.6s ease-out;
        }

        @keyframes creatorFadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .creator-section-header {
          font-size: 1.3rem;
          margin-bottom: 1.2rem;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          letter-spacing: 0.15rem;
        }

        .creator-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.2rem;
        }

        @media (min-width: 768px) {
          .creator-form-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }

        .creator-form-group { display: flex; flex-direction: column; }
        .creator-form-group.full-width { grid-column: 1 / -1; }

        .creator-label {
          font-size: 0.95rem;
          margin-bottom: 0.6rem;
          color: #d4af37;
        }

        .creator-input, .creator-select, .creator-textarea {
          background: rgba(30,30,30,0.7);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 6px;
          padding: 0.8rem;
          color: #d4af37;
          font-size: 0.95rem;
          font-family: inherit;
          transition: 0.3s;
        }
        .creator-input:focus, .creator-select:focus, .creator-textarea:focus {
          outline: none; border-color: #d4af37; background: rgba(40,40,40,0.8);
        }
        .creator-textarea { min-height: 120px; }

        .creator-upload-area {
          border: 1.5px dashed rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          padding: 2.5rem;
          text-align: center;
          cursor: pointer;
          transition: 0.3s;
        }
        .creator-upload-area:hover { border-color: #d4af37; background: rgba(30, 30, 30, 0.4); }

        .creator-upload-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.6; }
        .creator-upload-text { font-size: 1rem; margin-bottom: 0.4rem; }
        .creator-upload-hint { color: #8b7355; font-size: 0.85rem; }

        .creator-file-list {
          margin-top: 1.2rem;
          padding: 1rem;
          background: rgba(30, 30, 30, 0.4);
          border-radius: 6px;
        }
        .creator-file-item { padding: 0.4rem; color: #8b7355; font-size: 0.85rem; border-bottom: 0.5px solid rgba(212,175,55,0.1); }
        .creator-file-item:last-child { border-bottom: none; }

        .creator-submit-btn {
          width: 100%;
          padding: 1.2rem;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border: none;
          border-radius: 6px;
          color: #000;
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 0.15rem;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 1rem;
        }
        .creator-submit-btn:hover {
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
          transform: translateY(-2px);
        }

        .creator-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.96);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10001;
          text-align: center;
        }

        @keyframes creator-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .creator-form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

            <nav className="creator-navbar">
                <Link to="/digital-rebirth/history-hall" className="creator-back-btn">
                    <span>◀</span> 返回贤者殿堂
                </Link>
            </nav>

            <div className="creator-container">
                <div className="creator-title-area">
                    <h1 className="creator-title">历史人物生成器</h1>
                    <p className="creator-subtitle">上传史料文献，创建尚未收录的历史人物AI</p>
                </div>

                <div className="creator-section">
                    <h2 className="creator-section-header">基本信息</h2>
                    <div className="creator-form-grid">
                        <div className="creator-form-group">
                            <label className="creator-label">姓名 *</label>
                            <input
                                type="text"
                                name="name"
                                className="creator-input"
                                placeholder="例如：诸葛亮"
                                value={formData.name}
                                onChange={handleFormChange}
                            />
                        </div>
                        <div className="creator-form-group">
                            <label className="creator-label">生卒年份 *</label>
                            <input
                                type="text"
                                name="period"
                                className="creator-input"
                                placeholder="例如：181-234"
                                value={formData.period}
                                onChange={handleFormChange}
                            />
                        </div>
                        <div className="creator-form-group">
                            <label className="creator-label">领域 *</label>
                            <select
                                name="field"
                                className="creator-select"
                                value={formData.field}
                                onChange={handleFormChange}
                            >
                                {['文学', '哲学', '科学', '政治', '军事', '艺术', '其他'].map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </div>
                        <div className="creator-form-group">
                            <label className="creator-label">称号/职位</label>
                            <input
                                type="text"
                                name="title"
                                className="creator-input"
                                placeholder="例如：丞相、谋士"
                                value={formData.title}
                                onChange={handleFormChange}
                            />
                        </div>
                        <div className="creator-form-group full-width">
                            <label className="creator-label">生平简介 *</label>
                            <textarea
                                name="biography"
                                className="creator-textarea"
                                placeholder="请简要介绍此人的生平事迹、主要成就等..."
                                value={formData.biography}
                                onChange={handleFormChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="creator-section">
                    <h2 className="creator-section-header">史料上传</h2>
                    <p style={{ color: '#8b7355', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
                        上传传记、文集、史书记载等资料，AI将基于这些内容学习该人物的思想、性格和语言风格。
                    </p>

                    <div className="creator-upload-area" onClick={() => fileInputRef.current.click()}>
                        <div className="creator-upload-icon">📚</div>
                        <div className="creator-upload-text">点击上传史料文献</div>
                        <div className="creator-upload-hint">支持PDF、TXT、DOC等格式</div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            multiple
                            onChange={handleFileChange}
                            accept=".pdf,.txt,.doc,.docx"
                        />
                    </div>

                    {selectedFiles.length > 0 && (
                        <div className="creator-file-list">
                            <div style={{ color: '#d4af37', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 700 }}>已选择文件：</div>
                            {selectedFiles.map((f, i) => (
                                <div key={i} className="creator-file-item">
                                    📄 {f.name} ({(f.size / 1024).toFixed(1)} KB)
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="creator-section">
                    <h2 className="creator-section-header">性格特征</h2>
                    <div className="creator-form-grid">
                        <div className="creator-form-group full-width">
                            <label className="creator-label">代表性语录</label>
                            <textarea
                                name="quotes"
                                className="creator-textarea"
                                placeholder="输入该人物的名言警句或常说的话..."
                                value={formData.quotes}
                                onChange={handleFormChange}
                            />
                        </div>
                        <div className="creator-form-group full-width">
                            <label className="creator-label">思想核心</label>
                            <textarea
                                name="coreValues"
                                className="creator-textarea"
                                placeholder="概括该人物的核心思想、价值观..."
                                value={formData.coreValues}
                                onChange={handleFormChange}
                            />
                        </div>
                    </div>
                </div>

                <button className="creator-submit-btn" onClick={submitForm}>
                    生成历史人物 AI
                </button>
            </div>

            {isSubmitting && (
                <div className="creator-overlay">
                    <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', animation: 'creator-spin 2s linear infinite' }}>⚙️</div>
                    <h2 style={{ fontSize: '2rem', color: '#d4af37', marginBottom: '0.8rem', letterSpacing: '0.2rem' }}>AI 正在学习史料...</h2>
                    <p style={{ color: '#8b7355', fontSize: '1.1rem' }}>分析文献、提取特征、构建人格模型</p>
                    <p style={{ color: '#666', marginTop: '0.8rem', fontSize: '0.9rem' }}>预计需要3-5分钟</p>
                </div>
            )}
        </div>
    );
};

export default HistoryCreatorPage;
