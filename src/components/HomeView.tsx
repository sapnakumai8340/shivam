import React, { useState } from 'react';
import { 
  Flame, 
  Upload, 
  Scan, 
  BarChart3, 
  Calendar, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  Film,
  TrendingUp,
  Heart,
  Gauge,
  Lock,
  Mail,
  User,
  Shield,
  Award,
  Hash,
  Eye,
  EyeOff,
  AlertCircle,
  Trophy,
  Target,
  Dna,
  Edit3,
  UserCheck,
  Settings
} from 'lucide-react';
import { AthleteProfile, BiomechanicalScan, HighlightVideo, TapeAnalysis, UserRole } from '../types';
import { UserAuthData } from './LoginModal';
import { LiveTelemetryWidget } from './LiveTelemetryWidget';
import { LiveTelemetrySnapshot } from '../utils/realtimeStore';

interface HomeViewProps {
  athlete: AthleteProfile;
  role: UserRole;
  telemetry?: LiveTelemetrySnapshot;
  onToggleSession?: () => void;
  scans?: BiomechanicalScan[];
  onOpenUploadTape: () => void;
  onOpenScan: () => void;
  onNavigateToPerformance: () => void;
  onNavigateToSchedule: () => void;
  onNavigateToProfile: () => void;
  onNavigateToManagement?: () => void;
  onOpenEditProfile?: () => void;
  onPlayVideo: (item: HighlightVideo | TapeAnalysis) => void;
  onSelectScan: (scan: BiomechanicalScan) => void;
  onLoginSuccess?: (role: UserRole, email: string, authData?: UserAuthData) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  athlete,
  role,
  telemetry,
  onToggleSession,
  scans,
  onOpenUploadTape,
  onOpenScan,
  onNavigateToPerformance,
  onNavigateToSchedule,
  onNavigateToProfile,
  onNavigateToManagement,
  onOpenEditProfile,
  onPlayVideo,
  onSelectScan,
  onLoginSuccess,
}) => {
  return (
    <div className="min-h-screen bg-[#070b0f] text-slate-100 pb-28 pt-2 px-3.5 sm:px-4 max-w-md mx-auto space-y-4">
      
      {/* 1. DYNAMIC USER / ATHLETE PROFILE CARD */}
      <div className="bg-gradient-to-br from-[#121922] via-[#0e141c] to-[#080d12] border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#ff5500]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3.5 relative z-10">
          <div className="flex items-center gap-3">
            <div 
              className="relative cursor-pointer group" 
              onClick={onOpenEditProfile || onNavigateToProfile}
              title="Click to customize profile avatar and details"
            >
              <div className="w-14 h-14 rounded-2xl border-2 border-[#ff5500] overflow-hidden bg-slate-900 shadow-lg group-hover:scale-105 transition-transform">
                <img
                  src={athlete.avatar}
                  alt={athlete.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#ff5500] text-white text-[9px] font-black px-1.5 py-0.2 rounded-md uppercase font-mono shadow">
                #{athlete.number}
              </span>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center transition-opacity">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-mono text-[#ff5500] font-black uppercase tracking-wider">
                  {athlete.position} • {athlete.role}
                </span>
                <span className="inline-flex items-center gap-1 text-[8px] font-black px-1.5 py-0.2 rounded-full bg-[#00e5a3]/20 text-[#00e5a3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a3] animate-pulse" />
                  MATCH READY
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight leading-tight flex items-center gap-1.5">
                <span>{athlete.name}</span>
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {athlete.club || 'Apex Premier Squad'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider">APEX INDEX</div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono leading-none my-0.5">
              {athlete.overallRating.toFixed(1)}
            </div>
            <div className="text-[9px] text-[#00e5a3] font-bold flex items-center justify-end gap-0.5 font-mono">
              <TrendingUp className="w-3 h-3" />
              <span>+{athlete.ratingChange} live</span>
            </div>
          </div>
        </div>

        {/* Quick Customization Button & Role Tag */}
        <div className="flex items-center justify-between pt-2.5 pb-3 border-t border-slate-800/80 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-slate-400 uppercase">ACTIVE ROLE:</span>
            <span className="px-2 py-0.5 rounded-md bg-[#ff5500]/15 text-[#ff5500] text-[9px] font-black uppercase tracking-wider border border-[#ff5500]/30">
              {role === 'admin' ? 'Coach / Director' : 'Athlete Profile'}
            </span>
          </div>

          <button
            onClick={onOpenEditProfile || onNavigateToProfile}
            className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-[#ff5500]/20 border border-slate-700 hover:border-[#ff5500] text-slate-200 hover:text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Edit3 className="w-3 h-3 text-[#ff5500]" />
            <span>Customize Profile</span>
          </button>
        </div>

        {/* Key Real-Time Athletic Stats */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-[#080d12]/90 rounded-xl p-2 border border-slate-800/70">
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-wider">MATCHES</div>
            <div className="text-xs font-black text-white font-mono">{athlete?.stats?.games ?? 0}</div>
          </div>
          <div className="bg-[#080d12]/90 rounded-xl p-2 border border-slate-800/70">
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-wider">GOALS</div>
            <div className="text-xs font-black text-white font-mono">{athlete?.stats?.goals ?? 0}</div>
          </div>
          <div className="bg-[#080d12]/90 rounded-xl p-2 border border-slate-800/70">
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-wider">SYMMETRY</div>
            <div className="text-xs font-black text-[#00e5a3] font-mono">{athlete?.stats?.symmetry ?? 95}%</div>
          </div>
          <div className="bg-[#080d12]/90 rounded-xl p-2 border border-slate-800/70">
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-wider">TOP VELOCITY</div>
            <div className="text-xs font-black text-[#ff5500] font-mono">{athlete?.stats?.topSpeed ?? 32.0} <span className="text-[7px]">km/h</span></div>
          </div>
        </div>
      </div>

      {/* 2. LIVE BIO-SENSOR TELEMETRY STREAM (100 Hz Socket.IO) */}
      {telemetry && (
        <LiveTelemetryWidget
          telemetry={telemetry}
          onToggleSession={onToggleSession || (() => {})}
          onOpenScan={onOpenScan}
        />
      )}

      {/* 3. PRIMARY ACTION COMMAND HUB */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Upload Match Tape */}
        <button
          onClick={onOpenUploadTape}
          className="group text-left p-3.5 rounded-2xl bg-gradient-to-br from-[#ff5500] to-[#e64400] text-white shadow-lg shadow-[#ff5500]/25 hover:shadow-xl hover:shadow-[#ff5500]/40 transition-all active:scale-95 relative overflow-hidden"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-2.5 backdrop-blur-sm group-hover:scale-110 transition-transform">
            <Upload className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="text-xs font-black uppercase tracking-tight">Upload Match Tape</div>
          <div className="text-[10px] text-white/80 mt-0.5">Video telemetry & AI breakdown</div>
          <ArrowUpRight className="w-4 h-4 absolute top-3.5 right-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Optical Scan */}
        <button
          onClick={onOpenScan}
          className="group text-left p-3.5 rounded-2xl bg-[#121922] border border-slate-800 hover:border-[#ff5500]/50 transition-all active:scale-95 relative overflow-hidden shadow-lg"
        >
          <div className="w-8 h-8 rounded-xl bg-[#ff5500]/10 border border-[#ff5500]/30 text-[#ff5500] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Scan className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="text-xs font-black text-white uppercase tracking-tight">Biomechanical Scan</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Joint torque & force angles</div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Matchday Schedule */}
        <button
          onClick={onNavigateToSchedule}
          className="group text-left p-3 rounded-2xl bg-[#121922] border border-slate-800 hover:border-blue-500/50 transition-all active:scale-95"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-2">
            <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div className="text-xs font-black text-white uppercase tracking-tight">Matchday Hub</div>
          <div className="text-[10px] text-slate-400">Fixtures & tactical lineup</div>
        </button>

        {/* Full Performance Lab */}
        <button
          onClick={onNavigateToPerformance}
          className="group text-left p-3 rounded-2xl bg-[#121922] border border-slate-800 hover:border-[#00e5a3]/50 transition-all active:scale-95"
        >
          <div className="w-7 h-7 rounded-lg bg-[#00e5a3]/10 border border-[#00e5a3]/30 text-[#00e5a3] flex items-center justify-center mb-2">
            <BarChart3 className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div className="text-xs font-black text-white uppercase tracking-tight">Performance Lab</div>
          <div className="text-[10px] text-slate-400">Telemetry & workload matrices</div>
        </button>

        {/* Admin Academy Management Desk */}
        {onNavigateToManagement && (
          <button
            onClick={onNavigateToManagement}
            className="group text-left p-3 rounded-2xl bg-[#121922] border border-[#ff5500]/40 hover:border-[#ff5500] transition-all active:scale-95 col-span-2 sm:col-span-1 shadow-md"
          >
            <div className="w-7 h-7 rounded-lg bg-[#ff5500]/15 border border-[#ff5500]/40 text-[#ff7733] flex items-center justify-center mb-2">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div className="text-xs font-black text-white uppercase tracking-tight flex items-center gap-1">
              <span>Admin & Fees Desk</span>
              <span className="text-[8px] bg-[#ff5500] text-white px-1 rounded font-bold">ADMIN</span>
            </div>
            <div className="text-[10px] text-slate-400">Player roster, fee receipts & kit</div>
          </button>
        )}
      </div>

      {/* 4. RECENT GAME TAPES & MATCH HIGHLIGHTS */}
      <div className="bg-[#121922] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Film className="w-4 h-4 text-[#ff5500]" />
            <h3 className="text-xs font-black text-white uppercase tracking-wide">
              MATCHDAY TAPES & VIDEO REELS
            </h3>
          </div>
          <button
            onClick={onOpenUploadTape}
            className="text-[10px] font-extrabold text-[#ff5500] hover:underline uppercase"
          >
            + Upload New
          </button>
        </div>

        <div className="space-y-2.5">
          {athlete.tapes && athlete.tapes.length > 0 ? (
            athlete.tapes.slice(0, 2).map((tape) => (
              <div
                key={tape.id}
                onClick={() => onPlayVideo(tape)}
                className="group flex gap-3 p-2.5 rounded-2xl bg-[#080c10] border border-slate-800 hover:border-[#ff5500]/50 transition-all cursor-pointer shadow-md"
              >
                <div className="relative w-24 h-18 rounded-xl overflow-hidden bg-black shrink-0">
                  <img
                    src={tape.thumbnail}
                    alt={tape.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-85"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-[#ff5500] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-3 h-3 fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] font-mono px-1 rounded">
                    {tape.duration}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-[#ff5500]/15 text-[#ff5500] font-black uppercase">
                        {tape.category}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">{tape.dateAdded}</span>
                    </div>
                    <h4 className="text-xs font-black text-white line-clamp-1 group-hover:text-[#ff5500] transition-colors">
                      {tape.title}
                    </h4>
                  </div>

                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {tape.keyInsights ? tape.keyInsights[0] : 'Optical tracking active'}
                  </p>

                  <div className="flex items-center justify-between text-[9px] text-slate-400">
                    <span className="text-[#00e5a3] font-bold">AI Kinematic HUD Ready</span>
                    <span className="font-mono">{tape.fileSize || '350 MB'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl bg-[#080d12]/50">
              <Film className="w-6 h-6 text-slate-600 mx-auto mb-1.5" />
              <p className="text-xs text-slate-400 font-medium">No game tapes uploaded yet</p>
              <button
                onClick={onOpenUploadTape}
                className="mt-2 text-[10px] font-black uppercase text-[#ff5500] hover:underline"
              >
                + Upload your first match tape
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
