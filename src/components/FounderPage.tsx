import React from 'react';
import { motion } from 'motion/react';
import { 
  Code2, 
  Cpu, 
  Globe, 
  Mail, 
  MapPin, 
  Phone, 
  Terminal, 
  Zap,
  Award,
  BookOpen,
  Heart,
  Music,
  Plane,
  Palette,
  Briefcase,
  Search,
  GraduationCap
} from 'lucide-react';

export const FounderPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-mesh text-slate-900">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest mb-10 border border-brand-primary/10">
                <Terminal size={14} />
                Fondatrice de CVNyé
              </div>
              <h1 className="text-7xl lg:text-9xl font-extrabold tracking-tight mb-10 leading-[0.85]">
                ATANA E. <br />
                ELODIE H. <br />
                <span className="text-gradient">(Codorah)</span>
              </h1>
              <p className="text-2xl text-slate-500 mb-12 leading-relaxed max-w-xl font-medium">
                IT Project Manager & Développeuse Full Stack spécialisée en 
                Intelligence Artificielle (PROMPT INGENIEUR).
              </p>
              
              <div className="flex flex-wrap gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-brand-primary" />
                  Lomé, Togo
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-brand-primary" />
                  codorah@hotmail.com
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-brand-primary" />
                  +228 71 67 25 65
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 blur-[100px] rounded-full" />
              <div className="relative aspect-square rounded-[80px] overflow-hidden glass p-4">
                <img 
                  src="https://picsum.photos/seed/elodie/800/800" 
                  alt="Elodie ATANA" 
                  className="w-full h-full object-cover rounded-[64px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 glass p-8 rounded-[40px] shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary flex items-center justify-center text-white">
                    <Zap size={32} />
                  </div>
                  <div>
                    <div className="text-2xl font-black">100+</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prompts Optimisés</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-12">À propos de moi</h2>
          <p className="text-xl lg:text-2xl text-slate-500 leading-relaxed font-medium">
            Je suis Elodie ATANA, Ingénieure IA et Prompt Engineering junior avec une solide base en 
            développement full-stack et en gestion de projets IT. Orientée vers la conception de solutions 
            numériques accessibles, pratiques et à fort impact, notamment dans l’éducation et l’innovation sociale. 
            Expérience en conception, structuration et optimisation de prompts pour des applications d’IA générative.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">Mes Services</h2>
            <p className="text-xl text-slate-500 font-medium">Expertise technique au service de votre vision.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                title: "Prompt Engineering",
                desc: "Conception et optimisation de prompts pour LLMs (GPT-4, Claude, Gemini) afin de maximiser la pertinence des réponses.",
                icon: <Terminal className="text-brand-primary" />,
                color: "bg-indigo-50"
              },
              {
                title: "Développement Full Stack",
                desc: "Création d'applications web et mobiles modernes, performantes et centrées sur l'utilisateur.",
                icon: <Code2 className="text-brand-secondary" />,
                color: "bg-pink-50"
              },
              {
                title: "Gestion de Projets IT",
                desc: "Pilotage de projets technologiques complexes, de la phase de conception à la mise en production.",
                icon: <Briefcase className="text-brand-accent" />,
                color: "bg-violet-50"
              },
              {
                title: "Solutions IA",
                desc: "Intégration d'intelligence artificielle générative dans vos processus métiers pour booster la productivité.",
                icon: <Cpu className="text-emerald-500" />,
                color: "bg-emerald-50"
              },
              {
                title: "No-Code / Low-Code",
                desc: "Développement rapide de prototypes et d'outils internes via des solutions agiles.",
                icon: <Zap className="text-amber-500" />,
                color: "bg-amber-50"
              },
              {
                title: "Design UI/UX",
                desc: "Conception d'interfaces esthétiques et d'expériences fluides qui marquent les esprits.",
                icon: <Palette className="text-sky-500" />,
                color: "bg-sky-50"
              }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-12 rounded-[56px] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
              >
                <div className={`w-20 h-20 rounded-3xl ${s.color} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                  {React.cloneElement(s.icon as React.ReactElement<any>, { size: 32 })}
                </div>
                <h3 className="text-2xl font-bold mb-6">{s.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Education - Bento Grid */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-10 leading-tight">Parcours & <br />Expertise</h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed">
                Une trajectoire dédiée à l'innovation technologique et à l'excellence opérationnelle.
              </p>
            </div>
            
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 rounded-[48px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                    <Briefcase size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Expérience</h3>
                </div>
                <div className="space-y-8">
                  <div>
                    <div className="text-brand-primary font-bold text-sm uppercase tracking-widest mb-2">2023 - Présent</div>
                    <div className="text-xl font-bold mb-2">IT Project Manager & AI Engineer</div>
                    <div className="text-slate-400">Freelance / Projets Innovants</div>
                  </div>
                  <div>
                    <div className="text-brand-primary font-bold text-sm uppercase tracking-widest mb-2">2021 - 2023</div>
                    <div className="text-xl font-bold mb-2">Full Stack Developer</div>
                    <div className="text-slate-400">Tech Solutions Africa</div>
                  </div>
                </div>
              </div>

              <div className="p-10 rounded-[48px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-brand-secondary/20 flex items-center justify-center text-brand-secondary">
                    <GraduationCap size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Formation</h3>
                </div>
                <div className="space-y-8">
                  <div>
                    <div className="text-brand-secondary font-bold text-sm uppercase tracking-widest mb-2">2023</div>
                    <div className="text-xl font-bold mb-2">Spécialisation Prompt Engineering</div>
                    <div className="text-slate-400">Certifications IA Avancées</div>
                  </div>
                  <div>
                    <div className="text-brand-secondary font-bold text-sm uppercase tracking-widest mb-2">2020</div>
                    <div className="text-xl font-bold mb-2">Ingénierie Informatique</div>
                    <div className="text-slate-400">Institut Supérieur de Technologie</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-48 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-6xl lg:text-8xl font-extrabold tracking-tight mb-12">Prêt à innover ?</h2>
          <p className="text-2xl text-slate-500 mb-16 font-medium">Collaborons pour donner vie à vos projets les plus ambitieux.</p>
          <a 
            href="mailto:codorah@hotmail.com"
            className="inline-flex items-center gap-4 bg-slate-900 text-white px-16 py-8 rounded-[40px] text-2xl font-black hover:bg-brand-primary transition-all duration-500 shadow-2xl shadow-brand-primary/20"
          >
            Me contacter
            <Mail size={32} />
          </a>
        </div>
      </section>
    </div>
  );
};
