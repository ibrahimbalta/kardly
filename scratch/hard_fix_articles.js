const fs = require('fs');
const f = 'c:\\Users\\A\\Desktop\\aiweb\\src\\app\\[username]\\ProfileClient.tsx';
let c = fs.readFileSync(f, 'utf8');

const startMark = 'function ArticlesSection';
const endMark = 'function ArticleReaderModal';

const startIdx = c.indexOf(startMark);
const endIdx = c.indexOf(endMark);

if (startIdx === -1 || endIdx === -1) {
    console.log('Marks not found');
    process.exit(1);
}

const newArticlesSection = `function ArticlesSection({ articles, t, theme, setCurrentArticle, setIsArticleOpen, trackEvent, toneStyle, lang }: any) {
    const displayArticles = Array.isArray(articles) ? articles : [];
    const scrollRef = useRef<HTMLDivElement>(null);
    
    if (displayArticles.length === 0) return null;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="space-y-6 pt-10 px-4 group/slider relative">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-6 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]" style={{ backgroundColor: theme?.accent || '#6366f1' }} />
                    <h3 className={cn("text-[11px] font-black uppercase tracking-[0.3em] italic drop-shadow-md", theme?.isLight ? "text-slate-900/40" : "text-white/40")}>{t?.articlesTitle || "YAZILARIM"}</h3>
                </div>
                
                {/* Navigation Desktop Buttons */}
                <div className="hidden sm:flex items-center gap-2">
                    <button 
                        onClick={() => scroll('left')}
                        className={cn(
                            "w-8 h-8 rounded-full border flex items-center justify-center transition-all active:scale-90",
                            theme?.isLight ? "bg-white border-black/5 text-slate-400 hover:text-slate-900 shadow-sm" : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                        )}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className={cn(
                            "w-8 h-8 rounded-full border flex items-center justify-center transition-all active:scale-90",
                            theme?.isLight ? "bg-white border-black/5 text-slate-400 hover:text-slate-900 shadow-sm" : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                        )}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
            
            <div className="relative">
                {/* Scroll Buttons - Absolute Positioned */}
                <button 
                    onClick={() => scroll('left')} 
                    className={cn(
                        "absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-xl transition-all active:scale-95 shadow-xl sm:opacity-0 group-hover/slider:opacity-100",
                        theme?.isLight ? "bg-white/90 border-slate-200 text-slate-600 shadow-black/5" : "bg-black/60 border-white/10 text-white shadow-black/40"
                    )}
                >
                    <ChevronLeft size={20} />
                </button>
                
                <button 
                    onClick={() => scroll('right')} 
                    className={cn(
                        "absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-xl transition-all active:scale-95 shadow-xl sm:opacity-0 group-hover/slider:opacity-100",
                        theme?.isLight ? "bg-white/90 border-slate-200 text-slate-600 shadow-black/5" : "bg-black/60 border-white/10 text-white shadow-black/40"
                    )}
                >
                    <ChevronRight size={20} />
                </button>

                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-4 pb-6 -mx-4 px-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
                >
                    {displayArticles.map((article: any, i: number) => (
                        <motion.div
                            key={article.id || i}
                            initial={{ opacity: 0.5, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            whileHover={{ y: -8 }}
                            className={cn(
                                "flex-shrink-0 w-44 overflow-hidden group cursor-pointer backdrop-blur-2xl transition-all duration-500 rounded-[2.5rem] border snap-start",
                                theme?.isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.03] border-white/10"
                            )}
                            style={{ 
                                boxShadow: \`0 20px 40px -10px \${theme?.accent || '#6366f1'}15\`
                            }}
                            onClick={() => {
                                trackEvent("article_click", article.title);
                                if (typeof setCurrentArticle === 'function') setCurrentArticle(article);
                                if (typeof setIsArticleOpen === 'function') setIsArticleOpen(true);
                            }}
                        >
                            <div className="aspect-square relative overflow-hidden">
                                {article.coverImage ? (
                                    <img 
                                        src={article.coverImage} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        alt={article.title} 
                                        loading="lazy" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5 opacity-40">
                                        <FileText size={32} className="text-white/20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h4 className="text-[10px] font-black text-white leading-tight line-clamp-2 uppercase tracking-wide drop-shadow-md">
                                        {article.title}
                                    </h4>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}\n\n`;

fs.writeFileSync(f, c.substring(0, startIdx) + newArticlesSection + c.substring(endIdx), 'utf8');
console.log('Hard replace successful');
