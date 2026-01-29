import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { GameCard, GameButton, Badge } from '../components/ui';
import { ArrowLeft, Code2, Server, Cloud, Database } from 'lucide-react';
import { STACK_OPTIONS } from '../constants';

export const TechStackPlanner: React.FC = () => {
  const { ideaId } = useParams<{ ideaId: string }>();
  const navigate = useNavigate();
  const { getStack, updateStack, getIdea } = useStore();

  const idea = getIdea(ideaId!);
  const stack = getStack(ideaId!) || {
    ideaId: ideaId!, frontend: [], backend: [], infra: [], apis: [], notes: ''
  };

  const toggleItem = (category: 'frontend'|'backend'|'infra'|'apis', item: string) => {
    const current = stack[category];
    const updated = current.includes(item) 
      ? current.filter(i => i !== item)
      : [...current, item];
    updateStack(ideaId!, { [category]: updated });
  };

  if (!idea) return <div>Idea not found</div>;

  const StackSection = ({ 
    title, 
    icon: Icon, 
    category, 
    options 
  }: { 
    title: string, 
    icon: any, 
    category: 'frontend'|'backend'|'infra'|'apis', 
    options: string[] 
  }) => (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4 px-1">
        <Icon className="text-brand-blue" size={24} strokeWidth={3} />
        <h3 className="text-2xl font-black capitalize dark:text-white brawl-button-outline italic tracking-tighter uppercase">{title}</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {options.map(opt => {
          const isSelected = stack[category].includes(opt);
          return (
            <div 
              key={opt}
              onClick={() => toggleItem(category, opt)}
              className={`
                cursor-pointer p-5 rounded-2xl border-3 font-black uppercase tracking-tighter text-center transition-all select-none active:translate-y-1
                ${isSelected 
                  ? 'bg-brand-yellow text-brand-dark border-brand-dark shadow-brawl active:shadow-brawl-active' 
                  : 'bg-white/10 text-gray-400 border-transparent hover:bg-white/20 hover:text-white'}
              `}
            >
              {opt}
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="max-w-4xl mx-auto">
       <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(`/ideas/${ideaId}`)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <ArrowLeft size={24} className="dark:text-white" />
        </button>
        <div className="flex-1">
           <h1 className="text-4xl font-black italic tracking-tighter brawl-button-outline uppercase text-white">TECH STACK</h1>
           <p className="text-brand-blue dark:text-brand-green font-black uppercase text-sm tracking-widest mt-1">Choose weapons for {idea.title}.</p>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700">
         <StackSection title="Frontend" icon={Code2} category="frontend" options={STACK_OPTIONS.frontend} />
         <StackSection title="Backend" icon={Server} category="backend" options={STACK_OPTIONS.backend} />
         <StackSection title="Infrastructure" icon={Cloud} category="infra" options={STACK_OPTIONS.infra} />
         <StackSection title="Third Party APIs" icon={Database} category="apis" options={STACK_OPTIONS.apis} />

         <section>
            <h3 className="text-2xl font-black mb-3 px-1 italic tracking-tighter brawl-button-outline uppercase">Architectural Notes</h3>
            <GameCard>
              <textarea 
                className="w-full h-32 resize-none outline-none bg-transparent dark:text-white"
                placeholder="Why this stack? Any specific constraints?"
                value={stack.notes}
                onChange={(e) => updateStack(ideaId!, { notes: e.target.value })}
              />
            </GameCard>
         </section>
      </div>

      <div className="mt-8 flex justify-end">
        <GameButton onClick={() => navigate(`/ideas/${ideaId}`)} size="lg">
          Finish Planning
        </GameButton>
      </div>
    </div>
  );
};