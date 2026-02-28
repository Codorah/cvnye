import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Terminal, Zap, Code2, Download, Layout, Mail } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: "Comment CVNyé optimise-t-il mon CV ?",
      answer: "CVNyé utilise l'intelligence de Google Search pour identifier les compétences les plus recherchées dans votre secteur en temps réel. Ensuite, Gemini synthétise vos expériences pour les aligner parfaitement avec ces attentes du marché.",
      icon: <Code2 className="text-brand-primary" />
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Vos données sont traitées uniquement pour la génération de votre CV et ne sont jamais stockées de manière permanence sur nos serveurs. Nous privilégions une approche éphémère et sécurisée.",
      icon: <Zap className="text-brand-secondary" />
    },
    {
      question: "Puis-je exporter mon CV en PDF ?",
      answer: "Oui, une fois votre CV généré et personnalisé avec l'un de nos templates 'Aesthetic', vous pouvez l'exporter instantanément en format PDF haute définition prêt pour l'impression ou l'envoi par email.",
      icon: <Download className="text-brand-accent" />
    },
    {
      question: "Quels sont les templates disponibles ?",
      answer: "Nous proposons quatre styles signatures : Modern (épuré), Luxury (sophistiqué), Classic (intemporel) et Minimal (essentiel). Chaque template est conçu pour maximiser l'impact visuel et la lisibilité.",
      icon: <Layout className="text-emerald-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-mesh py-32 lg:py-48">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest mb-10 border border-brand-primary/10">
            <HelpCircle size={14} />
            Centre d'Aide
          </div>
          <h1 className="text-6xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
            Questions <br />
            <span className="text-gradient">Fréquentes</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            Tout ce que vous devez savoir pour propulser votre carrière avec CVNyé.
          </p>
        </motion.div>

        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 lg:p-12 rounded-[48px] hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group"
            >
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  {React.cloneElement(faq.icon as React.ReactElement<any>, { size: 28 })}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-slate-900">{faq.question}</h3>
                  <p className="text-lg text-slate-500 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-16 rounded-[64px] bg-slate-900 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 blur-[80px]" />
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold mb-8">Encore des questions ?</h2>
            <p className="text-slate-400 mb-12 font-medium text-lg">Notre équipe est là pour vous accompagner dans votre réussite.</p>
            <a 
              href="mailto:codorah@hotmail.com"
              className="inline-flex items-center gap-4 bg-white text-slate-900 px-12 py-6 rounded-3xl font-black text-xl hover:bg-brand-primary hover:text-white transition-all duration-500"
            >
              Contactez-nous
              <Mail size={24} />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
