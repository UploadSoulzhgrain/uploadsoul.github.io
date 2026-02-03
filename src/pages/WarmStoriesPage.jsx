http://127.0.0.1:5173/en/en/our-storiesimport React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './WarmStoriesPage.css';

const WarmStoriesPage = () => {
    const { t } = useTranslation();
    const [activeStory, setActiveStory] = useState(null);
    const [storyInput, setStoryInput] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const keywordWallRef = useRef(null);

    const stories = {
        healing: {
            id: 'healing',
            tag: t('warmStories.stories.healing.tag'),
            title: t('warmStories.stories.healing.title'),
            quote: t('warmStories.stories.healing.quote'),
            image: '/assets/story_healing.png',
            accent: '#6dd5c3',
            content: (
                <>
                    <p>{t('warmStories.stories.healing.p1')}</p>
                    <p>{t('warmStories.stories.healing.p2')}</p>
                    <p>{t('warmStories.stories.healing.p3')}</p>
                    <p>{t('warmStories.stories.healing.p4')}</p>
                </>
            ),
            meaning: t('warmStories.stories.healing.meaning'),
            meaningQuote: t('warmStories.stories.healing.meaningQuote')
        },
        fulfillment: {
            id: 'fulfillment',
            tag: t('warmStories.stories.fulfillment.tag'),
            title: t('warmStories.stories.fulfillment.title'),
            quote: t('warmStories.stories.fulfillment.quote'),
            image: '/assets/story_fulfillment.png',
            accent: '#ffb3ba',
            content: (
                <>
                    <p>{t('warmStories.stories.fulfillment.p1')}</p>
                    <p>{t('warmStories.stories.fulfillment.p2')}</p>
                    <p>{t('warmStories.stories.fulfillment.p3')}</p>
                    <p>{t('warmStories.stories.fulfillment.p4')}</p>
                    <p>{t('warmStories.stories.fulfillment.p5')}</p>
                </>
            ),
            meaning: t('warmStories.stories.fulfillment.meaning'),
            meaningQuote: t('warmStories.stories.fulfillment.meaningQuote')
        },
        legacy: {
            id: 'legacy',
            tag: t('warmStories.stories.legacy.tag'),
            title: t('warmStories.stories.legacy.title'),
            quote: t('warmStories.stories.legacy.quote'),
            image: '/assets/story_legacy.png',
            accent: '#f4d5a6',
            content: (
                <>
                    <p>{t('warmStories.stories.legacy.p1')}</p>
                    <p>{t('warmStories.stories.legacy.p2')}</p>
                    <p>{t('warmStories.stories.legacy.p3')}</p>
                    <p>{t('warmStories.stories.legacy.p4')}</p>
                </>
            ),
            meaningQuote: t('warmStories.stories.legacy.meaningQuote')
        },
        reunion: {
            id: 'reunion',
            tag: t('warmStories.stories.reunion.tag'),
            title: t('warmStories.stories.reunion.title'),
            quote: t('warmStories.stories.reunion.quote'),
            image: '/assets/story_reunion.png',
            accent: '#c4b5fd',
            content: (
                <>
                    <p>{t('warmStories.stories.reunion.p1')}</p>
                    <p>{t('warmStories.stories.reunion.p2')}</p>
                    <p>{t('warmStories.stories.reunion.p3')}</p>
                    <p>{t('warmStories.stories.reunion.p4')}</p>
                </>
            ),
            meaning: t('warmStories.stories.reunion.meaning'),
            meaningQuote: t('warmStories.stories.reunion.meaningQuote')
        },
        companion: {
            id: 'companion',
            tag: t('warmStories.stories.companion.tag'),
            title: t('warmStories.stories.companion.title'),
            quote: t('warmStories.stories.companion.quote'),
            image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80',
            accent: '#ffa94d',
            content: (
                <>
                    <p>{t('warmStories.stories.companion.p1')}</p>
                    <p>{t('warmStories.stories.companion.p2')}</p>
                    <p>{t('warmStories.stories.companion.p3')}</p>
                    <p>{t('warmStories.stories.companion.p4')}</p>
                    <p>{t('warmStories.stories.companion.p5')}</p>
                    <p>{t('warmStories.stories.companion.p6')}</p>
                    <p>{t('warmStories.stories.companion.p7')}</p>
                    <p>{t('warmStories.stories.companion.p8')}</p>
                    <p>{t('warmStories.stories.companion.p9')}</p>
                    <p>{t('warmStories.stories.companion.p10')}</p>
                </>
            ),
            meaning: (
                <>
                    <p>它们的生命那么短，却把一生的爱都给了我们。</p>
                    <p>我们不能让它们多活一天，但我们可以把那些被爱过的瞬间留下来——在数字世界里，继续陪伴你。</p>
                </>
            ),
            meaningQuote: '"它会一直在那里，等你回家。"'
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
            <Helmet>
                <title>存在的意义 - 温情故事 | UploadSoul 传灵</title>
                <meta name="description" content="那些关于思念、治愈与重逢的故事。每一个独特的灵魂，都值得被这个世界温柔地备份。" />
                <meta name="keywords" content="温情故事, 情感记录, 数字记忆, 思念, 治愈, UploadSoul" />
            </Helmet>
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
                <div className="bookmarks-shelf">
                    {['healing', 'legacy', 'reunion', 'companion', 'fulfillment'].map((key) => {
                        const story = stories[key];
                        return (
                            <div
                                key={story.id}
                                className={`bookmark-wrapper ${story.id}`}
                                onClick={() => setActiveStory(story)}
                            >
                                <div className="bookmark-thread"></div>

                                <div
                                    className="story-bookmark"
                                    style={{ backgroundImage: `url(${story.image})` }}
                                >
                                    <div className="bookmark-overlay"></div>
                                    <div className="bookmark-hole"></div>
                                    <div className="bookmark-knot"></div>

                                    <div className="bookmark-body">
                                        <div className="bookmark-quote">{story.quote.replace(/"/g, '')}</div>
                                        <h3 className="bookmark-title">{story.title}</h3>

                                        <div className="bookmark-footer">
                                            <div className="bookmark-icon">
                                                {story.id === 'healing' && <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>}
                                                {story.id === 'fulfillment' && <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>}
                                                {story.id === 'legacy' && <svg viewBox="0 0 24 24"><path d="M18.36 5.64a9 9 0 0 1 0 12.73 9 9 0 0 1-12.73 0 9 9 0 0 1 0-12.73 9 9 0 0 1 12.73 0"></path><circle cx="12" cy="12" r="3"></circle></svg>}
                                                {story.id === 'reunion' && <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                                                {story.id === 'companion' && <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M19,3A3,3 0 0,1 22,6A3,3 0 0,1 19,9A3,3 0 0,1 16,6A3,3 0 0,1 19,3M5,3A3,3 0 0,1 8,6A3,3 0 0,1 5,9A3,3 0 0,1 2,6A3,3 0 0,1 5,3M12,10.5C14.8,10.5 17.5,11.5 19.5,13.5C21.5,15.5 22.5,18.2 22.5,21H16.5C16.5,18.5 14.5,16.5 12,16.5C9.5,16.5 7.5,18.5 7.5,21H1.5C1.5,18.2 2.5,15.5 4.5,13.5C6.5,11.5 9.2,10.5 12,10.5Z" /></svg>}
                                            </div>
                                            <div className="bookmark-tag">
                                                {story.tag.split('·')[0].trim()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
