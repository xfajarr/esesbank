import React from 'react';
import { useStore } from '../store';
import { GameCard } from '../components/ui';
import { Crown, Code, Paintbrush, Terminal } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const Team: React.FC = () => {
  const { members } = useStore();

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'Lead': return <Crown size={16} className="text-yellow-500" />;
      case 'Frontend': return <Code size={16} className="text-blue-500" />;
      case 'Backend': return <Terminal size={16} className="text-green-500" />;
      case 'Design': return <Paintbrush size={16} className="text-purple-500" />;
      default: return <Code size={16} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
         <div>
            <h1 className="text-5xl font-black text-brand-dark dark:text-white italic tracking-tighter brawl-button-outline uppercase">THE SQUAD</h1>
            <p className="text-brand-blue dark:text-brand-green font-black uppercase text-sm tracking-widest mt-1">Dream team roster.</p>
         </div>
         <div className="text-xs font-black uppercase tracking-widest text-gray-400">
            Synced from Supabase profiles
         </div>
      </div>

      {members.length === 0 && (
        <GameCard className="mb-8 text-center">
          <p className="font-bold text-gray-500 dark:text-gray-300">
            No team profiles found yet. Create accounts to populate your squad.
          </p>
        </GameCard>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {members.map(member => (
            <motion.div
               key={member.id}
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               layout
            >
              <GameCard className="flex flex-col items-center text-center pt-8 h-full">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-brand-yellow rounded-3xl rotate-6 group-hover:rotate-12 transition-transform"></div>
                  {member.avatarUrl ? (
                    <img 
                      src={member.avatarUrl} 
                      alt={member.name} 
                      className="relative w-28 h-28 rounded-3xl border-4 border-brand-dark bg-white shadow-sm"
                    />
                  ) : (
                    <div className="relative w-28 h-28 rounded-3xl border-4 border-brand-dark bg-white shadow-sm flex items-center justify-center font-black text-4xl text-brand-dark">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-brand-navy p-2 rounded-xl border-3 border-brand-dark shadow-brawl">
                    {getRoleIcon(member.role)}
                  </div>
                </div>
                
                <h3 className="text-2xl font-black mb-1 dark:text-white brawl-button-outline italic tracking-tighter uppercase">{member.name}</h3>
                <span className="px-4 py-1 rounded-xl bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest mb-6 border-2 border-brand-dark shadow-sm">
                  {member.role}
                </span>

                <div className="w-full mt-auto pt-4 border-t-2 border-gray-100 dark:border-gray-700 flex justify-around">
                  <div className="text-center">
                    <div className="text-lg font-black text-brand-blue">0</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Commits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-brand-green">0</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Ideas</div>
                  </div>
                </div>
              </GameCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
