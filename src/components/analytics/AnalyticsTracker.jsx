import { useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

/**
 * AnalyticsTracker - 负责默默记录访问量和用户在线状态
 */
const AnalyticsTracker = () => {
    const { user } = useAuth();
    const lastSessionUpdate = useRef(Date.now());

    useEffect(() => {
        // 1. 记录页面访问 (Visit Tracking)
        const trackVisit = async () => {
            const hasVisitedToday = localStorage.getItem('last_visit_date') === new Date().toDateString();

            // 发送到 Supabase 的 site_visits 表
            // 如果表不存在，这里会报错，我们在控制台打印警告
            try {
                const { error } = await supabase.from('site_analytics').insert([
                    {
                        event_type: 'page_view',
                        is_unique: !hasVisitedToday,
                        user_agent: navigator.userAgent,
                        path: window.location.pathname
                    }
                ]);

                if (!error) {
                    localStorage.setItem('last_visit_date', new Date().toDateString());
                }
            } catch (err) {
                console.warn('Analytics sync deferred (Table missing?):', err.message);
            }
        };

        trackVisit();
    }, []);

    useEffect(() => {
        if (!user) return;

        // 2. 只有登录用户：更新在线状态和在线时长 (Online Status Heartbeat)
        const updateActivity = async () => {
            const now = Date.now();
            const durationSec = Math.floor((now - lastSessionUpdate.current) / 1000);
            lastSessionUpdate.current = now;

            try {
                // 更新用户状态表
                // 尝试更新已有记录，没有则插入
                const { error } = await supabase.from('user_activity').upsert({
                    user_id: user.id,
                    email: user.email,
                    last_seen: new Date().toISOString(),
                    // 这种简单的累计存在并发冲突可能，但对于展示目的足够
                    online_seconds_increment: durationSec
                }, { onConflict: 'user_id' });

                if (error) throw error;
            } catch (err) {
                // 默默失败，不干扰用户
            }
        };

        const interval = setInterval(updateActivity, 30000); // 每30秒心跳一次

        return () => {
            clearInterval(interval);
            updateActivity(); // 离开时最后更新一次
        };
    }, [user]);

    return null; // 不渲染任何 UI
};

export default AnalyticsTracker;
