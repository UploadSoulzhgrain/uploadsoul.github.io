import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MemoryWorkshopPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const [formData, setFormData] = useState({
        name: '',
        relation: '祖父',
        birthDate: '',
        deathDate: '',
        hometown: '',
        occupation: '',
        biography: '',
        memories: {
            deepEvent: '',
            catchphrase: '',
            hobbies: '',
            attitude: ''
        }
    });

    const [uploadedFiles, setUploadedFiles] = useState({
        photo: [],
        video: [],
        audio: [],
        letter: [],
        diary: [],
        other: []
    });

    const [photoPreview, setPhotoPreview] = useState(null);
    const [invitedEmail, setInvitedEmail] = useState('');
    const [invitedEmails, setInvitedEmails] = useState([]);
    const [isFinishing, setIsFinishing] = useState(false);

    // File Input Refs
    const fileRefs = {
        photo: useRef(null),
        video: useRef(null),
        audio: useRef(null),
        letter: useRef(null),
        diary: useRef(null),
        other: useRef(null)
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleFileUpload = (e, type) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setUploadedFiles(prev => ({
                ...prev,
                [type]: [...prev[type], ...files]
            }));

            if (type === 'photo' && files[0].type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => setPhotoPreview(event.target.result);
                reader.readAsDataURL(files[0]);
            }
        }
    };

    const addInvitee = () => {
        const email = invitedEmail.trim();
        if (email && email.includes('@')) {
            if (!invitedEmails.includes(email)) {
                setInvitedEmails(prev => [...prev, email]);
            }
            setInvitedEmail('');
        } else {
            alert('请输入有效的邮箱地址');
        }
    };

    const removeInvitee = (emailToRemove) => {
        setInvitedEmails(prev => prev.filter(email => email !== emailToRemove));
    };

    const finishCreation = () => {
        if (!formData.name) {
            alert('请填写姓名');
            setCurrentStep(1);
            return;
        }

        setIsFinishing(true);

        setTimeout(() => {
            navigate('/digital-rebirth/family-galaxy');
        }, 3000);
    };

    return (
        <div className="memory-workshop-wrapper">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;700&display=swap');

        .memory-workshop-wrapper {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Noto Serif SC', 'STSong', 'Songti SC', 'SimSun', serif;
          background: #0a0a0a;
          color: #d4af37;
          min-height: calc(100vh - 80px); /* 适配 Header */
          position: relative;
        }

        /* 内部导航栏 */
        .workshop-navbar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
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

        .workshop-navbar-left {
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
        }

        .back-btn:hover {
          color: #f4d03f;
        }

        .workshop-navbar h1 {
          font-size: 1.4rem;
          letter-spacing: 0.2rem;
          margin: 0;
        }

        /* 进度指示器 */
        .workshop-progress-bar {
          position: sticky;
          top: 60px;
          left: 0;
          right: 0;
          height: 50px;
          background: rgba(15, 15, 15, 0.9);
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
          z-index: 999;
        }

        .workshop-step {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          opacity: 0.4;
          transition: all 0.3s;
        }

        .workshop-step.active {
          opacity: 1;
        }

        .workshop-step.completed {
          opacity: 0.7;
        }

        .workshop-step-number {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid #8b7355;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          transition: all 0.3s;
        }

        .workshop-step.active .workshop-step-number {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.15);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
        }

        .workshop-step.completed .workshop-step-number {
          background: #d4af37;
          color: #000;
          border-color: #d4af37;
        }

        .workshop-step-label {
          font-size: 0.85rem;
          letter-spacing: 0.1rem;
        }

        .workshop-step-arrow {
          color: #8b7355;
          font-size: 1rem;
        }

        /* 主内容 */
        .workshop-main-container {
          padding: 2.5rem 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .workshop-step-content {
          display: none;
          animation: workshopFadeIn 0.5s ease-out;
        }

        .workshop-step-content.active {
          display: block;
        }

        @keyframes workshopFadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .workshop-section-title {
          font-size: 1.8rem;
          text-align: center;
          margin-bottom: 0.8rem;
          letter-spacing: 0.2rem;
        }

        .workshop-section-subtitle {
          text-align: center;
          color: #8b7355;
          margin-bottom: 2.5rem;
          font-size: 1rem;
        }

        /* 表单样式 */
        .workshop-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .workshop-form-group {
          display: flex;
          flex-direction: column;
        }

        .workshop-form-group.full-width {
          grid-column: 1 / -1;
        }

        .workshop-form-label {
          font-size: 0.95rem;
          margin-bottom: 0.6rem;
          color: #d4af37;
          letter-spacing: 0.05rem;
        }

        .workshop-form-input,
        .workshop-form-select,
        .workshop-form-textarea {
          background: rgba(30, 30, 30, 0.7);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 6px;
          padding: 0.8rem;
          color: #d4af37;
          font-size: 0.95rem;
          font-family: inherit;
          transition: all 0.3s;
        }

        .workshop-form-input:focus,
        .workshop-form-select:focus,
        .workshop-form-textarea:focus {
          outline: none;
          border-color: #d4af37;
          background: rgba(40, 40, 40, 0.8);
        }

        .workshop-form-textarea {
          min-height: 100px;
        }

        /* 上传卡片 */
        .workshop-upload-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .workshop-upload-card {
          background: rgba(20, 20, 20, 0.8);
          border: 1.5px dashed rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }

        .workshop-upload-card:hover {
          border-color: #d4af37;
          background: rgba(30, 30, 30, 0.9);
        }

        .workshop-upload-icon {
          font-size: 2.2rem;
          margin-bottom: 0.8rem;
          opacity: 0.5;
        }

        .workshop-upload-title {
          font-size: 1.05rem;
          margin-bottom: 0.4rem;
        }

        .workshop-upload-desc {
          color: #8b7355;
          font-size: 0.8rem;
          line-height: 1.4;
        }

        .workshop-file-count {
          position: absolute;
          top: 0.8rem;
          right: 0.8rem;
          background: #d4af37;
          color: #000;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .workshop-file-preview {
          margin-top: 0.8rem;
          max-height: 100px;
          overflow: hidden;
          border-radius: 4px;
        }
        .workshop-file-preview img { width: 100%; height: auto; }

        /* 滑块 */
        .workshop-trait-sliders {
          display: grid;
          gap: 1.2rem;
        }

        .workshop-trait-item {
          background: rgba(20, 20, 20, 0.7);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 8px;
          padding: 1.2rem;
        }

        .workshop-trait-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.8rem;
          font-size: 0.95rem;
        }

        .workshop-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          -webkit-appearance: none;
          background: linear-gradient(to right, rgba(139, 115, 85, 0.3), rgba(212, 175, 55, 0.3));
        }

        .workshop-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #d4af37;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.6);
        }

        /* 底部按钮 */
        .workshop-nav-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(212, 175, 55, 0.1);
        }

        .workshop-btn {
          padding: 0.8rem 2.5rem;
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
        }

        .workshop-btn:hover {
          background: rgba(212, 175, 55, 0.2);
        }

        .workshop-btn-finish {
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          color: #000;
          font-weight: 700;
          border: none;
        }

        .workshop-btn-finish:hover {
          box-shadow: 0 0 25px rgba(212, 175, 55, 0.5);
        }

        /* 邀请标签 */
        .invited-tag {
          background: rgba(212, 175, 55, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 0.4rem 0.8rem;
          border-radius: 15px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
        }
        .invited-tag .remove { cursor: pointer; color: #ff6b6b; font-size: 1.1rem; }

        .finishing-overlay {
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

        @keyframes workshop-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .workshop-upload-grid { grid-template-columns: repeat(2, 1fr); }
          .workshop-form-grid { grid-template-columns: 1fr; }
          .workshop-step-arrow { display: none; }
          .workshop-step-label { display: none; }
        }
      `}</style>

            {/* 虚拟导航栏 */}
            <nav className="workshop-navbar">
                <div className="workshop-navbar-left">
                    <Link to="/digital-rebirth/family-galaxy" className="back-btn">
                        <span>◀</span> 返回家族星系
                    </Link>
                    <h1>记忆重塑工坊</h1>
                </div>
            </nav>

            {/* 进度条 */}
            <div className="workshop-progress-bar">
                {[
                    { id: 1, label: '基础信息' },
                    { id: 2, label: '记忆拾取' },
                    { id: 3, label: '众包记忆' },
                    { id: 4, label: '性格微调' }
                ].map((step, idx) => (
                    <React.Fragment key={step.id}>
                        <div className={`workshop-step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
                            <div className="workshop-step-number">{step.id}</div>
                            <div className="workshop-step-label">{step.label}</div>
                        </div>
                        {idx < 3 && <div className="workshop-step-arrow">→</div>}
                    </React.Fragment>
                ))}
            </div>

            <div className="workshop-main-container">
                {/* Step 1 */}
                <div className={`workshop-step-content ${currentStep === 1 ? 'active' : ''}`}>
                    <h2 className="workshop-section-title">基础信息</h2>
                    <p className="workshop-section-subtitle">请填写亲人的基本信息，这将帮助我们建立初始档案</p>
                    <div className="workshop-form-grid">
                        <div className="workshop-form-group">
                            <label className="workshop-form-label">姓名 *</label>
                            <input
                                type="text"
                                className="workshop-form-input"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="请输入姓名"
                            />
                        </div>
                        <div className="workshop-form-group">
                            <label className="workshop-form-label">与您的关系 *</label>
                            <select
                                className="workshop-form-select"
                                value={formData.relation}
                                onChange={e => setFormData({ ...formData, relation: e.target.value })}
                            >
                                {['祖父', '祖母', '外祖父', '外祖母', '父亲', '母亲', '其他'].map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>
                        <div className="workshop-form-group">
                            <label className="workshop-form-label">出生日期 *</label>
                            <input
                                type="date"
                                className="workshop-form-input"
                                value={formData.birthDate}
                                onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                            />
                        </div>
                        <div className="workshop-form-group">
                            <label className="workshop-form-label">离世日期</label>
                            <input
                                type="date"
                                className="workshop-form-input"
                                value={formData.deathDate}
                                onChange={e => setFormData({ ...formData, deathDate: e.target.value })}
                            />
                        </div>
                        <div className="workshop-form-group">
                            <label className="workshop-form-label">籍贯</label>
                            <input
                                type="text"
                                className="workshop-form-input"
                                value={formData.hometown}
                                onChange={e => setFormData({ ...formData, hometown: e.target.value })}
                                placeholder="例：江苏苏州"
                            />
                        </div>
                        <div className="workshop-form-group">
                            <label className="workshop-form-label">职业</label>
                            <input
                                type="text"
                                className="workshop-form-input"
                                value={formData.occupation}
                                onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                                placeholder="例：教师"
                            />
                        </div>
                        <div className="workshop-form-group full-width">
                            <label className="workshop-form-label">生平简介</label>
                            <textarea
                                className="workshop-form-textarea"
                                value={formData.biography}
                                onChange={e => setFormData({ ...formData, biography: e.target.value })}
                                placeholder="请简要描述他/她的人生历程、主要成就等..."
                            />
                        </div>
                    </div>
                    <div className="workshop-nav-buttons">
                        <div />
                        <button className="workshop-btn" onClick={nextStep}>下一步 →</button>
                    </div>
                </div>

                {/* Step 2 */}
                <div className={`workshop-step-content ${currentStep === 2 ? 'active' : ''}`}>
                    <h2 className="workshop-section-title">记忆拾取</h2>
                    <p className="workshop-section-subtitle">上传照片、视频、音频或文字资料，AI 将学习并重现他们的音容笑貌</p>
                    <div className="workshop-upload-grid">
                        {[
                            { type: 'photo', icon: '📷', title: '照片', desc: '支持 JPG, PNG\nAI 将自动修复上色' },
                            { type: 'video', icon: '🎥', title: '视频', desc: '支持 MP4, AVI\n提取声纹和表情' },
                            { type: 'audio', icon: '🎤', title: '语音', desc: '支持 MP3, WAV\n学习声音特征' },
                            { type: 'letter', icon: '✉️', title: '手写信件', desc: '支持扫描件\n学习字迹和语调' },
                            { type: 'diary', icon: '📖', title: '日记/文章', desc: '支持 TXT, PDF\n理解思想和情感' },
                            { type: 'other', icon: '📦', title: '其他资料', desc: '任何有价值的\n珍贵资料' }
                        ].map(item => (
                            <div
                                key={item.type}
                                className="workshop-upload-card"
                                onClick={() => fileRefs[item.type].current.click()}
                            >
                                <div className="workshop-upload-icon">{item.icon}</div>
                                <div className="workshop-upload-title">{item.title}</div>
                                <div className="workshop-upload-desc">{item.desc}</div>
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    ref={fileRefs[item.type]}
                                    multiple
                                    onChange={(e) => handleFileUpload(e, item.type)}
                                />
                                {uploadedFiles[item.type].length > 0 && (
                                    <div className="workshop-file-count">{uploadedFiles[item.type].length}</div>
                                )}
                                {item.type === 'photo' && photoPreview && (
                                    <div className="workshop-file-preview">
                                        <img src={photoPreview} alt="Preview" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="workshop-nav-buttons">
                        <button className="workshop-btn" onClick={prevStep}>← 上一步</button>
                        <button className="workshop-btn" onClick={nextStep}>下一步 →</button>
                    </div>
                </div>

                {/* Step 3 */}
                <div className={`workshop-step-content ${currentStep === 3 ? 'active' : ''}`}>
                    <h2 className="workshop-section-title">众包记忆</h2>
                    <p className="workshop-section-subtitle">邀请家族成员共同编辑，让记忆更加立体完整</p>

                    <div style={{ background: 'rgba(20,20,20,0.8)', padding: '1.5rem', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.2)', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>邀请家族成员参与</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="email"
                                className="workshop-form-input"
                                style={{ flex: 1 }}
                                placeholder="输入家族成员的邮箱地址"
                                value={invitedEmail}
                                onChange={e => setInvitedEmail(e.target.value)}
                            />
                            <button className="workshop-btn" onClick={addInvitee}>+ 添加</button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
                            {invitedEmails.map(email => (
                                <div key={email} className="invited-tag">
                                    {email} <span className="remove" onClick={() => removeInvitee(email)}>✕</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="workshop-form-grid">
                        <div className="workshop-form-group full-width">
                            <label className="workshop-form-label">您印象最深的一件事是什么？</label>
                            <textarea
                                className="workshop-form-textarea"
                                placeholder="请详细描述..."
                                value={formData.memories.deepEvent}
                                onChange={e => setFormData({ ...formData, memories: { ...formData.memories, deepEvent: e.target.value } })}
                            />
                        </div>
                        <div className="workshop-form-group full-width">
                            <label className="workshop-form-label">他/她常说的口头禅或名言是什么？</label>
                            <textarea
                                className="workshop-form-textarea"
                                placeholder="例如：「吃亏是福」「做人要诚实」"
                                value={formData.memories.catchphrase}
                                onChange={e => setFormData({ ...formData, memories: { ...formData.memories, catchphrase: e.target.value } })}
                            />
                        </div>
                    </div>

                    <div className="workshop-nav-buttons">
                        <button className="workshop-btn" onClick={prevStep}>← 上一步</button>
                        <button className="workshop-btn" onClick={nextStep}>下一步 →</button>
                    </div>
                </div>

                {/* Step 4 */}
                <div className={`workshop-step-content ${currentStep === 4 ? 'active' : ''}`}>
                    <h2 className="workshop-section-title">性格微调</h2>
                    <p className="workshop-section-subtitle">如果上传的资料不足，您可以通过滑块手动调整性格倾向</p>
                    <div className="workshop-trait-sliders">
                        {[
                            { left: '严肃', right: '慈祥' },
                            { left: '寡言', right: '健谈' },
                            { left: '传统', right: '开明' },
                            { left: '理性', right: '感性' },
                            { left: '严格', right: '宽容' },
                            { left: '保守', right: '幽默' }
                        ].map(pair => (
                            <div key={pair.left} className="workshop-trait-item">
                                <div className="workshop-trait-labels">
                                    <span style={{ color: '#8b7355' }}>{pair.left}</span>
                                    <span style={{ color: '#d4af37' }}>{pair.right}</span>
                                </div>
                                <input type="range" className="workshop-slider" />
                            </div>
                        ))}
                    </div>
                    <div className="workshop-nav-buttons">
                        <button className="workshop-btn" onClick={prevStep}>← 上一步</button>
                        <button className="workshop-btn workshop-btn-finish" onClick={finishCreation}>完成创建 ✓</button>
                    </div>
                </div>
            </div>

            {isFinishing && (
                <div className="finishing-overlay">
                    <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', animation: 'workshop-spin 2s linear infinite' }}>⚙️</div>
                    <h2 style={{ fontSize: '2rem', color: '#d4af37', marginBottom: '0.8rem', letterSpacing: '0.2rem' }}>正在重塑记忆...</h2>
                    <p style={{ color: '#8b7355', fontSize: '1.1rem' }}>AI 正在学习和整合所有资料</p>
                    <p style={{ color: '#666', marginTop: '0.8rem', fontSize: '0.9rem' }}>这可能需要几分钟时间</p>
                </div>
            )}
        </div>
    );
};

export default MemoryWorkshopPage;
