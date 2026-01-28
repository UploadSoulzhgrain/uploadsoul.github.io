import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const FounderColumnPage = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-tech-mesh text-white">
            <Helmet>
                <title>{t('home.features.founderColumn.title')} | UploadSoul 传灵</title>
                <meta name="description" content={t('home.features.founderColumn.description')} />
            </Helmet>

            {/* Hero Image Section */}
            <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/src/assets/founder_column_hero.png"
                        alt="Founder's reflection"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
                </div>

                <div className="relative z-10 h-full flex items-end justify-center pb-12 px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="text-4xl md:text-5xl font-serif italic text-white/90 text-center max-w-3xl"
                    >
                        {t('home.features.founderColumn.letter.title')}
                    </motion.h1>
                </div>
            </section>

            {/* Letter Content */}
            <section className="py-16 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="max-w-3xl mx-auto"
                >
                    {/* Opening */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="text-lg md:text-xl leading-relaxed text-white/80 font-serif mb-8"
                    >
                        {t('home.features.founderColumn.letter.p1')}
                    </motion.p>

                    {/* Main Confession */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="text-lg md:text-xl leading-relaxed text-white/80 font-serif mb-12"
                    >
                        {t('home.features.founderColumn.letter.p2')}
                    </motion.p>

                    {/* Quote - Highlighted */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 1.2 }}
                        className="my-16 relative"
                    >
                        <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-amber-500/50 to-orange-500/50 rounded-full" />
                        <blockquote className="pl-8 pr-4 py-6 border-l-0">
                            <p className="text-2xl md:text-3xl font-serif italic text-white/90 leading-relaxed">
                                {t('home.features.founderColumn.letter.quote')}
                            </p>
                        </blockquote>
                    </motion.div>

                    {/* Mission Statement */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                        className="text-lg md:text-xl leading-relaxed text-white/80 font-serif mb-8"
                    >
                        {t('home.features.founderColumn.letter.p3')}
                    </motion.p>

                    {/* Closing */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.6 }}
                        className="text-lg md:text-xl leading-relaxed text-white/80 font-serif mb-12"
                    >
                        {t('home.features.founderColumn.letter.p4')}
                    </motion.p>

                    {/* New Paragraphs */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.8 }}
                        className="text-lg md:text-xl leading-relaxed text-white/90 font-serif italic mb-8"
                    >
                        {t('home.features.founderColumn.letter.p5')}
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 2.0 }}
                        className="text-lg md:text-xl leading-relaxed text-white/80 font-serif mb-8"
                    >
                        {t('home.features.founderColumn.letter.p6')}
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 2.2 }}
                        className="text-lg md:text-xl leading-relaxed text-white/80 font-serif mb-8"
                    >
                        {t('home.features.founderColumn.letter.p7')}
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 2.4 }}
                        className="text-lg md:text-xl leading-relaxed text-white/80 font-serif mb-12"
                    >
                        {t('home.features.founderColumn.letter.p8')}
                    </motion.p>

                    {/* Signature */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 2.6 }}
                        className="mt-16 flex items-center gap-4 border-t border-white/10 pt-8"
                    >
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg text-xl font-bold">
                            U
                        </div>
                        <div>
                            <div className="text-white font-medium text-lg">Founder</div>
                            <div className="text-white/40 text-sm">UploadSoul Inc.</div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Bottom Spacer */}
            <div className="h-24" />
        </div>
    );
};

export default FounderColumnPage;
