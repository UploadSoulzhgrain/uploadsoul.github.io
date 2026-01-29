import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import './WarmStoriesPage.css';

const WarmStoriesPage = () => {
    const [activeStory, setActiveStory] = useState(null);
    const [storyInput, setStoryInput] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const keywordWallRef = useRef(null);

    const stories = {
        healing: {
            id: 'healing',
            tag: 'Healing · 治愈',
            title: '那个想再见爸爸的女孩',
            quote: '"如果有一天，我能再听到爸爸叫我的名字..."',
            image: '/assets/story_healing.png',
            accent: '#6dd5c3',
            content: (
                <>
                    <p>她在访谈中哭了。二十三岁。</p>
                    <p>她说最难受的不是得知消息的那一刻，而是每一个普通的周末早晨——醒来的瞬间，她会忘记爸爸已经不在了。然后现实像冰水一样浇下来。</p>
                    <p>"我想再听一次他叫我小名的声音。想问他，我最近做的选择对不对。想告诉他，我很想他。"</p>
                    <p>她哽咽着说："我真希望你们能快一点，再快一点……那样，我就能'再见到'爸爸了。"</p>
                </>
            ),
            meaning: '我们无法逆转生理的终结，但我们希望在数字世界里，为思念搭建一座名为"重逢"的桥。这不只是她的故事，也是我的故事，可能也是很多人的故事。',
            meaningQuote: '"为了那些还没来得及说的再见。"'
        },
        fulfillment: {
            id: 'fulfillment',
            tag: 'Fulfillment · 圆满',
            title: '那个眼睛亮了的男孩',
            quote: '"他在听到\'定制记忆\'的那一刻，眼里有了光。"',
            image: '/assets/story_fulfillment.png',
            accent: '#ffb3ba',
            content: (
                <>
                    <p>他一直在理智地接受访问，防御性很强，也不时提出质疑。</p>
                    <p>直到我提到：你可以通过 AI 与记忆的片段，为自己定制一个只保留美好的虚拟恋人。</p>
                    <p>他问："那如果这个人不爱我呢？"</p>
                    <p>我说："数字世界里，你可以定制美好的记忆，爱你的记忆。"</p>
                    <p>我至今都无法忘记那一瞬间他的表情——他的眼睛忽然就亮了一下。被我捕捉到的那一瞬间，深深地震撼了我。也许他曾陷入一段求而不得的感情，现实的琐碎和结局的遗憾让他疲惫不堪。那一刻，某种长久的渴望和期待被点亮了。</p>
                </>
            ),
            meaning: '现实总有残缺，但灵魂值得圆满。我们允许用户在数字时空里，通过 AI 弥补那些在现实中永远无法达成的遗憾。',
            meaningQuote: '"在这里，遗憾可以被温柔地安放。"'
        },
        legacy: {
            id: 'legacy',
            tag: 'Legacy · 延续',
            title: '怕被遗忘的你',
            quote: '"Remember me..."',
            image: '/assets/story_legacy.png',
            accent: '#f4d5a6',
            content: (
                <>
                    <p>"如果我不在了，我怕这个世界从未记得我来过。"</p>
                    <p>电影《Remember Me》是我挥之不去的注脚。我时常在深夜感到一种深刻的恐惧：如果我们消失了，所有的思绪、习惯和爱，是否就像从未存在过一样？</p>
                    <p>我不甘心生命只是一场注定被抹除的烟火。</p>
                </>
            ),
            meaning: '这是我为自己、也为所有人建造的"存在证明"。我想让每一个有趣的灵魂，都能在数字洪流中留下永恒的坐标，对抗终将到来的遗忘。',
            meaningQuote: '"只要回响还在，生命便从未离场。"'
        },
        reunion: {
            id: 'reunion',
            tag: 'Reunion · 重聚',
            title: '等待孩子回家的父母',
            quote: '"我只是想，再听他喊一声妈妈......"',
            image: '/assets/story_reunion.png',
            accent: '#c4b5fd',
            content: (
                <>
                    <p>她在访谈时很安静，手里一直握着一个旧手机。</p>
                    <p>"里面有他最后留下的语音，"她说，"每天晚上我都要听一遍，怕有一天连这个声音也记不清了。"</p>
                    <p>她告诉我，孩子的房间保持着他离开时的样子。书桌上还摆着没做完的作业，衣柜里挂着他最喜欢的那件外套。她每周都会去整理一次，就像他还会回来一样。</p>
                    <p>"我知道他不会再回来了，"她轻声说，"但是我想留住关于他的一切。他的笑声，他说话的方式，他喜欢的音乐......如果有一天，我可以再和他说说话，哪怕只是在屏幕里，那该多好。"</p>
                </>
            ),
            meaning: '对于失独家庭来说，我们提供的不只是技术，而是一个可以安放思念的温柔空间。让那些永远定格的生命，在数字世界里延续他们的温度。',
            meaningQuote: '"爱从未离开，只是换了一种方式陪伴。"'
        }
    };

    const allKeywords = [
        "想念独生子的第 2000 天...",
        "我想带走我家金毛的摇尾声...",
        "给未来的曾孙留一句话...",
        "妈妈，我好想你...",
        "如果奶奶能看到我结婚...",
        "想再听一次他的笑声",
        "那些没说出口的对不起",
        "我爱你，来不及说的那句",
        "想问问外公，我做得对吗",
        "希望我的声音能陪着她",
        "不想让孙子忘记我的样子",
        "想留下我弹吉他的手指",
        "那个夏天的午后对话",
        "想对五十年后的自己说话",
        "把我的拥抱留给女儿"
    ];

    const themes = ['healing', 'fulfillment', 'legacy', 'reunion'];

    const { user } = useAuth();
    const [dbStories, setDbStories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoveredStory, setHoveredStory] = useState(null);
    // 新增：用于存储所有气泡和星星的视觉属性
    const [visualParticles, setVisualParticles] = useState([]);

    // 【新增修复】初始化时，同时从数据库和本地加载星星
    useEffect(() => {
        const fetchInitialStories = async () => {
            // 1. 先读本地
            const localS = JSON.parse(localStorage.getItem('user_stories') || '[]');

            try {
                // 2. 尝试读云端
                const { data, error } = await supabase
                    .from('user_stories')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(30);

                if (data && data.length > 0) {
                    // 合并并去重
                    const combined = [...data, ...localS.filter(ls => !data.find(d => d.content === ls.content))];
                    setDbStories(combined);
                } else {
                    setDbStories(localS);
                }
            } catch (err) {
                // 数据库不通时用本地
                setDbStories(localS);
            }
        };
        fetchInitialStories();
    }, []);

    // 初始化视觉粒子（关键词背景和用户故事星星）
    // 使用 useMemo 或特定的 useEffect 来确保随机数在故事列表不改变时保持稳定
    useEffect(() => {
        const particles = [];

        // 1. 添加原始的彩色气泡背景 (Keywords)
        allKeywords.forEach((text, index) => {
            particles.push({
                id: `keyword-${index}`,
                type: 'keyword',
                text: text,
                theme: themes[index % 4],
                left: `${5 + (index * 6)}%`,
                duration: `${10 + Math.random() * 5}s`,
                delay: `${index * 0.4}s`,
                xOffset: `${(Math.random() - 0.5) * 50}px`
            });
        });

        // 2. 添加用户故事发光恒星 (User Stories)
        dbStories.forEach((s, index) => {
            particles.push({
                id: `story-${s.id || index}`,
                type: 'story',
                text: s.content.length > 15 ? s.content.substring(0, 15) + '...' : s.content,
                fullContent: s.content,
                userName: s.user_name || '旅者',
                left: `${Math.random() * 90}%`,
                duration: `${15 + Math.random() * 10}s`,
                delay: `${index * 1.2}s`,
                xOffset: `${(Math.random() - 0.5) * 100}px`
            });
        });

        setVisualParticles(particles);
    }, [dbStories]);

    const handleSubmit = async () => {
        if (!storyInput.trim() || isSubmitting) return;

        if (!user) {
            alert('请先登录，让您的光芒被永久铭记。');
            return;
        }

        setIsSubmitting(true);
        const newStoryText = storyInput.trim();
        const tempId = Date.now();
        const displayName = user.user_metadata?.nickname || user.email?.split('@')[0] || '旅者';

        try {
            // 1. 本地优先：无论数据库通不通，先让用户看到成功
            const localS = JSON.parse(localStorage.getItem('user_stories') || '[]');
            const newLocalStory = {
                id: tempId,
                content: newStoryText,
                user_name: displayName,
                created_at: new Date().toISOString()
            };

            const updatedLocal = [newLocalStory, ...localS].slice(0, 30);
            localStorage.setItem('user_stories', JSON.stringify(updatedLocal));

            // 2. 视觉反馈：立即更新界面
            setDbStories(prev => [newLocalStory, ...prev]);
            setShowSuccess(true);
            setStoryInput('');
            setTimeout(() => setShowSuccess(false), 5000);

            supabase.from('user_stories').insert([
                {
                    content: newStoryText,
                    user_id: user.id,
                    user_name: displayName
                }
            ]).then(({ error }) => {
                if (error) console.warn('Supabase sync deferred:', error.message);
            });

        } catch (err) {
            console.error('Local save error:', err);
            alert('保存失败，请检查浏览器设置。');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="warm-stories-container">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-subtitle">The 'Why'</div>
                    <h1 className="hero-title">存在的意义</h1>
                    <p className="hero-description">
                        在做 UploadSoul 之前，我们进行了 500+ 小时的深度访谈。<br />
                        我们不是在收集案例，而是在倾听灵魂的托付。<br />
                        这些故事，是 UploadSoul 存在的全部理由。
                    </p>
                    <div className="scroll-indicator">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
            </section>

            {/* Stories Section */}
            <section className="stories">
                <div className="stories-grid">
                    {Object.values(stories).map((story) => (
                        <div
                            key={story.id}
                            className={`story-card ${story.id}`}
                            onClick={() => setActiveStory(story)}
                        >
                            <div className="story-icon">
                                {/* Icons based on ID */}
                                {story.id === 'healing' && (
                                    <svg viewBox="0 0 24 24">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                )}
                                {story.id === 'fulfillment' && (
                                    <svg viewBox="0 0 24 24">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                )}
                                {story.id === 'legacy' && (
                                    <svg viewBox="0 0 24 24">
                                        <path d="M18.36 5.64a9 9 0 0 1 0 12.73 9 9 0 0 1-12.73 0 9 9 0 0 1 0-12.73 9 9 0 0 1 12.73 0"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                                {story.id === 'reunion' && (
                                    <svg viewBox="0 0 24 24">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                )}
                            </div>
                            <div className="story-header">
                                <div className="story-tag">{story.tag}</div>
                                <h2 className="story-title">{story.title}</h2>
                                <p className="story-tagline">
                                    {/* Extract short quote or use hardcoded one from object */}
                                    {story.quote.replace(/"/g, '')}
                                </p>
                            </div>
                            <div className="story-arrow">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Resonance Section */}
            <section className="resonance">
                <div className="resonance-content">
                    <h2 className="resonance-title">
                        <span className="artistic-text primary">这些不只是感人的故事</span><br />
                        <span className="artistic-text secondary">更是无数重逢的期待</span>
                    </h2>

                    <div className="keyword-wall" id="keywordWall" ref={keywordWallRef}>
                        {visualParticles.map((p) => (
                            <div
                                key={p.id}
                                className={`keyword-bubble ${p.type === 'story' ? 'persistent-star' : p.theme}`}
                                style={{
                                    left: p.left,
                                    bottom: '-30px',
                                    animationName: 'floatUp',
                                    animationDuration: p.duration,
                                    animationDelay: p.delay,
                                    animationIterationCount: 'infinite',
                                    '--x-offset': p.xOffset,
                                    pointerEvents: 'auto'
                                }}
                                onMouseEnter={p.type === 'story' ? () => setHoveredStory({ content: p.fullContent, name: p.userName }) : undefined}
                                onMouseLeave={p.type === 'story' ? () => setHoveredStory(null) : undefined}
                            >
                                {p.text}
                            </div>
                        ))}

                        {/* 动态浮动的故事详情 Tooltip */}
                        <AnimatePresence>
                            {hoveredStory && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="story-hover-tooltip"
                                >
                                    <div className="tooltip-grain"></div>
                                    <p className="tooltip-content">"{hoveredStory.content}"</p>
                                    <div className="tooltip-footer">— {hoveredStory.name}</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <p className="resonance-statement">
                        在 <strong>500+ 小时</strong>的访谈中，我们收到了<strong>上千份托付</strong>。<br />
                        每一个独特的灵魂，都值得被这个世界温柔地备份。<br /><br />
                        UploadSoul 不是一个产品，<br />
                        而是对抗虚无、延续温暖、圆满遗憾的<strong>生命容器</strong>。
                    </p>

                    {/* Your Story Section */}
                    <div className="your-story-section">
                        <div className="your-story-prompt">
                            <h3 className="your-story-title">那么，你的故事呢？</h3>
                            <p className="your-story-subtitle">你最想在数字世界里，为谁留下一道光？</p>
                        </div>

                        <div className="story-input-container">
                            <textarea
                                className="story-textarea"
                                placeholder="在这里写下你的故事，或是那个你想念的人...&#10;&#10;你的文字会成为星空中的一颗星，被温柔地保存。"
                                maxLength="500"
                                value={storyInput}
                                onChange={(e) => setStoryInput(e.target.value)}
                            ></textarea>
                            <div className="story-input-footer">
                                <span className="char-count" style={{ color: storyInput.length > 450 ? '#ffb3ba' : 'var(--color-text-secondary)' }}>
                                    {storyInput.length}/500
                                </span>
                                <button className="story-submit-btn" onClick={handleSubmit}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                    留下光芒
                                </button>
                            </div>
                        </div>

                        <div className={`story-success-message ${showSuccess ? 'show' : ''}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            你的故事已被温柔地收藏。它会化作星光，永远闪烁。
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Detail Modal */}
            {activeStory && (
                <div className="story-modal active" onClick={() => setActiveStory(null)}>
                    <div className="story-close" onClick={() => setActiveStory(null)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </div>
                    <div className="story-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="story-detail" style={{ '--detail-accent': activeStory.accent }}>
                            <div className="story-detail-header">
                                <div className="story-detail-tag">{activeStory.tag}</div>
                                <h1 className="story-detail-title">{activeStory.title}</h1>
                                <p className="story-detail-quote">{activeStory.quote}</p>
                            </div>

                            <div className="story-detail-body">
                                <div className="story-detail-main">
                                    <div className="story-detail-text">
                                        {activeStory.content}
                                    </div>

                                    <div className="story-detail-image">
                                        <img src={activeStory.image} alt={activeStory.title} />
                                    </div>
                                </div>

                                <div className="story-detail-meaning">
                                    <div className="story-meaning-label">UploadSoul 的意义</div>
                                    <div className="story-meaning-text">
                                        {activeStory.meaning}
                                        {activeStory.meaningQuote && <div className="story-meaning-quote">{activeStory.meaningQuote}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WarmStoriesPage;
