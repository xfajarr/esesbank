import React, { useState } from 'react';
import { useStore } from '../store';
import { GameCard, GameButton, Badge } from '../components/ui';
import { Gift, Link2, Plus, X, Pencil, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { HackathonStatus } from '../types';
import toast from 'react-hot-toast';

export const Hackathons: React.FC = () => {
  const { hackathons, ideas, linkIdeaToHackathon, addHackathon, updateHackathon, deleteHackathon } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    name: '',
    theme: '',
    prizes: '',
    deadline: '',
    status: 'Planned' as HackathonStatus
  });

  const handleLink = (hackathonId: string) => {
    setSelectedHackathonId(hackathonId);
    setShowLinkModal(true);
  };

  const handleSelectIdea = (ideaId: string) => {
    if (selectedHackathonId) {
      linkIdeaToHackathon(selectedHackathonId, ideaId);
      setShowLinkModal(false);
      setSelectedHackathonId(null);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setFormState({ name: '', theme: '', prizes: '', deadline: '', status: 'Planned' });
    setShowModal(true);
  };

  const openEdit = (hackathon: typeof hackathons[number]) => {
    setEditingId(hackathon.id);
    const dateValue = hackathon.deadline ? new Date(hackathon.deadline).toISOString().slice(0, 10) : '';
    setFormState({
      name: hackathon.name,
      theme: hackathon.theme ?? '',
      prizes: hackathon.prizes ?? '',
      deadline: dateValue,
      status: hackathon.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) return;

    const deadlineIso = formState.deadline ? new Date(formState.deadline).toISOString() : undefined;

    if (editingId) {
      await updateHackathon(editingId, {
        name: formState.name,
        theme: formState.theme,
        prizes: formState.prizes,
        deadline: deadlineIso,
        status: formState.status
      });
    } else {
      await addHackathon({
        name: formState.name,
        theme: formState.theme,
        prizes: formState.prizes,
        deadline: deadlineIso,
        status: formState.status
      });
    }

    setShowModal(false);
    setEditingId(null);
    setFormState({ name: '', theme: '', prizes: '', deadline: '', status: 'Planned' });
  };

  // Get available ideas for linking (exclude already linked to this hackathon)
  const getAvailableIdeas = () => {
    if (!selectedHackathonId) return [];
    const hackathon = hackathons.find(h => h.id === selectedHackathonId);
    const linkedIds = hackathon?.linkedIdeaIds || [];
    return ideas.filter(idea => !linkedIds.includes(idea.id));
  };

  const availableIdeas = getAvailableIdeas();

  const showDeleteToast = (label: string, onConfirm: () => void) => {
    toast.custom((t) => (
      <div className="pointer-events-auto w-[320px] rounded-2xl border-2 border-brand-dark bg-white dark:bg-gray-900 p-4 shadow-brawl">
        <p className="font-bold text-brand-dark dark:text-white mb-3">Delete "{label}"?</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Linked ideas will be unassigned.</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-brand-dark hover:border-brand-dark transition-colors text-sm font-bold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="px-3 py-2 rounded-lg border-2 border-brand-red bg-brand-red text-white hover:brightness-95 transition-colors text-sm font-bold"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 8000, position: 'top-center' });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
         <div>
            <h1 className="text-5xl font-black text-brand-dark dark:text-white italic">HACKATHONS</h1>
            <p className="text-brand-blue dark:text-brand-green font-black uppercase text-sm tracking-widest mt-1">Events we are crushing.</p>
         </div>
         <GameButton size="lg" onClick={openCreate} className="hover:scale-105 transition-transform">
            <Plus size={28} strokeWidth={4} />
            Add Event
         </GameButton>
      </div>

      <motion.div layout className="space-y-6">
        <AnimatePresence>
          {hackathons.map(hackathon => (
            <motion.div
              key={hackathon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <GameCard className="flex flex-col md:flex-row gap-6">
                
                {/* Date Box */}
                <div className="hidden md:flex flex-col items-center justify-center p-4 bg-brand-yellow rounded-2xl border-4 border-brand-dark w-24 text-center shadow-brawl">
                   <span className="text-[10px] font-black uppercase text-brand-dark/60 tracking-tighter">Deadline</span>
                   <span className="text-4xl font-black text-brand-dark italic -my-1">
                     {new Date(hackathon.deadline).getDate()}
                   </span>
                   <span className="text-xs font-black text-brand-dark uppercase">
                     {new Date(hackathon.deadline).toLocaleString('default', { month: 'short' })}
                   </span>
                </div>

                <div className="flex-1 space-y-3">
                   <div className="flex items-start justify-between gap-4">
                      <h2 className="text-2xl font-black dark:text-white">{hackathon.name}</h2>
                      <div className="flex items-center gap-2">
                        <Badge 
                          label={hackathon.status} 
                          color={hackathon.status === 'Active' ? 'green' : 'yellow'} 
                        />
                        <button
                          type="button"
                          onClick={() => openEdit(hackathon)}
                          className="p-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-brand-blue hover:border-brand-blue transition-colors"
                          aria-label="Edit hackathon"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            showDeleteToast(hackathon.name, () => deleteHackathon(hackathon.id));
                          }}
                          className="p-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-brand-red hover:border-brand-red transition-colors"
                          aria-label="Delete hackathon"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                   </div>
                   
                   <p className="text-gray-600 dark:text-gray-300 font-medium">
                     <span className="text-brand-purple font-bold">Theme:</span> {hackathon.theme}
                   </p>
                   
                   {hackathon.prizes && (
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border-2 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 text-sm font-bold">
                       <Gift size={16} /> {hackathon.prizes}
                     </div>
                   )}

                   <div className="pt-4 mt-2 border-t-2 border-gray-100 dark:border-gray-700">
                     <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Linked Ideas</h4>
                     <div className="flex flex-wrap gap-2">
                       {(hackathon.linkedIdeaIds || []).map(id => {
                         const idea = ideas.find(i => i.id === id);
                         return idea ? (
                           <div key={id} className="px-3 py-1 rounded-lg bg-white dark:bg-gray-800 border-2 border-brand-dark dark:border-gray-500 shadow-game-sm dark:shadow-none text-sm font-bold dark:text-white">
                             {idea.title}
                           </div>
                         ) : null;
                       })}
                       <button 
                         onClick={() => handleLink(hackathon.id)}
                         className="px-3 py-1 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1 text-sm font-bold">
                         <Link2 size={14} /> Link Idea
                       </button>
                     </div>
                   </div>
                </div>
              </GameCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Create Hackathon Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => {
              setShowModal(false);
              setEditingId(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <GameCard className="w-full">
                <h2 className="text-2xl font-black mb-4 dark:text-white">
                  {editingId ? 'Edit Hackathon' : 'New Hackathon'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Event Name</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-brand-dark focus:outline-none font-bold"
                        placeholder="e.g., Global AI Hack"
                        value={formState.name}
                        onChange={e => setFormState({ ...formState, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Theme</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-brand-dark focus:outline-none font-bold"
                        placeholder="e.g., DeFi, AI, Green"
                        value={formState.theme}
                        onChange={e => setFormState({ ...formState, theme: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Deadline</label>
                        <input 
                          type="date" 
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-brand-dark focus:outline-none font-bold"
                          value={formState.deadline}
                          onChange={e => setFormState({ ...formState, deadline: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Prizes</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-brand-dark focus:outline-none font-bold"
                          placeholder="$10k"
                          value={formState.prizes}
                          onChange={e => setFormState({ ...formState, prizes: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Status</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-brand-dark focus:outline-none font-bold"
                        value={formState.status}
                        onChange={e => setFormState({ ...formState, status: e.target.value as HackathonStatus })}
                      >
                        <option value="Planned">Planned</option>
                        <option value="Active">Active</option>
                        <option value="Submitted">Submitted</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <GameButton type="button" variant="ghost" onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                    }}>Cancel</GameButton>
                    <GameButton type="submit">{editingId ? 'Save Changes' : 'Add Event'}</GameButton>
                  </div>
                </form>
              </GameCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Link Idea Modal */}
      <AnimatePresence>
        {showLinkModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => {
              setShowLinkModal(false);
              setSelectedHackathonId(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <GameCard className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black dark:text-white">Link an Idea</h2>
                  <button 
                    onClick={() => {
                      setShowLinkModal(false);
                      setSelectedHackathonId(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {availableIdeas.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 font-medium">No available ideas to link.</p>
                    <p className="text-sm text-gray-500 mt-2">All ideas are already linked or create a new idea first.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableIdeas.map(idea => (
                      <motion.button
                        key={idea.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectIdea(idea.id)}
                        className="text-left p-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-brand-blue dark:hover:border-brand-blue transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-black text-brand-dark dark:text-white text-lg">{idea.title}</h3>
                          <Badge label={idea.status} color="blue" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 font-medium">
                          {idea.description}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-400">Level {idea.level}</span>
                          <span className="text-xs font-bold text-gray-400">•</span>
                          <span className="text-xs font-bold text-gray-400">{idea.progress}% Complete</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </GameCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
