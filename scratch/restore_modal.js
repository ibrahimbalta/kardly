const fs = require('fs');
const f = 'c:\\Users\\A\\Desktop\\aiweb\\src\\app\\[username]\\ProfileClient.tsx';
let c = fs.readFileSync(f, 'utf8');

const cutOffMark = 'function ArticleReaderModal';
const index = c.lastIndexOf(cutOffMark);

if (index === -1) {
    console.log('Not found');
    process.exit(1);
}

const head = c.substring(0, index);

const correctFunction = `function ArticleReaderModal({ isOpen, onClose, article, theme, t, lang }: any) {
    if (!isOpen || !article) return null;

    // Generate dynamic background based on theme accent
    const accentColor = theme?.accent || '#6366f1';
    const isLight = theme?.isLight;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 backdrop-blur-2xl"
                    style={{ 
                        backgroundColor: isLight 
                            ? \`\${accentColor}08\` 
                            : \`\${accentColor}15\`,
                        backgroundImage: isLight
                            ? \`radial-gradient(ellipse at top, \${accentColor}12 0%, rgba(0,0,0,0.15) 70%)\`
                            : \`radial-gradient(ellipse at top, \${accentColor}25 0%, rgba(0,0,0,0.92) 70%)\`
                    }}
                />
                <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 30, stiffness: 350 }}
                    className={cn(
                        "relative w-full sm:max-w-3xl border rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl z-10 mx-auto max-h-screen sm:max-h-[85vh] flex flex-col transition-colors duration-500",
                        isLight ? "border-black/5" : "border-white/10"
                    )}
                    onClick={(e) => e.stopPropagation()}
                    style={{ 
                        boxShadow: \`0 30px 100px -20px \${accentColor}40\`,
                        backgroundColor: isLight ? '#ffffff' : \`color-mix(in srgb, \${accentColor} 5%, #0a0a0f)\`
                    }}
                >
                    <div className="w-12 h-1.5 rounded-full mx-auto my-5 sm:hidden shrink-0" style={{ backgroundColor: \`\${accentColor}30\` }} />
                    
                    <header className="flex items-center justify-between px-8 py-5 shrink-0" style={{ borderBottom: \`1px solid \${isLight ? accentColor + '15' : accentColor + '15'}\` }}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: \`\${accentColor}20\`, color: accentColor }}>
                                <FileText size={16} />
                            </div>
                            <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isLight ? "text-slate-400" : "text-white/40")}>{t.articleReading || "MAKALE OKUNUYOR"}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className={cn("w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:rotate-90 duration-300 shadow-sm", isLight ? "bg-black/5 border-black/10 text-slate-600" : "bg-white/5 border-white/10 text-white/60 hover:text-white")}
                        >
                            <X size={18} />
                        </button>
                    </header>

                    <div className="flex-1 overflow-y-auto p-8 sm:p-12 no-scrollbar">
                        {article.coverImage && (
                            <img src={article.coverImage} alt={article.title} className="w-full aspect-video object-cover rounded-[2rem] mb-10 shadow-2xl" style={{ border: \`1px solid \${accentColor}15\` }} />
                        )}

                        <div className="max-w-2xl mx-auto space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: \`\${accentColor}20\`, color: accentColor }}>
                                        BLOG
                                    </span>
                                    <span className={cn("text-[10px] font-black uppercase tracking-widest", isLight ? "text-slate-300" : "text-white/20")}>
                                        {new Date(article.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h2 className={cn("text-3xl sm:text-4xl font-black tracking-tighter leading-tight italic", isLight ? "text-slate-900" : "text-white")}>
                                    {article.title}
                                </h2>
                            </div>

                            <div className="h-1 w-20 rounded-full" style={{ backgroundColor: accentColor }} />

                            <style dangerouslySetInnerHTML={{ __html: \`
                                .article-content { line-height: 1.9; letter-spacing: 0.01em; }
                                .article-content p { margin-bottom: 1.25em; }
                                .article-content h1 { font-size: 1.75em; font-weight: 900; margin-top: 2em; margin-bottom: 0.75em; letter-spacing: -0.02em; }
                                .article-content h2 { font-size: 1.5em; font-weight: 800; margin-top: 1.75em; margin-bottom: 0.6em; letter-spacing: -0.02em; }
                                .article-content h3 { font-size: 1.25em; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; }
                                .article-content h4 { font-size: 1.1em; font-weight: 700; margin-top: 1.25em; margin-bottom: 0.4em; }
                                .article-content ul, .article-content ol { margin: 1em 0; padding-left: 1.5em; }
                                .article-content li { margin-bottom: 0.5em; line-height: 1.7; }
                                .article-content ul li { list-style-type: disc; }
                                .article-content ol li { list-style-type: decimal; }
                                .article-content blockquote { border-left: 3px solid \${accentColor}; padding: 0.75em 1.25em; margin: 1.5em 0; font-style: italic; opacity: 0.85; border-radius: 0 0.5rem 0.5rem 0; }
                                .article-content blockquote.light-mode { background: \${accentColor}08; }
                                .article-content blockquote.dark-mode { background: \${accentColor}10; }
                                .article-content strong { font-weight: 700; }
                                .article-content a { color: \${accentColor}; text-decoration: underline; text-underline-offset: 3px; }
                                .article-content img { border-radius: 1.5rem; margin: 1.5em 0; max-width: 100%; }
                                .article-content pre { background: rgba(0,0,0,0.15); padding: 1em; border-radius: 0.75rem; overflow-x: auto; margin: 1.5em 0; font-size: 0.9em; }
                                .article-content code { background: rgba(0,0,0,0.1); padding: 0.15em 0.4em; border-radius: 0.25em; font-size: 0.9em; }
                                .article-content hr { border: none; height: 1px; margin: 2em 0; opacity: 0.15; }
                                .article-content.is-light hr { background: #000; }
                                .article-content.is-dark hr { background: #fff; }
                                .article-content.is-light h1, .article-content.is-light h2, .article-content.is-light h3, .article-content.is-light h4 { color: #0f172a; }
                                .article-content.is-dark h1, .article-content.is-dark h2, .article-content.is-dark h3, .article-content.is-dark h4 { color: #fff; }
                            \` }} />

                            <div 
                                className={cn(
                                    "article-content antialiased font-medium text-[15px] sm:text-[16px] transition-colors duration-500",
                                    isLight ? "is-light text-slate-600" : "is-dark text-white/80"
                                )}
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </div>
                        
                        <div className="h-20" /> {/* Extra space for scroll */}
                    </div>

                    <footer className="p-6 backdrop-blur-xl shrink-0" style={{ borderTop: \`1px solid \${accentColor}15\`, backgroundColor: isLight ? \`\${accentColor}05\` : \`\${accentColor}08\` }}>
                        <button 
                            onClick={onClose}
                            className={cn(
                                "w-full py-4 border rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95",
                                isLight 
                                    ? "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200" 
                                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                            )}
                        >
                            {t.closeReader || "OKUMAYI BİTİR"}
                        </button>
                    </footer>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}`;

fs.writeFileSync(f, head + correctFunction + '\n', 'utf8');
console.log('Restored ArticleReaderModal correctly');
