import React from 'react';
import { CVData } from '../types';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface CVPreviewProps {
  data: CVData;
  template: 'modern' | 'classic' | 'minimal' | 'luxury';
}

export const CVPreview: React.FC<CVPreviewProps> = ({ data, template }) => {
  const { personalInfo, experiences, education, skills, projects, languages } = data;

  const renderHeader = () => {
    switch (template) {
      case 'modern':
        return (
          <div className="bg-slate-900 text-white p-12 rounded-t-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[80px] rounded-full" />
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 tracking-tighter">{personalInfo.fullName}</h1>
              <div className="flex flex-wrap gap-6 text-sm opacity-80 font-medium">
                <span className="flex items-center gap-2"><Mail size={16} className="text-indigo-400" /> {personalInfo.email}</span>
                <span className="flex items-center gap-2"><Phone size={16} className="text-indigo-400" /> {personalInfo.phone}</span>
                <span className="flex items-center gap-2"><MapPin size={16} className="text-indigo-400" /> {personalInfo.location}</span>
              </div>
            </div>
          </div>
        );
      case 'luxury':
        return (
          <div className="p-16 text-center border-b border-slate-200 bg-[#FAF9F6]">
            <h1 className="text-6xl font-serif font-light tracking-widest uppercase mb-6 text-slate-900">{personalInfo.fullName}</h1>
            <div className="flex justify-center flex-wrap gap-x-8 gap-y-2 text-xs uppercase tracking-[0.2em] text-slate-500 font-medium">
              <span>{personalInfo.email}</span>
              <span className="text-slate-300">|</span>
              <span>{personalInfo.phone}</span>
              <span className="text-slate-300">|</span>
              <span>{personalInfo.location}</span>
            </div>
          </div>
        );
      case 'classic':
        return (
          <div className="border-b-2 border-slate-800 pb-8 mb-8 text-center font-serif p-12">
            <h1 className="text-4xl font-bold uppercase tracking-[0.15em] mb-4 text-slate-900">{personalInfo.fullName}</h1>
            <div className="flex justify-center flex-wrap gap-x-6 gap-y-1 text-sm italic text-slate-600">
              <span>{personalInfo.email}</span>
              <span>•</span>
              <span>{personalInfo.phone}</span>
              <span>•</span>
              <span>{personalInfo.location}</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-12 mb-4">
            <h1 className="text-6xl font-light tracking-tighter mb-6 text-slate-900">{personalInfo.fullName}</h1>
            <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-[0.3em] text-slate-400 font-semibold">
              <span>{personalInfo.email}</span>
              <span>{personalInfo.phone}</span>
              <span className="col-span-2">{personalInfo.location}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div id="cv-content" className={`bg-white shadow-2xl p-0 min-h-[1122px] w-[794px] mx-auto text-slate-800 font-sans leading-relaxed ${template === 'luxury' ? 'bg-[#FAF9F6]' : ''}`}>
      {renderHeader()}
      
      <div className={`p-12 ${template === 'minimal' ? 'pt-0' : ''}`}>
        {/* Summary */}
        <section className="mb-12">
          <h2 className={`text-xs font-bold uppercase tracking-[0.2em] mb-4 ${
            template === 'modern' ? 'text-indigo-600' : 
            template === 'luxury' ? 'text-slate-900 border-b border-slate-200 pb-2' : 
            'text-slate-400'
          }`}>Professional Summary</h2>
          <p className={`text-sm leading-relaxed ${template === 'luxury' ? 'font-serif text-lg italic text-slate-700' : 'text-slate-600'}`}>
            {personalInfo.summary}
          </p>
        </section>

        <div className={`grid ${template === 'minimal' ? 'grid-cols-1' : 'grid-cols-3'} gap-12`}>
          <div className={template === 'minimal' ? 'col-span-1' : 'col-span-2'}>
            {/* Experience */}
            <section className="mb-12">
              <h2 className={`text-xs font-bold uppercase tracking-[0.2em] mb-6 ${
                template === 'modern' ? 'text-indigo-600' : 
                template === 'luxury' ? 'text-slate-900 border-b border-slate-200 pb-2' : 
                'text-slate-400'
              }`}>Experience</h2>
              <div className="space-y-10">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className={`font-bold ${template === 'luxury' ? 'text-xl font-serif' : 'text-slate-900'}`}>{exp.position}</h3>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-4">
                      <span className={`text-sm font-semibold ${template === 'modern' ? 'text-indigo-600' : 'text-slate-700'}`}>{exp.company}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest">{exp.location}</span>
                    </div>
                    <ul className="space-y-2">
                      {exp.description.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 flex gap-3">
                          <span className="text-indigo-400 mt-1.5 shrink-0 w-1 h-1 rounded-full bg-current" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            {projects && projects.length > 0 && (
              <section className="mb-12">
                <h2 className={`text-xs font-bold uppercase tracking-[0.2em] mb-6 ${
                  template === 'modern' ? 'text-indigo-600' : 
                  template === 'luxury' ? 'text-slate-900 border-b border-slate-200 pb-2' : 
                  'text-slate-400'
                }`}>Key Projects</h2>
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <h3 className="font-bold text-sm text-slate-900 mb-1">{project.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">{project.description}</p>
                      {project.link && <a href={project.link} className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">{project.link}</a>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className={template === 'minimal' ? 'col-span-1' : 'col-span-1'}>
            <div className="space-y-12">
              {/* Skills */}
              <section>
                <h2 className={`text-xs font-bold uppercase tracking-[0.2em] mb-6 ${
                  template === 'modern' ? 'text-indigo-600' : 
                  template === 'luxury' ? 'text-slate-900 border-b border-slate-200 pb-2' : 
                  'text-slate-400'
                }`}>Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span key={i} className="bg-slate-900 text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section>
                <h2 className={`text-xs font-bold uppercase tracking-[0.2em] mb-6 ${
                  template === 'modern' ? 'text-indigo-600' : 
                  template === 'luxury' ? 'text-slate-900 border-b border-slate-200 pb-2' : 
                  'text-slate-400'
                }`}>Education</h2>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-sm text-slate-900 mb-1">{edu.degree}</h3>
                      <p className="text-xs text-slate-600 mb-1">{edu.field}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{edu.school}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{edu.graduationDate}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Languages */}
              {languages && languages.length > 0 && (
                <section>
                  <h2 className={`text-xs font-bold uppercase tracking-[0.2em] mb-6 ${
                    template === 'modern' ? 'text-indigo-600' : 
                    template === 'luxury' ? 'text-slate-900 border-b border-slate-200 pb-2' : 
                    'text-slate-400'
                  }`}>Languages</h2>
                  <div className="space-y-2">
                    {languages.map((lang, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{lang}</span>
                        <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-indigo-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
