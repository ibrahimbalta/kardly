$filePath = "c:\Users\A\Desktop\aiweb\src\app\dashboard\DashboardClient.tsx"
$content = Get-Content $filePath
$newBlock = @"
                                                )}
                                                onClick={() => {
                                                    setProfileData({ ...profileData, templateId: tpl.id });
                                                    handleSave({ templateId: tpl.id });
                                                }}
                                            >
                                                <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                                                    {(tpl as any).image ? (
                                                        <img src={(tpl as any).image} alt={tpl.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                                                            <Layout className="w-12 h-12 text-slate-300" />
                                                        </div>
                                                    )}
                                                    {tpl.isNew && (
                                                        <div className="absolute top-4 left-4">
                                                            <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-emerald-500/20">{t('new')}</span>
                                                        </div>
                                                    )}
                                                    {profileData.templateId === tpl.id && (
                                                        <div className="absolute top-4 right-4 bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/30">
                                                            <CheckCircle2 size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-8 flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="font-black text-slate-900 text-lg mb-2 tracking-tight group-hover:text-primary transition-colors">{tpl.name}</h3>
                                                        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{tpl.description}</p>
                                                    </div>
                                                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase tracking-widest",
                                                            profileData.templateId === tpl.id ? "text-primary" : "text-slate-400"
                                                        )}>
                                                            {profileData.templateId === tpl.id ? t('active') || "AKTİF" : t('select') || "SEÇ"}
                                                        </span>
                                                        <ArrowRight size={14} className={cn(
                                                            "transition-all",
                                                            profileData.templateId === tpl.id ? "text-primary translate-x-1" : "text-slate-300 group-hover:text-primary group-hover:translate-x-1"
                                                        )} />
                                                    </div>
                                                </div>
                                            </motion.div>
"@
$start = 3931
$end = 3942
$newContent = ($content[0..($start-2)]) + $newBlock + ($content[$end..($content.Length-1)])
$newContent | Set-Content $filePath -Encoding UTF8
