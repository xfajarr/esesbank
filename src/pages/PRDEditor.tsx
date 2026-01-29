import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { GameCard } from '../components/ui';
import { ArrowLeft } from 'lucide-react';

export const PRDEditor: React.FC = () => {
  const { ideaId } = useParams<{ ideaId: string }>();
  const navigate = useNavigate();
  const { getPRD, updatePRD, getIdea } = useStore();
  
  const idea = getIdea(ideaId!);
  const prd = getPRD(ideaId!) || {
    ideaId: ideaId!,
    overview: '', goals: '', nonGoals: '',
    userStories: [], mvpScope: [], successMetrics: [],
    risks: [], openQuestions: []
  };

  const handleUpdate = (field: string, value: any) => {
    updatePRD(ideaId!, { [field]: value });
  };

  const handleArrayUpdate = (field: string, index: number, value: string) => {
    const list = [...(prd as any)[field]];
    list[index] = value;
    handleUpdate(field, list);
  };

  const addArrayItem = (field: string) => {
    const list = [...(prd as any)[field], ''];
    handleUpdate(field, list);
  };

  if (!idea) return <div>Idea not found</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => navigate(`/ideas/${ideaId}`)} 
          className="p-3 rounded-2xl bg-brand-navy border-3 border-brand-dark text-white hover:bg-brand-dark transition-all active:translate-y-1 shadow-brawl active:shadow-brawl-active"
        >
          <ArrowLeft size={24} strokeWidth={4} />
        </button>
        <div className="flex-1">
           <h1 className="text-4xl font-black dark:text-white italic tracking-tighter brawl-button-outline uppercase">MISSION DIRECTIVE</h1>
           <p className="text-brand-blue dark:text-brand-green font-black uppercase text-xs tracking-widest mt-1">Refining {idea.title} PRD.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Overview Section */}
        <section>
          <div className="flex items-center justify-between mb-2 px-1">
             <h3 className="text-2xl font-black italic tracking-tighter brawl-button-outline uppercase">Overview</h3>
          </div>
          <GameCard>
            <textarea 
              className="w-full h-32 resize-none outline-none text-gray-700 dark:text-white bg-transparent font-medium"
              placeholder="High level summary..."
              value={prd.overview}
              onChange={(e) => handleUpdate('overview', e.target.value)}
            />
          </GameCard>
        </section>

        {/* Goals & Non-Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <section>
              <h3 className="text-2xl font-black mb-2 px-1 italic tracking-tighter brawl-button-outline uppercase">Goals</h3>
              <GameCard>
                <textarea 
                  className="w-full h-32 resize-none outline-none text-gray-700 dark:text-white bg-transparent font-medium"
                  placeholder="What are we trying to achieve?"
                  value={prd.goals}
                  onChange={(e) => handleUpdate('goals', e.target.value)}
                />
              </GameCard>
           </section>
           <section>
              <h3 className="text-2xl font-black mb-2 px-1 italic tracking-tighter brawl-button-outline uppercase text-gray-500">Non-Goals</h3>
              <GameCard className="bg-gray-50 dark:bg-gray-800">
                <textarea 
                  className="w-full h-32 resize-none outline-none bg-transparent text-gray-600 dark:text-gray-400 font-medium"
                  placeholder="What are we NOT doing?"
                  value={prd.nonGoals}
                  onChange={(e) => handleUpdate('nonGoals', e.target.value)}
                />
              </GameCard>
           </section>
        </div>

        {/* User Stories List */}
        <section>
           <div className="flex items-center justify-between mb-2 px-1">
             <h3 className="text-2xl font-black italic tracking-tighter brawl-button-outline uppercase">User Stories</h3>
             <button onClick={() => addArrayItem('userStories')} className="text-brand-blue font-bold text-sm">+ Add Story</button>
           </div>
           <div className="space-y-3">
             {prd.userStories.map((story, idx) => (
               <div key={idx} className="flex gap-2">
                 <input 
                   className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white font-medium focus:border-brand-blue outline-none"
                   value={story}
                   onChange={(e) => handleArrayUpdate('userStories', idx, e.target.value)}
                   placeholder="As a user, I want to..."
                 />
               </div>
             ))}
             {prd.userStories.length === 0 && <div className="text-gray-400 italic pl-2">No user stories yet.</div>}
           </div>
        </section>

        {/* MVP Scope List */}
        <section>
           <div className="flex items-center justify-between mb-2 px-1">
             <h3 className="text-2xl font-black italic tracking-tighter brawl-button-outline uppercase">MVP Scope</h3>
             <button onClick={() => addArrayItem('mvpScope')} className="text-brand-green font-bold text-sm">+ Add Feature</button>
           </div>
           <div className="flex flex-wrap gap-2">
             {prd.mvpScope.map((item, idx) => (
               <input 
                 key={idx}
                 className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white font-medium focus:border-brand-green outline-none"
                 value={item}
                 onChange={(e) => handleArrayUpdate('mvpScope', idx, e.target.value)}
                 placeholder="Feature..."
               />
             ))}
           </div>
        </section>
      </div>
    </div>
  );
};
