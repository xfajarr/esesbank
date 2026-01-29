import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Lightbulb, Trophy, Users, Menu, X, Rocket, Zap, Search, Moon, Sun, LogOut } from 'lucide-react';
import { GameButton } from '../ui/GameButton';
import { useStore } from '../../store';
import { gsap } from 'gsap';

export const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const user = useStore(state => state.user);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  
  // Hydrate data from Supabase on mount
  const fetchInitialData = useStore(state => state.fetchInitialData);
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Dark mode state
  const [isDark, setIsDark] = useState(() => {
    // Check local storage or preference
    if (typeof window !== 'undefined') {
       return localStorage.getItem('theme') === 'dark' || 
              (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/ideas', label: 'Idea Bank', icon: Lightbulb },
    { path: '/hackathons', label: 'Hackathons', icon: Trophy },
  ];

  useLayoutEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    });
    return () => ctx.revert();
  }, [location.pathname]);

  useLayoutEffect(() => {
    if (!sidebarRef.current) return;
    if (window.matchMedia('(min-width: 768px)').matches) return;

    const ctx = gsap.context(() => {
      if (mobileMenuOpen) {
        gsap.fromTo(
          sidebarRef.current,
          { xPercent: -100 },
          { xPercent: 0, duration: 0.35, ease: 'power2.out' }
        );

        if (navItemsRef.current) {
          gsap.fromTo(
            navItemsRef.current.children,
            { autoAlpha: 0, x: -10 },
            { autoAlpha: 1, x: 0, duration: 0.25, ease: 'power2.out', stagger: 0.05 }
          );
        }
      } else {
        gsap.to(sidebarRef.current, { xPercent: -100, duration: 0.25, ease: 'power2.in' });
      }
    });

    return () => ctx.revert();
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-brand-dark dark:text-white font-sans transition-colors duration-300">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-brand-navy border-b-4 border-brand-dark z-50 sticky top-0 shadow-brawl">
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 bg-brand-yellow rounded-xl border-3 border-brand-dark flex items-center justify-center shadow-sm">
             <Rocket size={20} className="text-brand-dark" />
           </div>
           <span className="font-black text-2xl tracking-tighter text-white brawl-button-outline">HackBank</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside ref={sidebarRef} className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-brand-navy border-r-4 border-brand-dark transform
        md:relative md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="hidden md:flex items-center gap-3 mb-12 px-2">
            <div className="w-12 h-12 bg-brand-yellow rounded-2xl border-2 border-brand-dark flex items-center justify-center hover:rotate-6 transition-all">
              <Rocket size={28} className="text-brand-dark" />
            </div>
            <span className="font-black text-3xl text-brand-dark dark:text-white italic uppercase">HackBank</span>
          </div>

          <div className="flex-1 space-y-4" ref={navItemsRef}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-5 py-4 rounded-2xl font-black uppercase tracking-wider border-3 transition-all
                    ${isActive 
                      ? 'bg-brand-blue text-white shadow-brawl translate-y-[-2px]' 
                      : 'bg-black/5 dark:bg-white/5 border-transparent text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 hover:text-brand-dark dark:hover:text-white hover:border-brand-dark/20'}
                  `}
                >
                  <item.icon size={24} strokeWidth={isActive ? 2 : 2} />
                  <span className={isActive ? '' : ''}>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="mt-auto space-y-6">
             {/* Dark Mode Toggle */}
             <div className="px-2">
                <button 
                  onClick={() => setIsDark(!isDark)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-brand-dark border-3 border-black text-sm font-black uppercase text-white hover:bg-black/40 transition-colors shadow-brawl active:translate-y-1 active:shadow-brawl-active"
                >
                  <span className="flex items-center gap-2 brawl-button-outline">
                    {isDark ? <Moon size={18} /> : <Sun size={18} />}
                    {isDark ? 'Dark' : 'Light'}
                  </span>
                  <div className={`w-10 h-5 rounded-full p-1 ${isDark ? 'bg-brand-purple' : 'bg-gray-600'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white transform transition-transform ${isDark ? 'translate-x-5' : ''}`}></div>
                  </div>
                </button>
             </div>

             <div className="pt-6 border-t-4 border-brand-dark">
                <div className="flex items-center gap-4 px-2">
                  {user ? (
                    <>
                      <div className="relative group">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-14 h-14 rounded-2xl border-4 border-brand-dark bg-brand-yellow shadow-sm group-hover:rotate-6 transition-transform"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl border-4 border-brand-dark bg-brand-yellow shadow-sm flex items-center justify-center font-black text-xl text-brand-dark">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-green rounded-lg border-2 border-brand-dark flex items-center justify-center">
                          <Zap size={12} className="text-brand-dark" />
                        </div>
                      </div>
                      <div>
                        <p className="font-black text-lg leading-tight text-brand-dark dark:text-white brawl-button-outline italic uppercase">{user.name}</p>
                        <p className="text-xs text-brand-blue font-black uppercase tracking-tighter">{user.role}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-2xl border-4 border-brand-dark bg-gray-200 dark:bg-gray-700 shadow-sm flex items-center justify-center font-black text-xl text-gray-500">
                        ?
                      </div>
                      <div>
                        <p className="font-black text-lg leading-tight text-brand-dark dark:text-white brawl-button-outline italic uppercase">Not signed in</p>
                        <p className="text-xs text-brand-blue font-black uppercase tracking-tighter">Sync disabled</p>
                      </div>
                    </>
                  )}
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-8 pt-6 pb-24 md:pb-8 scroll-smooth">
        <div ref={contentRef} key={location.pathname}>
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Bottom Bar Placeholder (optional, using sidebar toggle instead for now) */}
    </div>
  );
};
