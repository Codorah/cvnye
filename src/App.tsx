import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Search,
  FileText,
  Send,
  Download,
  RefreshCw,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Languages,
  Layout,
  CheckCircle2,
  AlertCircle,
  Home,
  User,
  HelpCircle,
  Menu,
  X,
  Code2,
  Cpu,
  Zap,
  Sparkles
} from 'lucide-react';
import { CVData, UserContext, JobType, Duration, CVAnalysis } from './types';
import { searchJobTrends, analyzeAndImproveCV, parseRawInputToCV } from './services/gemini';
import { CVPreview } from './components/CVPreview';
import { FounderPage } from './components/FounderPage';
import { FAQPage } from './components/FAQPage';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type View = 'home' | 'builder' | 'founder' | 'faq';
type Step = 'welcome' | 'context' | 'input' | 'processing' | 'review';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [step, setStep] = useState<Step>('welcome');
  const [context, setContext] = useState<UserContext>({
    domain: '',
    target: 'job',
    duration: 'long-term',
    additionalInfo: ''
  });
  const [rawInput, setRawInput] = useState('');
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
  const [trends, setTrends] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [template, setTemplate] = useState<'modern' | 'classic' | 'minimal' | 'luxury'>('modern');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleStart = () => {
    setView('builder');
    setStep('context');
  };

  const processCV = async () => {
    setIsLoading(true);
    setError(null);
    setStep('processing');
    setProgress(10);

    try {
      setProgress(20);
      const [trendsResult, currentCV] = await Promise.all([
        searchJobTrends(context.domain, context.target).then(res => {
          setProgress(prev => Math.max(prev, 40));
          return res;
        }),
        (async () => {
          if (!rawInput.trim()) throw new Error("Veuillez fournir les informations de votre CV.");
          const res = await parseRawInputToCV(rawInput);
          setProgress(prev => Math.max(prev, 60));
          return res;
        })()
      ]);

      setTrends(trendsResult);
      setProgress(70);

      const analysisResult = await analyzeAndImproveCV(currentCV, context, trendsResult);
      setProgress(90);

      setAnalysis(analysisResult);
      setCvData(analysisResult.improvedCV);
      setProgress(100);

      setTimeout(() => {
        setStep('review');
      }, 500);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors du traitement de votre CV.");
      setStep('input');
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById('cv-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CV_${cvData?.personalInfo.fullName.replace(/\s+/g, '_')}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderNav = () => (
    <nav className="fixed top-0 w-full glass z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div
          className="flex items-center gap-3 font-extrabold text-2xl tracking-tighter text-slate-900 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <div className="w-11 h-11 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform duration-500">
            <Terminal size={22} />
          </div>
          <span className="text-gradient">CVNyé</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {[
            { id: 'home', label: 'Accueil', icon: <Home size={18} /> },
            { id: 'builder', label: 'Créateur CV', icon: <FileText size={18} /> },
            { id: 'founder', label: 'Fondatrice', icon: <User size={18} /> },
            { id: 'faq', label: 'FAQ', icon: <HelpCircle size={18} /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`relative flex items-center gap-2 text-sm font-bold transition-all ${view === item.id ? 'text-brand-primary' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              {item.label}
              {view === item.id && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-primary rounded-full"
                />
              )}
            </button>
          ))}

          <button
            onClick={handleStart}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-bold hover:bg-brand-primary transition-all shadow-xl shadow-brand-primary/10"
          >
            Commencer
          </button>
        </div>

        <button className="md:hidden text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {[
                { id: 'home', label: 'Accueil' },
                { id: 'builder', label: 'Créateur CV' },
                { id: 'founder', label: 'Fondatrice' },
                { id: 'faq', label: 'FAQ' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id as View);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left font-bold text-lg ${view === item.id ? 'text-brand-primary' : 'text-slate-600'}`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { handleStart(); setIsMenuOpen(false); }}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-center font-bold"
              >
                Commencer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  return (
    <div className="min-h-screen bg-mesh selection:bg-brand-primary/10 selection:text-brand-primary">
      {renderNav()}

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6"
            >
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 py-24 lg:py-40 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest mb-10 border border-brand-primary/10">
                    <Code2 size={14} />
                    Tech Girl Power & AI
                  </div>
                  <h1 className="text-7xl lg:text-9xl font-extrabold tracking-tight mb-10 leading-[0.85] text-slate-900">
                    Le CV qui <br />
                    <span className="text-gradient">code votre <br />succès.</span>
                  </h1>
                  <p className="text-xl text-slate-500 mb-14 max-w-lg leading-relaxed font-medium">
                    CVNyé fusionne l'intelligence de Google Search et la créativité de Gemini pour sculpter des carrières d'exception.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <button
                      onClick={handleStart}
                      className="group relative w-full sm:w-auto flex items-center justify-center gap-4 bg-slate-900 text-white px-12 py-6 rounded-3xl text-lg font-bold hover:bg-brand-primary transition-all duration-500 shadow-2xl shadow-brand-primary/20"
                    >
                      Créer mon CV
                      <ChevronRight className="group-hover:translate-x-2 transition-transform duration-500" />
                    </button>
                    <button
                      onClick={() => setView('founder')}
                      className="w-full sm:w-auto px-12 py-6 rounded-3xl text-lg font-bold text-slate-600 hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-slate-100"
                    >
                      Découvrir
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative hidden lg:block"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 blur-[120px] rounded-full" />
                  <div className="relative glass rounded-[60px] p-8 aspect-[4/5] overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/5 group-hover:opacity-0 transition-opacity duration-700" />
                    <div className="space-y-8">
                      <div className="h-12 w-40 bg-slate-100 rounded-2xl animate-pulse" />
                      <div className="space-y-4">
                        <div className="h-4 w-full bg-slate-100 rounded-full animate-pulse" />
                        <div className="h-4 w-3/4 bg-slate-100 rounded-full animate-pulse" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-32 bg-slate-50 rounded-3xl animate-pulse" />
                        <div className="h-32 bg-slate-50 rounded-3xl animate-pulse" />
                      </div>
                      <div className="h-64 bg-slate-50 rounded-[40px] animate-pulse" />
                    </div>
                    <div className="absolute bottom-12 left-12 right-12 p-8 glass rounded-[32px] translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center text-white">
                          <Sparkles size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-bold">Optimisé par Gemini</div>
                          <div className="text-xs text-slate-500">Score de pertinence : 98%</div>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[98%] h-full bg-brand-primary" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              <section className="py-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  {[
                    {
                      title: "Market Intelligence",
                      desc: "Analyse prédictive des tendances via Google Search pour vous positionner en leader.",
                      icon: <Search className="text-brand-primary" />,
                      color: "bg-indigo-50"
                    },
                    {
                      title: "Gemini Synthesis",
                      desc: "L'IA transforme votre parcours en une narration stratégique irrésistible.",
                      icon: <Cpu className="text-brand-secondary" />,
                      color: "bg-pink-50"
                    },
                    {
                      title: "Aesthetic Design",
                      desc: "Des interfaces luxueuses qui imposent votre autorité dès le premier regard.",
                      icon: <Layout className="text-brand-accent" />,
                      color: "bg-violet-50"
                    }
                  ].map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                      className="group p-10 rounded-[48px] hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
                    >
                      <div className={`w-20 h-20 rounded-3xl ${f.color} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                        {f.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-6">{f.title}</h3>
                      <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* SECTION: Comment ça marche ? */}
              <section className="py-24 border-t border-slate-100">
                <div className="text-center mb-16">
                  <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">Comment ça marche ?</h2>
                  <p className="text-lg text-slate-500 max-w-2xl mx-auto">4 étapes simples pour transformer votre brouillon en une candidature magnétique.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    { step: '01', title: 'Cible', desc: 'Définissez votre domaine et poste visé.', icon: <Search size={24} className="text-brand-primary" /> },
                    { step: '02', title: 'Parcours', desc: 'Collez vos expériences, même brutes.', icon: <FileText size={24} className="text-brand-secondary" /> },
                    { step: '03', title: 'IA Magique', desc: 'Gemini optimise et reformule chaque point.', icon: <Cpu size={24} className="text-brand-accent" /> },
                    { step: '04', title: 'Export', desc: 'Téléchargez un PDF au design de luxe.', icon: <Download size={24} className="text-slate-900" /> }
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className="glass p-8 rounded-[40px] text-center relative group hover:-translate-y-2 transition-transform duration-500 border border-slate-100/50"
                    >
                      <div className="text-6xl font-black text-slate-100 absolute -top-4 -left-4 z-0 group-hover:text-brand-primary/10 transition-colors duration-500">{s.step}</div>
                      <div className="w-16 h-16 mx-auto rounded-3xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500">
                        {s.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3 relative z-10">{s.title}</h3>
                      <p className="text-sm text-slate-500 relative z-10">{s.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* SECTION: Showcase des Templates */}
              <section className="py-24 border-t border-slate-100">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                  <div className="max-w-xl">
                    <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">Nos Signatures Visuelles</h2>
                    <p className="text-lg text-slate-500">Quatre styles esthétiques conçus pour marquer les esprits au premier coup d'œil.</p>
                  </div>
                  <button onClick={handleStart} className="text-brand-primary font-bold flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest text-sm">
                    Tous les essayer <ChevronRight size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { id: 'modern', name: 'Modern', color: 'from-blue-500 to-indigo-600' },
                    { id: 'luxury', name: 'Luxury', color: 'from-slate-900 to-slate-800' },
                    { id: 'classic', name: 'Classic', color: 'from-emerald-500 to-teal-600' },
                    { id: 'minimal', name: 'Minimal', color: 'from-slate-300 to-slate-200' },
                  ].map((tpl, i) => (
                    <motion.div
                      key={tpl.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group cursor-pointer"
                      onClick={() => setView('builder')}
                    >
                      <div className="aspect-[3/4] rounded-[40px] bg-slate-50 border border-slate-100 mb-6 p-4 relative overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:shadow-slate-200/50 transition-all duration-500">
                        {/* Fake CV Layout inside the template preview */}
                        <div className={`w-full h-24 rounded-2xl bg-gradient-to-br ${tpl.color} opacity-20 group-hover:opacity-100 transition-opacity duration-700 mb-4`} />
                        <div className="space-y-3">
                          <div className="w-2/3 h-3 bg-slate-200 rounded-full" />
                          <div className="w-1/2 h-2 bg-slate-200 rounded-full" />
                          <div className="pt-4 space-y-2">
                            <div className="w-full h-1 bg-slate-100 rounded-full" />
                            <div className="w-5/6 h-1 bg-slate-100 rounded-full" />
                            <div className="w-4/6 h-1 bg-slate-100 rounded-full" />
                          </div>
                        </div>
                      </div>
                      <h4 className="text-center font-bold text-lg text-slate-900">{tpl.name}</h4>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* SECTION: L'Art de la Synthèse (Avant / Après) */}
              <section className="py-24 border-t border-slate-100 mb-20">
                <div className="bg-slate-900 rounded-[64px] p-12 lg:p-20 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/20 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />

                  <div className="relative z-10 max-w-3xl mb-16">
                    <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">L'Art de la Synthèse</h2>
                    <p className="text-slate-400 text-lg">Voyez comment notre IA transforme un texte basique en une narration d'impact, taillée pour les algorithmes RH.</p>
                  </div>

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* AVANT */}
                    <div className="glass !bg-white/5 border-white/10 p-8 rounded-[40px]">
                      <div className="inline-block px-4 py-2 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest rounded-full mb-6 border border-red-500/20">
                        Avant (Texte Brut)
                      </div>
                      <p className="font-mono text-sm text-slate-400 leading-relaxed">
                        "J'ai géré une équipe de 5 personnes pendant 2 ans. J'ai aussi fait du dev web en React et Node.js.
                        On a réussi à finir le projet à temps et le client était content. J'ai corrigé pas mal de bugs."
                      </p>
                    </div>

                    {/* APRES */}
                    <div className="glass !bg-brand-primary/10 border-brand-primary/20 p-8 rounded-[40px] relative">
                      <div className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-slate-900 border-4 border-slate-800 rounded-full items-center justify-center z-20">
                        <ChevronRight className="text-brand-primary" />
                      </div>
                      <div className="inline-block px-4 py-2 bg-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest rounded-full mb-6 border border-brand-primary/30">
                        Après (Optimisé CVNyé)
                      </div>
                      <ul className="space-y-4">
                        <li className="text-sm text-slate-300 leading-relaxed flex gap-3">
                          <CheckCircle2 size={16} className="text-brand-secondary shrink-0 mt-0.5" />
                          <span><strong className="text-white">Leadership technique :</strong> Direction d'une équipe de 5 développeurs sur un cycle de développement de 24 mois.</span>
                        </li>
                        <li className="text-sm text-slate-300 leading-relaxed flex gap-3">
                          <CheckCircle2 size={16} className="text-brand-secondary shrink-0 mt-0.5" />
                          <span><strong className="text-white">Ingénierie Full-Stack :</strong> Conception et implémentation de solutions web robustes (React, Node.js).</span>
                        </li>
                        <li className="text-sm text-slate-300 leading-relaxed flex gap-3">
                          <CheckCircle2 size={16} className="text-brand-secondary shrink-0 mt-0.5" />
                          <span><strong className="text-white">Performance globale :</strong> Livraison des jalons dans les délais impartis, avec une réduction significative de la dette technique.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

            </motion.div>
          )}

          {view === 'founder' && <FounderPage key="founder" />}
          {view === 'faq' && <FAQPage key="faq" />}

          {view === 'builder' && (
            <motion.div
              key="builder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6 py-20"
            >
              <div className="flex flex-col lg:flex-row gap-12 items-start">

                {/* 🚀 NOUVEAU : Barre Latérale d'Information & Guide */}
                <div className="w-full lg:w-1/3 lg:sticky lg:top-32 space-y-8 hidden md:block">
                  <div className="glass p-8 rounded-[40px] shadow-xl shadow-slate-200/40">
                    <h3 className="text-xl font-extrabold mb-6 text-slate-900 flex items-center gap-3">
                      <Sparkles className="text-brand-primary" size={20} />
                      Pourquoi CVNyé ?
                    </h3>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                          <Search size={18} className="text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">Recherche Temps Réel</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Scan des tendances de votre secteur pour les mots-clés optimaux.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center shrink-0">
                          <Cpu size={18} className="text-pink-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">Optimisation Gemini</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">IA avancée pour sublimer votre narration professionnelle.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                          <Layout size={18} className="text-violet-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">Design de Luxe</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Aesthetic minimaliste pour un impact visuel inoubliable.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-8 rounded-[40px] bg-slate-900 text-white">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                      <Terminal size={18} className="text-brand-secondary" />
                      Comment ça marche ?
                    </h3>
                    <ul className="space-y-5 text-sm">
                      <li className="flex gap-3 text-slate-300">
                        <span className="font-bold text-white">1.</span> Ciblez votre poste
                      </li>
                      <li className="flex gap-3 text-slate-300">
                        <span className="font-bold text-white">2.</span> Collez votre parcours brut
                      </li>
                      <li className="flex gap-3 text-slate-300">
                        <span className="font-bold text-white">3.</span> L'IA structure et optimise
                      </li>
                      <li className="flex gap-3 text-brand-primary">
                        <span className="font-bold text-brand-primary">4.</span> Exportez le PDF magique
                      </li>
                    </ul>
                  </div>

                  {/* NOUVEAU : Exemple de Rendu */}
                  <div className="rounded-[40px] overflow-hidden border border-slate-100 shadow-2xl relative group h-48 bg-slate-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 flex flex-col justify-end p-6">
                      <p className="text-white font-bold text-sm">Résultat Aesthetic</p>
                      <p className="text-slate-300 text-xs mt-1">Design "Luxury"</p>
                    </div>
                    {/* Placeholder image or styled mock */}
                    <div className="absolute inset-x-4 top-4 bottom-12 bg-white rounded-xl shadow-sm border border-slate-200 p-2 opacity-80 group-hover:scale-105 transition-transform duration-700">
                      <div className="w-1/3 h-2 bg-slate-200 rounded-full mb-3" />
                      <div className="w-1/4 h-2 bg-slate-200 rounded-full mb-6" />
                      <div className="w-full h-1 bg-slate-100 rounded-full mb-2" />
                      <div className="w-5/6 h-1 bg-slate-100 rounded-full mb-5" />
                      <div className="w-1/2 h-1 bg-slate-100 rounded-full mb-2" />
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-2/3">
                  <AnimatePresence mode="wait">
                    {step === 'context' && (
                      <motion.div
                        key="context"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                      >
                        <div className="glass p-12 lg:p-16 rounded-[64px]">
                          <div className="flex items-center gap-4 mb-12">
                            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                              <Briefcase size={24} />
                            </div>
                            <h2 className="text-4xl font-extrabold tracking-tight">Définissons votre cible</h2>
                          </div>
                          <form onSubmit={(e) => { e.preventDefault(); setStep('input'); }} className="space-y-10">
                            <div className="space-y-4">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] ml-2">Secteur d'activité</label>
                              <input
                                type="text"
                                placeholder="ex: Intelligence Artificielle, Fintech..."
                                className="w-full px-8 py-6 rounded-3xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-lg"
                                value={context.domain}
                                onChange={(e) => setContext({ ...context, domain: e.target.value })}
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] ml-2">Type de contrat</label>
                                <select
                                  className="w-full px-8 py-6 rounded-3xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-brand-primary outline-none transition-all font-bold appearance-none"
                                  value={context.target}
                                  onChange={(e) => setContext({ ...context, target: e.target.value as JobType })}
                                >
                                  <option value="job">CDI / CDD</option>
                                  <option value="internship">Stage</option>
                                  <option value="contract">Freelance</option>
                                  <option value="remote">Full Remote</option>
                                </select>
                              </div>
                              <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] ml-2">Horizon</label>
                                <select
                                  className="w-full px-8 py-6 rounded-3xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-brand-primary outline-none transition-all font-bold appearance-none"
                                  value={context.duration}
                                  onChange={(e) => setContext({ ...context, duration: e.target.value as Duration })}
                                >
                                  <option value="long-term">Long Terme</option>
                                  <option value="short-term">Court Terme</option>
                                </select>
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-extrabold text-lg hover:bg-brand-primary transition-all duration-500 shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3"
                            >
                              Suivant
                              <ChevronRight size={24} />
                            </button>
                          </form>
                        </div>
                      </motion.div>
                    )}

                    {step === 'input' && (
                      <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                      >
                        <div className="glass p-12 lg:p-16 rounded-[64px]">
                          <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                <FileText size={24} />
                              </div>
                              <h2 className="text-4xl font-extrabold tracking-tight">Votre Parcours</h2>
                            </div>
                            <button onClick={() => setStep('context')} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Retour</button>
                          </div>

                          {error && (
                            <div className="mb-10 p-6 bg-red-50 border border-red-100 rounded-[32px] flex items-start gap-4 text-red-600 text-sm font-medium">
                              <AlertCircle className="shrink-0 mt-0.5" size={18} />
                              <p>{error}</p>
                            </div>
                          )}

                          <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-[40px] blur opacity-10 group-focus-within:opacity-30 transition-opacity duration-500" />
                            <textarea
                              placeholder="Collez votre CV actuel ou décrivez vos expériences avec vos propres mots..."
                              className="relative w-full px-10 py-10 rounded-[40px] bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-brand-primary outline-none transition-all h-[400px] font-mono text-sm leading-relaxed resize-none"
                              value={rawInput}
                              onChange={(e) => setRawInput(e.target.value)}
                            />
                          </div>

                          <div className="mt-12">
                            <button
                              onClick={processCV}
                              disabled={!rawInput.trim() || isLoading}
                              className="w-full bg-slate-900 text-white py-7 rounded-[32px] font-extrabold text-xl hover:bg-brand-primary transition-all duration-500 shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-4 disabled:opacity-50"
                            >
                              {isLoading ? <RefreshCw className="animate-spin" size={24} /> : <Terminal size={24} />}
                              Générer mon CV Aesthetic
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 'processing' && (
                      <motion.div
                        key="processing"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="max-w-2xl mx-auto text-center py-32"
                      >
                        <div className="relative w-56 h-56 mx-auto mb-16">
                          <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-[60px] animate-pulse" />
                          <svg className="w-full h-full relative z-10" viewBox="0 0 100 100">
                            <circle className="text-slate-100 stroke-current" strokeWidth="4" cx="50" cy="50" r="46" fill="transparent" />
                            <motion.circle
                              className="text-brand-primary stroke-current"
                              strokeWidth="4"
                              strokeLinecap="round"
                              cx="50"
                              cy="50"
                              r="46"
                              fill="transparent"
                              initial={{ strokeDasharray: "0 289" }}
                              animate={{ strokeDasharray: `${(progress / 100) * 289} 289` }}
                              transition={{ duration: 0.8, ease: "easeInOut" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                            <span className="text-6xl font-black text-slate-900 tracking-tighter">{progress}%</span>
                          </div>
                        </div>

                        <h2 className="text-5xl font-extrabold mb-8 tracking-tight text-slate-900">Architecture en cours...</h2>

                        <div className="space-y-8 max-w-sm mx-auto text-left">
                          {[
                            { threshold: 40, label: "Intelligence Marché", icon: <Search size={16} /> },
                            { threshold: 70, label: "Synthèse de Données", icon: <FileText size={16} /> },
                            { threshold: 90, label: "Optimisation Gemini", icon: <Terminal size={16} /> },
                            { threshold: 100, label: "Rendu Aesthetic", icon: <Layout size={16} /> }
                          ].map((s, i) => (
                            <div key={i} className={`flex items-center gap-6 transition-all duration-700 ${progress >= s.threshold ? 'text-brand-primary font-bold translate-x-2' : 'text-slate-300'}`}>
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 ${progress >= s.threshold ? 'bg-brand-primary/5 border-brand-primary/20' : 'border-slate-100'}`}>
                                {progress >= s.threshold ? <CheckCircle2 size={18} /> : s.icon}
                              </div>
                              <span className="text-sm uppercase tracking-[0.2em] font-bold">{s.label}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {step === 'review' && cvData && analysis && (
                      <motion.div
                        key="review"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
                      >
                        <div className="lg:col-span-4 space-y-10">
                          <div className="glass p-10 rounded-[48px]">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                              <Sparkles size={16} className="text-brand-primary" />
                              Améliorations Stratégiques
                            </h3>
                            <ul className="space-y-6">
                              {analysis.suggestions.map((s, i) => (
                                <li key={i} className="text-sm text-slate-600 leading-relaxed flex gap-4">
                                  <div className="w-2 h-2 rounded-full bg-brand-primary mt-1.5 shrink-0 shadow-lg shadow-brand-primary/40" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="glass p-10 rounded-[48px]">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                              <Layout size={16} className="text-brand-primary" />
                              Signature Visuelle
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              {(['modern', 'luxury', 'classic', 'minimal'] as const).map((t) => (
                                <button
                                  key={t}
                                  onClick={() => setTemplate(t)}
                                  className={`py-5 rounded-[24px] text-xs font-bold uppercase tracking-widest transition-all duration-500 border-2 ${template === t
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-900/20 scale-[1.02]'
                                    : 'bg-slate-50/50 text-slate-500 border-transparent hover:bg-white hover:border-slate-100'
                                    }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => setStep('input')}
                            className="w-full flex items-center justify-center gap-3 py-6 rounded-[32px] border-2 border-dashed border-slate-200 text-slate-400 font-bold hover:border-brand-primary hover:text-brand-primary transition-all duration-500"
                          >
                            <RefreshCw size={20} />
                            Réajuster les données
                          </button>
                        </div>

                        <div className="lg:col-span-8 space-y-16 pb-32">
                          <div className="overflow-x-auto rounded-[64px] shadow-2xl shadow-slate-200/50 border border-slate-100">
                            <div className="inline-block min-w-full align-middle">
                              <CVPreview data={cvData} template={template} />
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <button
                              onClick={downloadPDF}
                              disabled={isDownloading}
                              className="group relative flex items-center gap-6 bg-slate-900 text-white px-16 py-8 rounded-[40px] text-2xl font-black hover:bg-brand-primary transition-all duration-500 shadow-2xl shadow-brand-primary/30 disabled:opacity-50"
                            >
                              {isDownloading ? <RefreshCw size={32} className="animate-spin" /> : <Download size={32} />}
                              {isDownloading ? 'Génération...' : 'Exporter mon CV'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-3 font-extrabold text-2xl tracking-tighter text-slate-900">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white">
              <Terminal size={20} />
            </div>
            <span className="text-gradient">CVNyé</span>
          </div>
          <p className="text-sm text-slate-400 font-bold tracking-tight">
            © 2026 CVNyé par Codorah. Crafted with Passion & AI.
          </p>
          <div className="flex gap-10">
            <button onClick={() => setView('faq')} className="text-sm font-bold text-slate-500 hover:text-brand-primary transition-colors">FAQ</button>
            <button onClick={() => setView('founder')} className="text-sm font-bold text-slate-500 hover:text-brand-primary transition-colors">Fondatrice</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
