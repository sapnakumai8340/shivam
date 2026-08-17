import React from 'react';
import { Home, Rss, Bot, User, Calendar, BarChart2, Activity, CreditCard } from 'lucide-react';
import { ActiveScreen, UserRole } from '../types';

interface BottomNavProps {
  role: UserRole;
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ role, activeScreen, onSelectScreen }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c1015]/95 backdrop-blur-lg border-t border-slate-800/90 py-2 px-3 sm:px-6">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Home Tab */}
        <button
          onClick={() => onSelectScreen('home')}
          className={`flex flex-col items-center gap-1 transition-all duration-200 py-1 px-2.5 rounded-xl ${
            activeScreen === 'home'
              ? 'text-[#ff5500] font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${activeScreen === 'home' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            {activeScreen === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff5500] rounded-full shadow-[0_0_8px_#ff5500]" />
            )}
          </div>
          <span className="text-[10px] tracking-wide">Home</span>
        </button>

        {role === 'player' ? (
          <>
            <button
              onClick={() => onSelectScreen('performance')}
              className={`flex flex-col items-center gap-1 transition-all duration-200 py-1 px-2.5 rounded-xl ${
                activeScreen === 'performance' ? 'text-[#ff5500] font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Activity className={`w-5 h-5 ${activeScreen === 'performance' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {activeScreen === 'performance' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff5500] rounded-full shadow-[0_0_8px_#ff5500]" />}
              </div>
              <span className="text-[10px] tracking-wide">Analytics</span>
            </button>
            <button
              onClick={() => onSelectScreen('feed')}
              className={`flex flex-col items-center gap-1 transition-all duration-200 py-1 px-2.5 rounded-xl ${
                activeScreen === 'feed' ? 'text-[#ff5500] font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Rss className={`w-5 h-5 ${activeScreen === 'feed' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {activeScreen === 'feed' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff5500] rounded-full shadow-[0_0_8px_#ff5500]" />}
              </div>
              <span className="text-[10px] tracking-wide">Feed</span>
            </button>
            <button
              onClick={() => onSelectScreen('profile')}
              className={`flex flex-col items-center gap-1 transition-all duration-200 py-1 px-2.5 rounded-xl ${
                activeScreen === 'profile' ? 'text-[#ff5500] font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <User className={`w-5 h-5 ${activeScreen === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {activeScreen === 'profile' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff5500] rounded-full shadow-[0_0_8px_#ff5500]" />}
              </div>
              <span className="text-[10px] tracking-wide">Profile</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onSelectScreen('performance')}
              className={`flex flex-col items-center gap-1 transition-all duration-200 py-1 px-2.5 rounded-xl ${
                activeScreen === 'performance' ? 'text-[#ff5500] font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Activity className={`w-5 h-5 ${activeScreen === 'performance' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {activeScreen === 'performance' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff5500] rounded-full shadow-[0_0_8px_#ff5500]" />}
              </div>
              <span className="text-[10px] tracking-wide">Analytics</span>
            </button>
            <button
              onClick={() => onSelectScreen('schedule')}
              className={`flex flex-col items-center gap-1 transition-all duration-200 py-1 px-2.5 rounded-xl ${
                activeScreen === 'schedule' ? 'text-[#ff5500] font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Calendar className={`w-5 h-5 ${activeScreen === 'schedule' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {activeScreen === 'schedule' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff5500] rounded-full shadow-[0_0_8px_#ff5500]" />}
              </div>
              <span className="text-[10px] tracking-wide">Schedule</span>
            </button>
            <button
              onClick={() => onSelectScreen('management')}
              className={`flex flex-col items-center gap-1 transition-all duration-200 py-1 px-2.5 rounded-xl ${
                activeScreen === 'management' ? 'text-[#ff5500] font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <CreditCard className={`w-5 h-5 ${activeScreen === 'management' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {activeScreen === 'management' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff5500] rounded-full shadow-[0_0_8px_#ff5500]" />}
              </div>
              <span className="text-[10px] tracking-wide">Admin Desk</span>
            </button>
          </>
        )}

        <button
          onClick={() => onSelectScreen('chatbot')}
          className={`flex flex-col items-center gap-1 transition-all duration-200 py-1 px-2.5 rounded-xl ${
            activeScreen === 'chatbot' ? 'text-[#ff5500] font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Bot className={`w-5 h-5 ${activeScreen === 'chatbot' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            {activeScreen === 'chatbot' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff5500] rounded-full shadow-[0_0_8px_#ff5500]" />}
          </div>
          <span className="text-[10px] tracking-wide">AI Coach</span>
        </button>

      </div>
    </nav>
  );
};
