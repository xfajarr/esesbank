import React, { useState } from 'react';
import { useStore } from '../store';
import { GameCard, GameButton, ProgressBar, Badge } from '../components/ui';
import { Search, Filter, Plus, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IdeaStatus } from '../types';

export const Ideas: React.FC = () => {
  const navigate = useNavigate();
  const { ideas, addIdea } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<IdeaStatus | 'All'>('All');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || idea.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    addIdea({
      title: newTitle,
      description: 'New idea waiting for details...'
    });
    setNewTitle('');
    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
           <h1 className="text-5xl font-black text-brand-dark dark:text-white italic">IDEA BANK</h1>
           <p className="text-brand-blue dark:text-brand-green font-black uppercase text-sm tracking-widest mt-1">Vault of brilliance.</p>
        </div>
        <GameButton size="lg" onClick={() => setShowModal(true)} className="hover:scale-105 transition-transform">
          <Plus size={28} strokeWidth={4} />
          Create Idea
        </GameButton>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark" size={24} strokeWidth={3} />
          <input 
            type="text" 
            placeholder="SEARCH IDEAS..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-4 border-brand-dark dark:bg-brand-navy dark:text-white focus:ring-4 focus:ring-brand-yellow/30 font-black uppercase placeholder:text-gray-400 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {(['All', 'Draft', 'Exploring', 'Building', 'Submitted'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`
                px-5 py-3 rounded-2xl border-3 font-black uppercase tracking-tighter transition-all active:translate-y-1
                ${filterStatus === status 
                  ? 'bg-brand-yellow text-brand-dark border-brand-dark shadow-brawl active:shadow-brawl-active' 
                  : 'bg-black/5 dark:bg-white/10 text-gray-500 dark:text-gray-400 border-transparent hover:bg-black/10 dark:hover:bg-white/20 hover:text-brand-dark dark:hover:text-white'}
              `}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {filteredIdeas.map(idea => (
          <GameCard 
            key={idea.id} 
            hoverEffect 
            onClick={() => navigate(`/ideas/${idea.id}`)}
            className="flex flex-col h-64"
          >
            <div className="flex justify-between items-start mb-2">
               <Badge 
                  label={idea.status} 
                  color={idea.status === 'Draft' ? 'gray' : idea.status === 'Building' ? 'green' : 'blue'} 
               />
               <span className="text-xs font-bold text-gray-400">Lvl {idea.level}</span>
            </div>
            
            <h3 className="text-2xl font-black mb-2 line-clamp-2 dark:text-white">{idea.title}</h3>
            <p className="text-gray-500 dark:text-gray-300 font-medium text-sm line-clamp-3 mb-auto">
              {idea.description}
            </p>

            <div className="mt-4 pt-4 border-t-2 border-gray-100 dark:border-gray-700">
               <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase mb-1">
                 <span className="flex items-center gap-1"><Zap size={12} /> XP</span>
                 <span>{idea.progress}%</span>
               </div>
               <ProgressBar progress={idea.progress} height="h-2" />
            </div>
          </GameCard>
        ))}
        
        {/* Empty State Add Button */}
        <button 
          onClick={() => setShowModal(true)}
          className="h-64 rounded-2xl border-4 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:text-brand-blue hover:border-brand-blue hover:bg-blue-50 dark:hover:bg-gray-800 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
            <Plus size={32} strokeWidth={4} />
          </div>
          <span className="font-bold text-lg">Add New Idea</span>
        </button>
      </div>

      {/* Simple Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <GameCard className="w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black mb-4 dark:text-white">Start something new</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Idea Name</label>
                <input 
                  autoFocus
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border-2 border-brand-dark dark:border-gray-500 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-brand-yellow/30 focus:outline-none font-bold text-lg"
                  placeholder="e.g., Uber for Cats"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <GameButton type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</GameButton>
                <GameButton type="submit">Create Idea</GameButton>
              </div>
            </form>
          </GameCard>
        </div>
      )}
    </div>
  );
};
