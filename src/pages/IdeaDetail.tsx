import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { GameCard, GameButton, Badge, ProgressBar } from '../components/ui';
import { ArrowLeft, FileText, Layers, Trophy, Edit3, Check, Trash2, CheckCircle, Circle, Plus, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export const IdeaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getIdea, updateIdea, deleteIdea, addTask, toggleTask, deleteTask, addComment } = useStore();
  const user = useStore(state => state.user);
  const [isEditing, setIsEditing] = React.useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  const idea = getIdea(id!);

  const [formState, setFormState] = React.useState(idea);

  // Sync form state if idea updates externally
  React.useEffect(() => {
    if (idea) setFormState(idea);
  }, [idea]);

  if (!idea || !formState) return <div className="p-10 text-center font-bold">Idea not found 😢</div>;

  const handleSave = () => {
    updateIdea(idea.id, {
      title: formState.title,
      description: formState.description,
      sections: formState.sections
    });
    setIsEditing(false);
  };

  const handleChangeSection = (key: keyof typeof idea.sections, value: string) => {
    setFormState({
      ...formState,
      sections: { ...formState.sections, [key]: value }
    });
  };

  const handleDelete = () => {
    toast.custom((t) => (
      <div className="pointer-events-auto w-[320px] rounded-2xl border-2 border-brand-dark bg-white dark:bg-gray-900 p-4 shadow-brawl">
        <p className="font-bold text-brand-dark dark:text-white mb-3">Delete "{idea.title}"?</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">This action cannot be undone.</p>
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
              deleteIdea(idea.id);
              navigate('/ideas');
            }}
            className="px-3 py-2 rounded-lg border-2 border-brand-red bg-brand-red text-white hover:brightness-95 transition-colors text-sm font-bold"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 8000, position: 'top-center' });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask(idea.id, newTaskText);
    setNewTaskText('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(idea.id, newCommentText);
    setNewCommentText('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button onClick={() => navigate('/ideas')} className="flex items-center gap-2 font-black text-brand-blue uppercase tracking-widest text-xs mb-8 hover:text-brand-dark transition-colors group active:translate-y-1">
        <ArrowLeft size={20} strokeWidth={4} className="group-hover:-translate-x-1 transition-transform" />
        <span className="brawl-button-outline">Back to Bank</span>
      </button>

      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        <div className="flex-1">
           <div className="flex items-center gap-3 mb-3">
             <Badge label={idea.status} color="blue" />
             <span className="text-gray-400 font-bold text-sm">Level {idea.level} Idea</span>
           </div>
           
           {isEditing ? (
             <input 
               className="text-5xl font-black w-full bg-brand-navy/10 dark:bg-white/10 p-4 rounded-2xl border-4 border-brand-dark dark:text-white focus:outline-none mb-4 italic uppercase tracking-tighter"
               value={formState.title}
               onChange={(e) => setFormState({...formState, title: e.target.value})}
             />
           ) : (
             <h1 className="text-5xl font-black text-brand-dark dark:text-white mb-2 italic tracking-tighter brawl-button-outline uppercase">{idea.title}</h1>
           )}

           {isEditing ? (
             <textarea 
               className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-2 font-medium dark:text-white"
               value={formState.description}
               onChange={(e) => setFormState({...formState, description: e.target.value})}
             />
           ) : (
             <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">{idea.description}</p>
           )}
        </div>

        <div className="flex flex-wrap gap-3 items-start">
          {isEditing ? (
            <GameButton onClick={handleSave} color="green">
              <Check size={18} /> Save Changes
            </GameButton>
          ) : (
          <GameButton variant="secondary" onClick={() => setIsEditing(true)}>
            <Edit3 size={18} /> EDIT IDEA
          </GameButton>
          )}
          
          <GameButton variant="danger" size="sm" onClick={handleDelete} className="lg:hidden">
             <Trash2 size={18} />
          </GameButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: The 4 Quadrants */}
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(formState.sections).map(([key, value]) => (
                <GameCard key={key} className="flex flex-col">
                  <h3 className="uppercase text-xs font-black text-gray-400 mb-2 tracking-wider">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  {isEditing ? (
                    <textarea 
                      className="w-full h-32 p-2 border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg resize-none focus:border-brand-blue focus:outline-none text-sm font-medium"
                      value={value}
                      placeholder={`Describe the ${key}...`}
                      onChange={(e) => handleChangeSection(key as any, e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 font-medium whitespace-pre-wrap">
                      {value || <span className="text-gray-300 italic">No details yet...</span>}
                    </p>
                  )}
                </GameCard>
              ))}
           </div>

           {/* Tasks Section */}
           <div>
             <h2 className="text-3xl font-black mb-6 dark:text-white italic tracking-tighter brawl-button-outline uppercase">QUEST LOG</h2>
             <GameCard className="space-y-4">
                <form onSubmit={handleAddTask} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add a new task..." 
                    className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-brand-blue outline-none font-medium"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                  />
                  <GameButton type="submit" size="sm">
                    <Plus size={18} /> Add
                  </GameButton>
                </form>
                
                <div className="space-y-2">
                   {idea.tasks.length === 0 && <p className="text-center text-gray-400 text-sm italic py-4">No active quests.</p>}
                   {idea.tasks.map(task => (
                     <div key={task.id} className="group flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                        <button 
                          onClick={() => toggleTask(idea.id, task.id)}
                          className={`flex-shrink-0 transition-colors ${task.completed ? 'text-brand-green' : 'text-gray-300 hover:text-brand-blue'}`}
                        >
                          {task.completed ? <CheckCircle size={24} fill="currentColor" className="text-white dark:text-brand-green" /> : <Circle size={24} strokeWidth={3} />}
                        </button>
                        <span className={`flex-1 font-bold ${task.completed ? 'text-gray-500 dark:text-gray-400 line-through decoration-2 decoration-brand-green/30' : 'text-brand-dark dark:text-gray-200'}`}>
                          {task.text}
                        </span>
                        <button 
                          onClick={() => deleteTask(idea.id, task.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-brand-red transition-opacity p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                     </div>
                   ))}
                </div>
             </GameCard>
           </div>

           {/* Comments Section */}
           <div>
             <h2 className="text-3xl font-black mb-6 dark:text-white flex items-center gap-3 italic tracking-tighter brawl-button-outline uppercase">
               <MessageSquare size={28} strokeWidth={4} /> TEAM CHAT
             </h2>
             <div className="space-y-4">
                {idea.comments.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {idea.comments.map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-yellow border-2 border-brand-dark dark:border-gray-600 flex items-center justify-center font-bold">
                          {comment.userName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-black text-brand-dark dark:text-white">{comment.userName}</span>
                            <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl border-2 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm">
                            {comment.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <form onSubmit={handleAddComment} className="flex gap-2 items-start">
                   <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-transparent flex-shrink-0"></div>
                   <div className="flex-1 flex gap-2">
                     <textarea
                        className={`flex-1 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-brand-purple outline-none font-medium resize-none h-[50px] min-h-[50px] ${user ? '' : 'opacity-60 cursor-not-allowed'}`}
                        placeholder={user ? 'Write a comment...' : 'Sign in to comment'}
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        disabled={!user}
                     />
                     <GameButton type="submit" size="sm" className="h-[50px] w-[50px] !px-0 flex items-center justify-center" disabled={!user}>
                       <Send size={20} />
                     </GameButton>
                   </div>
                </form>
             </div>
           </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
           <GameCard>
              <h3 className="font-black text-2xl mb-4 italic tracking-tighter brawl-button-outline uppercase">Progress</h3>
              <div className="mb-2 flex justify-between text-sm font-bold text-gray-500 dark:text-gray-400 font-mono">
                <span>Completion</span>
                <span>{idea.progress}%</span>
              </div>
              <ProgressBar progress={idea.progress} />
           </GameCard>

           <div className="space-y-3">
             <h3 className="font-black text-lg px-1 dark:text-white">Power Ups</h3>
             <GameButton fullWidth variant="secondary" onClick={() => navigate(`/prds/${idea.id}`)}>
               <FileText size={20} className="text-brand-white" /> 
               Open PRD Editor  
             </GameButton>
             <GameButton fullWidth variant="secondary" onClick={() => navigate(`/stack/${idea.id}`)}>
               <Layers size={20} className="text-brand-white" /> 
               Tech Stack Planner
             </GameButton>
             <GameButton fullWidth variant="secondary" onClick={() => navigate(`/hackathons`)}>
               <Trophy size={20} className="text-brand-white" /> 
               Link to Hackathon
             </GameButton>
           </div>
        </div>
      </div>
    </div>
  );
};
