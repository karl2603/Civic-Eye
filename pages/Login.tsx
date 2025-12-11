import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, User, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const { login, register } = useApp();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const role = 'CITIZEN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        const success = await login(email, password);
        if (!success) {
          setError('Invalid email or password.');
        }
      } else {
        if (!name || !email || !password) {
          setError('All fields are required.');
          setIsLoading(false);
          return;
        }
        await register(name, email, password, role);
      }
    } catch (err) {
      setError('Registration failed. Email might be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 relative">
        
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600"></div>

        {/* Header Section */}
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="inline-flex p-3 bg-slate-900 rounded-2xl mb-6 shadow-lg shadow-slate-900/20">
            <Shield className="text-blue-400 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">CivicEye</h1>
          <p className="text-slate-500 text-sm font-medium">
            {isLoginMode ? 'Welcome back, citizen.' : 'Join the movement for safer roads.'}
          </p>
        </div>

        {/* Auth Toggle */}
        <div className="px-8 mb-6">
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => { setIsLoginMode(true); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                isLoginMode
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLoginMode(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                !isLoginMode
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Sign Up Fields */}
            {!isLoginMode && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                        Full Name
                    </label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium placeholder-slate-400 transition-all"
                        required={!isLoginMode}
                        />
                    </div>
                </div>
              </div>
            )}

            {/* Common Fields */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium placeholder-slate-400 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium placeholder-slate-400 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 mt-4 ${isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                 <>
                   {isLoginMode ? 'Sign In' : 'Create Account'}
                   <ArrowRight size={18} />
                 </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
            By accessing CivicEye, you agree to abide by the national traffic reporting guidelines and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;