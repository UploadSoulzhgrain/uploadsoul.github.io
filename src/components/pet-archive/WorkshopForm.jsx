import React, { useRef } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { MediaService } from '../../services/mediaService';
import { toast } from 'react-hot-toast';

export const WorkshopForm = ({ data, onChange, userId }) => {
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    const [isUploading, setIsUploading] = React.useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    const handleHabitKeyDown = (e) => {
        if (e.key === 'Enter' && e.currentTarget.value) {
            const val = e.currentTarget.value.trim();
            if (!data.habits?.includes(val)) {
                onChange({ ...data, habits: [...(data.habits || []), val] });
            }
            e.currentTarget.value = '';
        }
    };

    const handleFileUpload = async (e, type) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;

        try {
            setIsUploading(type);
            const result = await MediaService.uploadMedia(userId, file, 'image', (progress) => { });

            const field = type === 'avatar' ? 'avatarUrl' : 'bannerUrl';
            onChange({ ...data, [field]: result.file_url });
            toast.success('上传成功');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error(error.message || '上传失败');
        } finally {
            setIsUploading(null);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Hidden Inputs */}
            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
            <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} />

            {/* Media Section */}
            <section className="pd-glass p-8 shadow-xl">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined pd-accent">perm_media</span>
                    情感媒体记录
                </h3>

                <div className="grid grid-cols-3 gap-4">
                    {/* Main Image Upload */}
                    <div
                        onClick={() => avatarInputRef.current?.click()}
                        className="col-span-2 aspect-video pd-upload-zone flex flex-col items-center justify-center group relative overflow-hidden"
                    >
                        {data.avatarUrl && (
                            <img src={data.avatarUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Pet Avatar" />
                        )}

                        {isUploading === 'avatar' ? (
                            <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'var(--pet-primary)' }} />
                        ) : (
                            <span className="material-symbols-outlined text-4xl mb-3" style={{ color: 'rgba(236,182,19,0.4)' }}>add_photo_alternate</span>
                        )}
                        <p className="text-sm font-bold text-slate-300 z-10">
                            {data.avatarUrl ? '点击更换主形象照片' : '点击上传主形象照片或视频'}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 z-10">支持 4K 高清, 最大 100MB</p>
                    </div>

                    {/* Voice Record */}
                    <div
                        onClick={() => bannerInputRef.current?.click()}
                        className="col-span-1 pd-card p-6 flex flex-col items-center justify-center text-center cursor-pointer"
                    >
                        {data.bannerUrl ? (
                            <div className="relative w-full h-full flex flex-col items-center justify-center">
                                <img src={data.bannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-30 rounded-xl" alt="Banner" />
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 z-10 cursor-pointer transition-all" style={{ background: 'rgba(236,182,19,0.1)' }}>
                                    <span className="material-symbols-outlined text-3xl" style={{ color: 'var(--pet-primary)' }}>mic</span>
                                </div>
                                <p className="text-sm font-bold mb-1 z-10">更换背景</p>
                            </div>
                        ) : (
                            <>
                                {isUploading === 'banner' ? (
                                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--pet-primary)' }} />
                                ) : (
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 cursor-pointer transition-all hover:opacity-80" style={{ background: 'rgba(236,182,19,0.1)' }}>
                                        <span className="material-symbols-outlined text-3xl" style={{ color: 'var(--pet-primary)' }}>mic</span>
                                    </div>
                                )}
                                <p className="text-sm font-bold mb-1">留下TA的声音</p>
                                <p className="text-[10px] text-slate-500">上传音频文件或直接录制</p>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Info Form - Two Column */}
            <section className="grid grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="pd-glass p-8">
                    <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl pd-accent">info</span>
                        基础信息
                    </h3>
                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">萌宠昵称</span>
                            <input
                                type="text"
                                name="name"
                                value={data.name || ''}
                                onChange={handleInputChange}
                                placeholder="输入那个熟悉的名字"
                                className="w-full pd-input"
                            />
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">物种</span>
                                <select
                                    name="species"
                                    value={data.species || 'Dog'}
                                    onChange={handleInputChange}
                                    className="w-full pd-input"
                                >
                                    <option value="Cat">猫咪</option>
                                    <option value="Dog">狗狗</option>
                                    <option value="Bird">飞鸟</option>
                                    <option value="Rabbit">兔兔</option>
                                    <option value="Other">其他</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">生辰</span>
                                <input
                                    type="date"
                                    name="birthday"
                                    value={data.birthday || ''}
                                    onChange={handleInputChange}
                                    className="w-full pd-input"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Habits */}
                <div className="pd-glass p-8">
                    <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl pd-accent">psychology</span>
                        习性特点
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.habits?.map((h, i) => (
                            <span key={i} className="pd-tag flex items-center gap-1.5">
                                {h}
                                <button onClick={() => onChange({ ...data, habits: data.habits.filter((_, idx) => idx !== i) })}>
                                    <Trash2 size={12} className="text-slate-500 hover:text-red-500" />
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            placeholder="+ 添加标签"
                            onKeyDown={handleHabitKeyDown}
                            className="pd-input text-xs"
                            style={{ width: 'auto', minWidth: '100px', borderStyle: 'dashed', background: 'transparent' }}
                        />
                    </div>
                    <div className="mt-6">
                        <span className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">最喜欢的食物/玩具</span>
                        <input
                            type="text"
                            name="favoriteFood"
                            value={data.favoriteFood || ''}
                            onChange={handleInputChange}
                            placeholder="例如：冻干鱼片"
                            className="w-full pd-input"
                        />
                    </div>
                </div>
            </section>

            {/* Memories */}
            <section className="pd-glass p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined pd-accent">auto_stories</span>
                    难忘记忆
                </h3>
                <textarea
                    name="bio"
                    value={data.bio || ''}
                    onChange={handleInputChange}
                    placeholder="记录下TA陪你度过的每一个瞬间，或是那些只有你们知道的秘密..."
                    rows={6}
                    className="w-full pd-input leading-relaxed resize-none"
                    style={{ borderRadius: '0.75rem', padding: '1rem' }}
                />
                <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg text-slate-400 transition-all" style={{ '--tw-hover-bg': 'rgba(236,182,19,0.1)' }}>
                            <span className="material-symbols-outlined text-xl">sentiment_satisfied</span>
                        </button>
                        <button className="p-2 rounded-lg text-slate-400 transition-all">
                            <span className="material-symbols-outlined text-xl">calendar_month</span>
                        </button>
                        <button className="p-2 rounded-lg text-slate-400 transition-all">
                            <span className="material-symbols-outlined text-xl">location_on</span>
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        字数：{data.bio?.length || 0} / 5000
                    </p>
                </div>
            </section>
        </div>
    );
};
