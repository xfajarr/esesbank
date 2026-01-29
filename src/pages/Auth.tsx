import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { GameCard, GameButton } from '../components/ui';
import { Rocket, Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithEthereum, signInWithSolana } = useStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-blue via-brand-purple to-brand-pink">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-brand-yellow rounded-3xl border-4 border-brand-dark shadow-brawl flex items-center justify-center mb-4">
            <Rocket size={40} className="text-brand-dark" />
          </div>
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tight">
            HackBank
          </h1>
          <p className="text-white/80 font-bold text-sm uppercase tracking-widest mt-2">
            Vault of Brilliance
          </p>
        </div>

        <GameCard className="w-full">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-3 rounded-lg font-black uppercase text-sm transition-all ${
                mode === 'signin'
                  ? 'bg-brand-blue text-white shadow-brawl'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 rounded-lg font-black uppercase text-sm transition-all ${
                mode === 'signup'
                  ? 'bg-brand-blue text-white shadow-brawl'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-brand-blue focus:outline-none font-bold"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-brand-blue focus:outline-none font-bold"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-brand-blue focus:outline-none font-bold"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-sm font-bold">{error}</p>
              </div>
            )}

            <GameButton
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </GameButton>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-sm font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 uppercase tracking-wider">
                Or connect wallet
              </span>
            </div>
          </div>

          {/* Web3 Wallet Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={async () => {
                setError('');
                setLoading(true);
                try {
                  await signInWithEthereum();
                  navigate('/');
                } catch (err: any) {
                  setError(err.message || 'Ethereum connection failed');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-brand-blue dark:hover:border-brand-blue bg-white dark:bg-gray-800 transition-all disabled:opacity-50"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
              <span className="font-bold text-gray-700 dark:text-white">Sign in with Ethereum</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                setError('');
                setLoading(true);
                try {
                  await signInWithSolana();
                  navigate('/');
                } catch (err: any) {
                  setError(err.message || 'Solana connection failed');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-brand-purple dark:hover:border-brand-purple bg-white dark:bg-gray-800 transition-all disabled:opacity-50"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500"></div>
              <span className="font-bold text-gray-700 dark:text-white">Sign in with Solana</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-brand-blue font-bold hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </GameCard>
      </motion.div>
    </div>
  );
};
