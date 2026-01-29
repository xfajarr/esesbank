import React from 'react';
import { useStore } from '../store';
import { GameCard, GameButton, ProgressBar, Badge } from '../components/ui';
import { Plus, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { ideas, hackathons, activities } = useStore();
  const navigate = useNavigate();

  const featuredIdeas = [...ideas]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  const upcomingHackathon = hackathons.find(h => h.status === 'Active' || h.status === 'Planned');

  const getTimeLeft = (dateStr: string) => {
    const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days left` : 'Ended';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-brand-dark dark:text-white mb-2 uppercase italic">
            DASHBOARD
          </h1>
          <p className="text-brand-blue dark:text-brand-green font-black uppercase text-sm tracking-widest">
            Welcome back, Brawler! Let's build something epic.
          </p>
        </div>
        <GameButton size="lg" onClick={() => navigate('/ideas')} className="hover:scale-105 transition-transform">
          <Plus size={28} strokeWidth={4} />
          New Idea
        </GameButton>
      </div>

      {/* Stats / Hackathon Banner */}
      {upcomingHackathon && (
        <GameCard color="purple" className="flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden group">
          <div className="flex-1 relative z-10">
             <div className="flex items-center gap-3 mb-3">
                <Badge label="Active Event" color="yellow" />
                <span className="text-white/80 font-black uppercase text-xs flex items-center gap-1 tracking-tighter italic">
                  <Clock size={16} strokeWidth={3} /> {getTimeLeft(upcomingHackathon.deadline)}
                </span>
             </div>
             <h2 className="text-4xl font-black mb-3 brawl-button-outline italic uppercase tracking-tighter">{upcomingHackathon.name}</h2>
             <p className="text-white/90 font-bold max-w-xl text-lg">
                <span className="text-brand-yellow">THEME:</span> {upcomingHackathon.theme} <br/>
                <span className="text-brand-green">PRIZE:</span> {upcomingHackathon.prizes}
             </p>
          </div>
          <GameButton variant="primary" onClick={() => navigate('/hackathons')} size="lg" className="relative z-10">
            JOIN NOW!
          </GameButton>
          
          {/* Animated background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500"></div>
        </GameCard>
      )}

      {/* Featured Ideas Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black flex items-center gap-2 dark:text-white">
            <TrendingUp className="text-brand-yellow" strokeWidth={3} /> 
            Top Progress
          </h2>
          <button 
            onClick={() => navigate('/ideas')} 
            className="text-brand-blue dark:text-brand-green font-bold hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredIdeas.map(idea => (
            <GameCard key={idea.id} hoverEffect onClick={() => navigate(`/ideas/${idea.id}`)} className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                 <div className="w-10 h-10 rounded-full bg-brand-yellow border-2 border-brand-dark dark:border-gray-800 flex items-center justify-center font-black text-lg text-brand-dark">
                   {idea.level}
                 </div>
                 <Badge 
                    label={idea.status} 
                    color={idea.status === 'Building' ? 'green' : idea.status === 'Submitted' ? 'purple' : 'blue'} 
                 />
              </div>
              <h3 className="text-xl font-bold mb-2 line-clamp-1 dark:text-white">{idea.title}</h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-1">{idea.description}</p>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                  <span>Progress</span>
                  <span>{idea.progress}%</span>
                </div>
                <ProgressBar progress={idea.progress} />
              </div>
            </GameCard>
          ))}
          {featuredIdeas.length === 0 && (
             <div className="col-span-3 text-center py-10 text-gray-400 font-bold border-2 border-dashed border-gray-300 rounded-xl">
                No ideas yet. Start one!
             </div>
          )}
        </div>
      </section>

      {/* Activity Feed */}
      <section>
        <h2 className="text-2xl font-black mb-4 dark:text-white">Recent Activity</h2>
        <div className="space-y-3">
          {activities.slice(0, 5).map(activity => (
            <div key={activity.id} className="bg-white dark:bg-brand-dark-surface border-2 border-gray-100 dark:border-gray-700 p-3 rounded-xl flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-brand-blue"></div>
               <p className="text-sm dark:text-gray-300">
                 <span className="font-bold dark:text-white">{activity.userName}</span> {activity.action} <span className="font-bold text-brand-blue">{activity.target}</span>
               </p>
               <span className="ml-auto text-xs text-gray-400">
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};