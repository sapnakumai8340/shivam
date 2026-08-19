import React from 'react';
import { 
  Sparkles, 
  Activity, 
  Rss, 
  Bot, 
  Calendar, 
  User, 
  CreditCard, 
  ArrowRight, 
  Trophy, 
  Zap, 
  ShieldCheck, 
  Flame, 
  Plus, 
  Upload, 
  Shield, 
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  GraduationCap
} from 'lucide-react';
import { AthleteProfile, BiomechanicalScan, HighlightVideo, TapeAnalysis, UserRole } from '../types';
import { UserAuthData } from './LoginModal';

interface HomeViewProps {
  athlete: AthleteProfile;
  role: UserRole;
  telemetry?: any;
  onToggleSession?: () => void;
  scans?: BiomechanicalScan[];
  onOpenUploadTape: () => void;
  onOpenScan: () => void;
  onNavigateToPerformance: () => void;
  onNavigateToSchedule: () => void;
  onNavigateToProfile: () => void;
  onNavigateToFeed?: () => void;
  onNavigateToChatbot?: () => void;
  onNavigateToManagement?: () => void;
  onNavigateToCourses?: () => void;
  onOpenEditProfile?: () => void;
  onPlayVideo: (item: HighlightVideo | TapeAnalysis) => void;
  onSelectScan: (scan: BiomechanicalScan) => void;
  onLoginSuccess?: (role: UserRole, email: string, authData?: UserAuthData) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  athlete,
  role,
  onOpenUploadTape,
  onOpenScan,
  onNavigateToPerformance,
  onNavigateToSchedule,
  onNavigateToProfile,
  onNavigateToFeed,
  onNavigateToChatbot,
  onNavigateToManagement,
  onNavigateToCourses,
  onOpenEditProfile,
}) => {
  const roleTitle = role === 'admin' ? 'Club Administrator' : role === 'coach' ? 'Head Coach & Tactician' : 'Athlete / Player';
  const roleBadgeColor = role === 'admin' ? 'bg-indigo-600 text-white' : role === 'coach' ? 'bg-blue-600 text-white' : 'bg-[#ff5500] text-white';

  return (
    <div className="min-h-screen bg-[#070b0f] text-slate-100 pb-28 pt-2 px-3.5 sm:px-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* 1. HERO SPLASH HEADER BANNER */}
      <div className="relative bg-gradient-to-br from-[#151c24] via-[#0e141c] to-[#080d12] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center">
        {/* Ambient Stadium Glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ff5500]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />
        
        {/* Brand Tagline & Logo */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff5500]/15 border border-[#ff5500]/30 text-[#ff5500] text-[11px] font-black uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(255,85,0,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KHELTANTRA SPORTS PLATFORM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black italic tracking-wide text-white uppercase drop-shadow-[0_2px_15px_rgba(255,85,0,0.3)]">
            APEX <span className="text-[#ff5500]">ELITE</span>
          </h1>
          
          <p className="text-xs sm:text-sm font-semibold text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
            The Authoritative Multi-Sport Performance, Community Feed & Tactical Intelligence Network.
          </p>

          {/* Sports Supported Badges */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap text-xs font-bold text-slate-300">
            <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-1.5 shadow-sm">
              ⚽ <span>Football</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-1.5 shadow-sm">
              🏏 <span>Cricket</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-1.5 shadow-sm">
              🏐 <span>Volleyball</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-1.5 shadow-sm">
              🏀 <span>Basketball</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. AUTHENTICATED USER WELCOME CAPSULE */}
      <div className="bg-[#0e141c] border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div 
            onClick={onOpenEditProfile || onNavigateToProfile}
            className="w-14 h-14 rounded-2xl border-2 border-[#ff5500] overflow-hidden bg-slate-900 shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0"
            title="Edit profile avatar"
          >
            <img
              src={athlete.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt={athlete.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-black text-white truncate">{athlete.name}</h2>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${roleBadgeColor}`}>
                {role.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate">
              {athlete.position} • {athlete.club || 'Kheltantra FC'}
            </p>
            <p className="text-[10px] text-emerald-400 font-mono font-bold mt-0.5">
              ● Active Database Session
            </p>
          </div>
        </div>

        {/* Action Button to launch Analytics */}
        <button
          onClick={onNavigateToPerformance}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-[#ff5500] to-[#ff6b2b] hover:from-[#ff4400] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,85,0,0.35)] active:scale-95 transition-all shrink-0"
        >
          <span>Enter Dashboard</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {/* 3. PLATFORM FEATURE LAUNCHPAD TILES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Platform Modules & Fast Navigation
          </h3>
          <span className="text-[10px] font-mono text-slate-500 font-bold">1-TAP ACCESS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Tile 1: Performance Analytics */}
          <div
            onClick={onNavigateToPerformance}
            className="p-5 rounded-3xl bg-[#0e141c] border border-slate-800 hover:border-[#ff5500]/60 hover:bg-slate-800/30 cursor-pointer transition-all shadow-lg group space-y-2.5 relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#ff5500]/15 text-[#ff5500] flex items-center justify-center border border-[#ff5500]/30 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white group-hover:text-[#ff5500] transition-colors flex items-center justify-between">
                <span>Performance Analytics</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Real database metrics, training session durations & match stat tracking for all sports.
              </p>
            </div>
          </div>

          {/* Tile 2: Community Social Feed */}
          <div
            onClick={onNavigateToFeed || onNavigateToPerformance}
            className="p-5 rounded-3xl bg-[#0e141c] border border-slate-800 hover:border-pink-500/60 hover:bg-slate-800/30 cursor-pointer transition-all shadow-lg group space-y-2.5 relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-2xl bg-pink-500/15 text-pink-400 flex items-center justify-center border border-pink-500/30 group-hover:scale-110 transition-transform">
              <Rss className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white group-hover:text-pink-400 transition-colors flex items-center justify-between">
                <span>Community Feed</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Post match videos, share training reels, like and comment with fellow athletes.
              </p>
            </div>
          </div>

          {/* Tile 3: AI Tactician & Coach */}
          <div
            onClick={onNavigateToChatbot || onNavigateToPerformance}
            className="p-5 rounded-3xl bg-[#0e141c] border border-slate-800 hover:border-sky-500/60 hover:bg-slate-800/30 cursor-pointer transition-all shadow-lg group space-y-2.5 relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center border border-sky-500/30 group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white group-hover:text-sky-400 transition-colors flex items-center justify-between">
                <span>AI Tactics & Coach</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Get intelligent training drills, recovery advice, and tactical match formation guidance.
              </p>
            </div>
          </div>

          {/* Tile 4: Match Fixtures & Scheduling */}
          <div
            onClick={onNavigateToSchedule}
            className="p-5 rounded-3xl bg-[#0e141c] border border-slate-800 hover:border-amber-500/60 hover:bg-slate-800/30 cursor-pointer transition-all shadow-lg group space-y-2.5 relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                <span>Fixture Schedule</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Upcoming league fixtures, opponent analysis, starting XI lineups & match countdown.
              </p>
            </div>
          </div>

          {/* Tile 5: Player Profile & Highlights */}
          <div
            onClick={onNavigateToProfile}
            className="p-5 rounded-3xl bg-[#0e141c] border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-800/30 cursor-pointer transition-all shadow-lg group space-y-2.5 relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
              <User className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                <span>Athlete Profile</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Edit biography, upload highlight videos, view match milestones and bio.
              </p>
            </div>
          </div>

          {/* Tile 6: Academy & Video Masterclasses */}
          <div
            onClick={onNavigateToCourses || onNavigateToPerformance}
            className="p-5 rounded-3xl bg-[#0e141c] border border-slate-800 hover:border-[#ff5500]/60 hover:bg-slate-800/30 cursor-pointer transition-all shadow-lg group space-y-2.5 relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#ff5500]/15 text-[#ff5500] flex items-center justify-center border border-[#ff5500]/30 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white group-hover:text-[#ff5500] transition-colors flex items-center justify-between">
                <span>Apex Academy Masterclasses</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                100% Free video lessons on finishing, fast bowling, knee rehab & spatial vision.
              </p>
            </div>
          </div>

          {/* Tile 7: Admin Desk (or Video Upload for Athletes) */}
          {role === 'admin' && onNavigateToManagement ? (
            <div
              onClick={onNavigateToManagement}
              className="p-5 rounded-3xl bg-[#0e141c] border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800/30 cursor-pointer transition-all shadow-lg group space-y-2.5 relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                  <span>Admin Management Desk</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Squad rosters, player fees, inventory allocation & official club oversight.
                </p>
              </div>
            </div>
          ) : (
            <div
              onClick={onOpenUploadTape}
              className="p-5 rounded-3xl bg-[#0e141c] border border-slate-800 hover:border-purple-500/60 hover:bg-slate-800/30 cursor-pointer transition-all shadow-lg group space-y-2.5 relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white group-hover:text-purple-400 transition-colors flex items-center justify-between">
                  <span>Upload Match Tape</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Upload raw video reels or match recordings for tactical analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. PLATFORM PILLARS / VERIFIED HIGHLIGHTS */}
      <div className="bg-[#0e141c] border border-slate-800/90 rounded-3xl p-5 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-black text-white uppercase">Real Database Powered</h5>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              No fake or hardcoded numbers. All analytics derive from real logged activity.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#ff5500]/15 text-[#ff5500] shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-black text-white uppercase">Multi-Sport Matrix</h5>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Built for Football, Cricket, Volleyball, Basketball, Athletics & more.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-black text-white uppercase">Real-Time Sync</h5>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Instant live socket updates for posts, match scores, and comments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
