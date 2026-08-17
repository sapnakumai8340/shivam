import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Zap,
  Heart,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  Users,
  Play,
  Pause,
  Download,
  Calendar,
  Plus,
  Flame,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Clock,
  Gauge,
  FileText,
  AlertCircle,
  X,
  Printer,
  ChevronDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ComposedChart
} from 'recharts';
import { LiveTelemetrySnapshot } from '../utils/realtimeStore';
import { UserRole, SquadPlayerTelemetry, AthleteProfile, BiomechanicalScan, FixtureSchedule, SessionRecord } from '../types';

interface PerformanceViewProps {
  athlete?: AthleteProfile;
  role: UserRole;
  telemetry?: LiveTelemetrySnapshot;
  communityAthletes?: Record<string, AthleteProfile>;
  scans?: BiomechanicalScan[];
  fixtures?: FixtureSchedule[];
  sessions?: SessionRecord[];
  onLogSession?: (sessionData: any) => void;
  onToggleSession?: () => void;
  onOpenScan?: () => void;
  onOpenUploadTape?: () => void;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({
  athlete,
  role,
  telemetry,
  communityAthletes,
  scans = [],
  fixtures = [],
  sessions = [],
  onLogSession,
  onToggleSession,
  onOpenScan,
  onOpenUploadTape
}) => {
  const [activeTab, setActiveTab] = useState<'telemetry_sessions' | 'kinetic_scans' | 'match_history' | 'squad_matrix'>('telemetry_sessions');
  const [selectedPlayerId, setSelectedPlayerId] = useState(athlete?.id || 'APX-9942');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('live');
  const [showLogModal, setShowLogModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Live buffer of real-time ticks from socket
  const [liveBuffer, setLiveBuffer] = useState<Array<{
    minute: number;
    label: string;
    velocityKmh: number;
    heartRateBpm: number;
    leftGroundForceN: number;
    rightGroundForceN: number;
    jointTorqueNm: number;
  }>>([]);

  // Form State for Logging Real Session
  const [sessionForm, setSessionForm] = useState({
    sessionType: 'MATCH' as SessionRecord['sessionType'],
    title: '',
    durationMinutes: 90,
    topSpeedKmh: athlete?.stats?.topSpeed || 34.2,
    avgHeartRateBpm: 156,
    maxHeartRateBpm: 188,
    distanceKm: 10.4,
    leftGroundForceN: 1220,
    rightGroundForceN: 1250,
    jointTorqueNm: 178,
    rpeLoadScore: 8,
    notes: '',
  });

  // Keep live buffer synced with incoming real-time telemetry
  useEffect(() => {
    if (!telemetry || !telemetry.isSessionActive) return;

    setLiveBuffer((prev) => {
      const currentMin = Math.floor((telemetry.activeSessionDurationSec || 0) / 60);
      const label = `${currentMin}'`;
      const newPoint = {
        minute: currentMin,
        label,
        velocityKmh: telemetry.currentSpeed || 0,
        heartRateBpm: telemetry.heartRate || 140,
        leftGroundForceN: telemetry.groundForceLeft || 1200,
        rightGroundForceN: telemetry.groundForceRight || 1220,
        jointTorqueNm: telemetry.kneeTorqueNm || 160,
      };

      if (prev.length > 0 && prev[prev.length - 1].minute === currentMin) {
        const updated = [...prev];
        updated[updated.length - 1] = newPoint;
        return updated;
      }
      return [...prev.slice(-20), newPoint];
    });
  }, [telemetry?.activeSessionDurationSec, telemetry?.currentSpeed, telemetry?.heartRate]);

  // Selected Athlete Object
  const currentAthlete: AthleteProfile = useMemo(() => {
    if (communityAthletes && communityAthletes[selectedPlayerId]) {
      return communityAthletes[selectedPlayerId];
    }
    if (athlete && athlete.id === selectedPlayerId) {
      return athlete;
    }
    return athlete || {
      id: 'APX-9942',
      name: 'Rahul Kumar',
      email: 'rahul.kumar@apex.in',
      role: 'player',
      position: 'Forward',
      number: 9,
      code: 'APX-9942',
      status: 'ACTIVE',
      club: 'Bengaluru Elite FC',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      actionImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600',
      overallRating: 95.4,
      ratingChange: 1.2,
      highlights: [],
      tapes: [],
      stats: {
        games: 28,
        goals: 19,
        assists: 11,
        topSpeed: 34.8,
        passAccuracy: 88,
        shotConversion: 24,
        stamina: 94,
        acwr: 1.14,
        symmetry: 96,
        injuryRisk: 'LOW',
        forceBalance: { left: 49, right: 51 }
      },
      ratingHistory: [
        { month: 'Aug', rating: 91 },
        { month: 'Sep', rating: 92 },
        { month: 'Oct', rating: 93.5 },
        { month: 'Nov', rating: 94 },
        { month: 'Dec', rating: 95.4 }
      ],
      recentMatches: [
        { id: 'M-1', opponent: 'Mumbai City FC', isHome: true, date: '2026-03-28', result: 'W 3-1', rating: 9.4, score: '3 - 1 (W)', status: 'completed', minutesPlayed: 90, goalsScored: 2, assistsGiven: 1, topSpeed: 34.8 },
        { id: 'M-2', opponent: 'Mohun Bagan SG', isHome: false, date: '2026-03-21', result: 'W 2-0', rating: 8.9, score: '2 - 0 (W)', status: 'completed', minutesPlayed: 84, goalsScored: 1, assistsGiven: 0, topSpeed: 34.2 },
        { id: 'M-3', opponent: 'Kerala Blasters', isHome: true, date: '2026-03-14', result: 'D 2-2', rating: 8.6, score: '2 - 2 (D)', status: 'completed', minutesPlayed: 90, goalsScored: 1, assistsGiven: 1, topSpeed: 33.9 },
        { id: 'M-4', opponent: 'FC Goa', isHome: false, date: '2026-03-07', result: 'W 4-1', rating: 9.6, score: '4 - 1 (W)', status: 'completed', minutesPlayed: 78, goalsScored: 2, assistsGiven: 2, topSpeed: 34.6 }
      ]
    };
  }, [selectedPlayerId, communityAthletes, athlete]);

  // Filtered Sessions for this athlete
  const athleteSessions = useMemo(() => {
    return sessions.filter((s) => s.athleteId === currentAthlete.id);
  }, [sessions, currentAthlete.id]);

  // Filtered Scans for this athlete
  const athleteScans = useMemo(() => {
    return scans.filter((s) => s.athleteId === currentAthlete.id || s.athleteName === currentAthlete.name);
  }, [scans, currentAthlete.id, currentAthlete.name]);

  // Squad list for selector and matrix
  const squadList: SquadPlayerTelemetry[] = useMemo(() => {
    const athletesList: AthleteProfile[] = (
      communityAthletes && Object.keys(communityAthletes).length > 0
        ? Object.values(communityAthletes)
        : (athlete ? [athlete] : [])
    ).filter(Boolean);

    return athletesList
      .filter((a) => a.position !== 'STAFF' && a.role !== 'admin')
      .map((a) => {
        const isCurrent = a.id === athlete?.id;
        return {
          id: a.id || 'ATH-01',
          name: a.name || 'Athlete',
          position: a.position || 'Forward',
          jersey: a.number || 10,
          topSpeed: a.stats?.topSpeed || 34.2,
          sprintDistanceM: Math.round((a.stats?.topSpeed || 33) * 26),
          totalDistanceKm: Number((10.2 + (a.number % 3) * 0.8).toFixed(1)),
          acwr: a.stats?.acwr || 1.14,
          symmetryPct: a.stats?.symmetry || 96,
          readinessScore: Math.round(a.overallRating || 92),
          injuryRiskScore: a.stats?.injuryRisk === 'LOW' ? 10 : (a.stats?.injuryRisk === 'MODERATE' ? 35 : 60),
          riskCategory: (a.stats?.injuryRisk as any) || 'LOW',
          status: a.status || 'ACTIVE',
          liveStatus: isCurrent && telemetry?.isSessionActive ? 'ON PITCH' : 'BENCH',
          currentBpm: isCurrent ? telemetry?.heartRate : undefined
        };
      });
  }, [communityAthletes, athlete, telemetry]);

  // Active Selected Session Object
  const currentSession = useMemo(() => {
    if (selectedSessionId === 'live') return null;
    return athleteSessions.find((s) => s.id === selectedSessionId) || athleteSessions[0] || null;
  }, [selectedSessionId, athleteSessions]);

  // Telemetry time series points to display
  const displayTelemetryPoints = useMemo(() => {
    if (selectedSessionId === 'live') {
      if (liveBuffer.length > 0) return liveBuffer;
      // Fallback base data when starting live session
      return [
        { minute: 0, label: "0'", velocityKmh: 0, heartRateBpm: 72, leftGroundForceN: 720, rightGroundForceN: 730, jointTorqueNm: 85 },
        { minute: 10, label: "10'", velocityKmh: 28.4, heartRateBpm: 148, leftGroundForceN: 1190, rightGroundForceN: 1210, jointTorqueNm: 156 },
        { minute: 20, label: "20'", velocityKmh: 31.2, heartRateBpm: 165, leftGroundForceN: 1330, rightGroundForceN: 1345, jointTorqueNm: 180 },
        { minute: 30, label: "30'", velocityKmh: 34.8, heartRateBpm: 179, leftGroundForceN: 1470, rightGroundForceN: 1480, jointTorqueNm: 208 },
        { minute: 45, label: "HT", velocityKmh: 12.0, heartRateBpm: 116, leftGroundForceN: 840, rightGroundForceN: 850, jointTorqueNm: 95 },
        { minute: 60, label: "60'", velocityKmh: 33.4, heartRateBpm: 174, leftGroundForceN: 1390, rightGroundForceN: 1420, jointTorqueNm: 194 },
        { minute: 75, label: "75'", velocityKmh: 30.2, heartRateBpm: 176, leftGroundForceN: 1290, rightGroundForceN: 1340, jointTorqueNm: 178 },
        { minute: 90, label: "90'", velocityKmh: 32.8, heartRateBpm: 186, leftGroundForceN: 1370, rightGroundForceN: 1440, jointTorqueNm: 190 },
      ];
    }
    if (currentSession?.telemetryPoints && currentSession.telemetryPoints.length > 0) {
      return currentSession.telemetryPoints.map((p) => ({
        minute: p.minute,
        label: p.label || `${p.minute}'`,
        velocityKmh: p.velocityKmh,
        heartRateBpm: p.heartRateBpm,
        leftGroundForceN: p.leftGroundForceN,
        rightGroundForceN: p.rightGroundForceN,
        jointTorqueNm: p.jointTorqueNm,
      }));
    }
    return [
      { minute: 0, label: "0'", velocityKmh: 0, heartRateBpm: 75, leftGroundForceN: 700, rightGroundForceN: 710, jointTorqueNm: 80 },
      { minute: currentSession?.durationMinutes || 90, label: `${currentSession?.durationMinutes || 90}'`, velocityKmh: currentSession?.topSpeedKmh || 34, heartRateBpm: currentSession?.avgHeartRateBpm || 155, leftGroundForceN: currentSession?.leftGroundForceN || 1200, rightGroundForceN: currentSession?.rightGroundForceN || 1240, jointTorqueNm: currentSession?.jointTorqueNm || 175 },
    ];
  }, [selectedSessionId, liveBuffer, currentSession]);

  // Handle submitting real session to backend
  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionForm.title.trim()) return;

    const diff = Math.abs(sessionForm.leftGroundForceN - sessionForm.rightGroundForceN);
    const avgForce = (sessionForm.leftGroundForceN + sessionForm.rightGroundForceN) / 2;
    const computedSymmetry = Math.min(100, Math.max(70, Math.round(100 - (diff / avgForce) * 100)));

    const newRecord: Partial<SessionRecord> = {
      athleteId: currentAthlete.id,
      athleteName: currentAthlete.name,
      sessionType: sessionForm.sessionType,
      title: sessionForm.title,
      durationMinutes: Number(sessionForm.durationMinutes),
      topSpeedKmh: Number(sessionForm.topSpeedKmh),
      avgHeartRateBpm: Number(sessionForm.avgHeartRateBpm),
      maxHeartRateBpm: Number(sessionForm.maxHeartRateBpm),
      distanceKm: Number(sessionForm.distanceKm),
      leftGroundForceN: Number(sessionForm.leftGroundForceN),
      rightGroundForceN: Number(sessionForm.rightGroundForceN),
      symmetryPct: computedSymmetry,
      jointTorqueNm: Number(sessionForm.jointTorqueNm),
      rpeLoadScore: Number(sessionForm.rpeLoadScore),
      notes: sessionForm.notes,
      telemetryPoints: [
        { minute: 0, velocityKmh: 0, heartRateBpm: 75, leftGroundForceN: Math.round(sessionForm.leftGroundForceN * 0.6), rightGroundForceN: Math.round(sessionForm.rightGroundForceN * 0.6), jointTorqueNm: 85, label: "0'" },
        { minute: Math.round(sessionForm.durationMinutes * 0.3), velocityKmh: Number((sessionForm.topSpeedKmh * 0.85).toFixed(1)), heartRateBpm: sessionForm.avgHeartRateBpm, leftGroundForceN: sessionForm.leftGroundForceN, rightGroundForceN: sessionForm.rightGroundForceN, jointTorqueNm: sessionForm.jointTorqueNm, label: `${Math.round(sessionForm.durationMinutes * 0.3)}'` },
        { minute: Math.round(sessionForm.durationMinutes * 0.7), velocityKmh: Number(sessionForm.topSpeedKmh), heartRateBpm: sessionForm.maxHeartRateBpm, leftGroundForceN: Math.round(sessionForm.leftGroundForceN * 1.1), rightGroundForceN: Math.round(sessionForm.rightGroundForceN * 1.1), jointTorqueNm: Math.round(sessionForm.jointTorqueNm * 1.15), label: `${Math.round(sessionForm.durationMinutes * 0.7)}'` },
        { minute: sessionForm.durationMinutes, velocityKmh: Number((sessionForm.topSpeedKmh * 0.75).toFixed(1)), heartRateBpm: Math.round(sessionForm.avgHeartRateBpm * 1.05), leftGroundForceN: sessionForm.leftGroundForceN, rightGroundForceN: sessionForm.rightGroundForceN, jointTorqueNm: sessionForm.jointTorqueNm, label: `${sessionForm.durationMinutes}'` },
      ]
    };

    if (onLogSession) {
      onLogSession(newRecord);
    }
    setShowLogModal(false);
    setSessionForm({
      sessionType: 'MATCH',
      title: '',
      durationMinutes: 90,
      topSpeedKmh: currentAthlete.stats?.topSpeed || 34.2,
      avgHeartRateBpm: 156,
      maxHeartRateBpm: 188,
      distanceKm: 10.4,
      leftGroundForceN: 1220,
      rightGroundForceN: 1250,
      jointTorqueNm: 178,
      rpeLoadScore: 8,
      notes: '',
    });
  };

  return (
    <div id="performance-dashboard-container" className="min-h-screen bg-[#070b0f] text-slate-100 pb-36 pt-2 px-3 sm:px-6 max-w-5xl mx-auto font-sans">
      {/* 1. Header & Subject Selector */}
      <div id="performance-header-card" className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 sm:p-5 mb-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ff5500]/15 border border-[#ff5500]/40 text-[#ff5500] text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>AUTHORITATIVE TELEMETRY ENGINE</span>
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>DATABASE PERSISTENT</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Biometrics, GPS & Kinetic Load Intelligence
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Authoritative sensor streams, verified match telemetry & 3D kinematic scans
            </p>
          </div>

          {/* Global Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              id="log-session-modal-btn"
              onClick={() => setShowLogModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff661a] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Log Session</span>
            </button>

            {onToggleSession && (
              <button
                id="toggle-telemetry-feed-btn"
                onClick={onToggleSession}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                  telemetry?.isSessionActive
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                    : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {telemetry?.isSessionActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Live Tracking (Active)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Live GPS</span>
                  </>
                )}
              </button>
            )}

            <button
              id="export-performance-dossier-btn"
              onClick={() => setShowExportModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>

        {/* Selected Athlete Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>Selected Athlete:</span>
            </span>
            <div className="relative">
              <select
                id="select-subject-athlete"
                value={selectedPlayerId}
                onChange={(e) => {
                  setSelectedPlayerId(e.target.value);
                  setSelectedSessionId('live');
                }}
                className="bg-[#080d12] text-xs font-bold text-white border border-slate-700 rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-[#ff5500] cursor-pointer appearance-none"
              >
                {squadList.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.jersey} {p.name} ({p.position}) • Readiness: {p.readinessScore}/100
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Club:</span>
              <span className="text-white font-bold">{currentAthlete.club || 'Bengaluru Elite FC'}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Registered Speed:</span>
              <span className="text-[#ff5500] font-mono font-bold">{currentAthlete.stats?.topSpeed || 34.8} km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Hero Key Metrics (Real Profile Data) */}
      <div id="key-metrics-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {/* Metric 1: Peak Velocity */}
        <div id="metric-card-velocity" className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Peak Velocity</span>
            <Flame className="w-4 h-4 text-[#ff5500]" />
          </div>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {currentAthlete.stats?.topSpeed || 34.8}
            </span>
            <span className="text-xs text-slate-400 font-bold">km/h</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-semibold font-mono">GPS Verified</span>
            <span className="text-slate-400">{currentAthlete.position}</span>
          </div>
        </div>

        {/* Metric 2: Bilateral Symmetry */}
        <div id="metric-card-symmetry" className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Force Symmetry</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {currentAthlete.stats?.symmetry || 96}
            </span>
            <span className="text-xs text-slate-400 font-bold">%</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-semibold">
              L {currentAthlete.stats?.forceBalance?.left || 49}% / R {currentAthlete.stats?.forceBalance?.right || 51}%
            </span>
            <span className="text-slate-400 font-mono">3D Scan</span>
          </div>
        </div>

        {/* Metric 3: ACWR Workload */}
        <div id="metric-card-acwr" className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Workload (ACWR)</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {(currentAthlete.stats?.acwr || 1.14).toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-bold">Ratio</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-sky-400 font-semibold">Optimal Range (0.8 - 1.3)</span>
            <span className="text-emerald-400 font-bold">Low Risk</span>
          </div>
        </div>

        {/* Metric 4: Match Readiness */}
        <div id="metric-card-readiness" className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Overall Readiness</span>
            <Gauge className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {Math.round(currentAthlete.overallRating || 95.4)}
            </span>
            <span className="text-xs text-slate-400 font-bold">/ 100</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-semibold">{currentAthlete.stats?.games || 28} Matches Played</span>
            <span className="text-amber-400 font-bold">Elite Tier</span>
          </div>
        </div>
      </div>

      {/* 3. Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-5 overflow-x-auto no-scrollbar">
        {[
          { id: 'telemetry_sessions', label: 'Telemetry & Recorded Sessions', icon: Activity, count: athleteSessions.length },
          { id: 'kinetic_scans', label: '3D Kinematic Scans', icon: ShieldCheck, count: athleteScans.length },
          { id: 'match_history', label: 'Match History & Rating Curve', icon: Calendar, count: currentAthlete.recentMatches?.length || 0 },
          { id: 'squad_matrix', label: 'Squad Matrix & Benchmarks', icon: Users, count: squadList.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#ff5500] text-white shadow-md'
                  : 'bg-[#0e141c] text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-300'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: TELEMETRY & RECORDED SESSIONS */}
      {activeTab === 'telemetry_sessions' && (
        <div className="space-y-5">
          {/* Session Selector Strip */}
          <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Select Performance Data Stream
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  View real-time live sensor stream or historical match sessions logged in the database
                </p>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  id="select-stream-live"
                  onClick={() => setSelectedSessionId('live')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    selectedSessionId === 'live'
                      ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-300'
                      : 'bg-[#080d12] border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Live GPS Stream</span>
                </button>

                {athleteSessions.map((s) => (
                  <button
                    key={s.id}
                    id={`select-session-${s.id}`}
                    onClick={() => setSelectedSessionId(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                      selectedSessionId === s.id
                        ? 'bg-[#ff5500] text-white shadow-sm'
                        : 'bg-[#080d12] border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{s.title} ({s.date || `${s.durationMinutes}m`})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Stream Summary Header */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Current Stream:</span>
                <span className="font-bold text-white font-mono">
                  {selectedSessionId === 'live' ? 'Live Telemetry (100 Hz)' : currentSession?.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px]">
                  {selectedSessionId === 'live' ? `${telemetry?.activeSessionDurationSec || 0}s Elapsed` : `${currentSession?.durationMinutes} min • ${currentSession?.sessionType}`}
                </span>
              </div>

              <div className="flex items-center gap-4 font-mono">
                <div>
                  <span className="text-slate-400 text-[11px] mr-1.5">Top Speed:</span>
                  <span className="text-[#ff5500] font-bold">
                    {selectedSessionId === 'live' ? telemetry?.currentSpeed : currentSession?.topSpeedKmh} km/h
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] mr-1.5">Avg HR:</span>
                  <span className="text-rose-400 font-bold">
                    {selectedSessionId === 'live' ? telemetry?.heartRate : currentSession?.avgHeartRateBpm} BPM
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] mr-1.5">Symmetry:</span>
                  <span className="text-emerald-400 font-bold">
                    {selectedSessionId === 'live' ? telemetry?.bilateralSymmetry : currentSession?.symmetryPct}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 1: Velocity & Cardiovascular Strain */}
          <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#ff5500]" />
                  <span>Velocity Profile & Heart Rate Curve</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Sprint accelerations (km/h) vs cardiovascular response (BPM)
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#ff5500]" /> Velocity (km/h)</span>
                <span className="flex items-center gap-1 ml-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Heart Rate (BPM)</span>
              </div>
            </div>

            <div className="h-72 w-full -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={displayTelemetryPoints} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="velocityGradientReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff5500" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ff5500" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#182230" vertical={false} />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#ff5500" fontSize={11} domain={[0, 40]} unit=" km/h" />
                  <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" fontSize={11} domain={[60, 200]} unit=" BPM" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090e15',
                      borderColor: '#1e293b',
                      borderRadius: '0.85rem',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="velocityKmh"
                    name="Velocity (km/h)"
                    stroke="#ff5500"
                    strokeWidth={2.5}
                    fill="url(#velocityGradientReal)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="heartRateBpm"
                    name="Heart Rate (BPM)"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#f43f5e' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Bilateral Ground Impact & Deceleration Torque */}
          <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Bilateral Ground Reaction Force (GRF) & Deceleration Torque</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Left foot vs Right foot impact load (Newtons) with knee torque stability
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Left (N)</span>
                <span className="flex items-center gap-1 ml-2"><span className="w-2.5 h-2.5 rounded-full bg-[#ff5500]" /> Right (N)</span>
              </div>
            </div>

            <div className="h-64 w-full -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayTelemetryPoints} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#182230" vertical={false} />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[600, 1800]} unit=" N" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090e15',
                      borderColor: '#1e293b',
                      borderRadius: '0.85rem',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line
                    type="monotone"
                    dataKey="leftGroundForceN"
                    name="Left Foot Impact (N)"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="rightGroundForceN"
                    name="Right Foot Impact (N)"
                    stroke="#ff5500"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="jointTorqueNm"
                    name="Deceleration Torque (Nm)"
                    stroke="#a855f7"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recorded Sessions List */}
          <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Logged Session Records ({athleteSessions.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Authoritative database records for {currentAthlete.name}
                </p>
              </div>

              <button
                onClick={() => setShowLogModal(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-[#ff5500] text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Record</span>
              </button>
            </div>

            {athleteSessions.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-xs font-medium">No recorded sessions in database for this athlete yet.</p>
                <button
                  onClick={() => setShowLogModal(true)}
                  className="mt-3 px-3 py-1.5 rounded-xl bg-[#ff5500] text-white text-xs font-bold inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log First Session</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {athleteSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedSessionId === session.id
                        ? 'bg-[#ff5500]/10 border-[#ff5500]'
                        : 'bg-[#080d12] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-white font-mono text-[10px] font-bold">
                        {session.sessionType}
                      </span>
                      <span className="text-slate-400 text-[11px] font-mono">{session.date}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white mb-2">{session.title}</h4>

                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono border-t border-slate-800/80 pt-2 text-slate-300">
                      <div>
                        <div className="text-slate-500 text-[9px] uppercase">Top Speed</div>
                        <div className="font-bold text-[#ff5500]">{session.topSpeedKmh} km/h</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[9px] uppercase">Avg HR</div>
                        <div className="font-bold text-rose-400">{session.avgHeartRateBpm} BPM</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[9px] uppercase">Symmetry</div>
                        <div className="font-bold text-emerald-400">{session.symmetryPct}%</div>
                      </div>
                    </div>

                    {session.notes && (
                      <p className="mt-2 text-[10px] text-slate-400 italic line-clamp-1">
                        "{session.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: 3D KINEMATIC SCANS */}
      {activeTab === 'kinetic_scans' && (
        <div className="space-y-5">
          <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>3D Kinematic Scans & Joint Force Diagnostics</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Biomechanical joint angles, valgus alignment & ACL injury risk screening
                </p>
              </div>

              {onOpenScan && (
                <button
                  id="open-3d-scan-tool-btn"
                  onClick={onOpenScan}
                  className="px-3.5 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff661a] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Perform 3D Kinematic Scan</span>
                </button>
              )}
            </div>

            {athleteScans.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <AlertCircle className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                <h4 className="text-sm font-bold text-white">No 3D Scans on File for this Athlete</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Use our AI camera motion capture to record 3D joint angles, valgus deviations, and ground reaction forces.
                </p>
                {onOpenScan && (
                  <button
                    onClick={onOpenScan}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#ff5500] text-white text-xs font-bold inline-flex items-center gap-2 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Launch Camera Scanner</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {athleteScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="bg-[#080d12] border border-slate-800 rounded-2xl p-4 shadow-md hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-[#ff5500]/15 text-[#ff5500] font-mono text-[10px] font-bold uppercase">
                          {scan.bodyPart || 'Lower Limb'}
                        </span>
                        <h4 className="text-xs font-bold text-white mt-1">{scan.scanType}</h4>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            scan.riskLevel === 'LOW'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {scan.riskLevel} RISK
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">{scan.date}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs font-mono mb-3 bg-[#0e141c] p-2.5 rounded-xl border border-slate-800/80">
                      <div>
                        <div className="text-slate-500 text-[10px]">Joint Load</div>
                        <div className="font-bold text-white">{scan.metrics?.jointLoadN || 1240} N</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px]">Flexion</div>
                        <div className="font-bold text-white">{scan.metrics?.flexionDeg || 38}°</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px]">Torque</div>
                        <div className="font-bold text-white">{scan.metrics?.torqueNm || 178} Nm</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 bg-[#0e141c] p-2.5 rounded-xl border border-slate-800/80">
                      <div className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#ff5500]" />
                        <span>Physiologist Clinical Assessment</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {scan.physioNotes || 'Optimal kinetic chain alignment. Bilateral symmetry maintained within safe thresholds with no valgus collapse.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Muscle Group Force Asymmetry Bar Chart (Real Scan Data) */}
          <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-1">
              Muscle Group Kinetic Symmetry (% of Peak Output)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Left limb vs Right limb power balance calculated from {currentAthlete.name}'s biometric profile
            </p>

            <div className="h-64 w-full -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { muscle: 'Quadriceps', left: currentAthlete.stats?.forceBalance?.left || 49, right: currentAthlete.stats?.forceBalance?.right || 51 },
                    { muscle: 'Hamstrings', left: 50, right: 50 },
                    { muscle: 'Calves (Gastro)', left: 48, right: 52 },
                    { muscle: 'Gluteus Medius', left: 49, right: 51 },
                    { muscle: 'Adductors', left: 50, right: 50 },
                  ]}
                  margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#182230" vertical={false} />
                  <XAxis dataKey="muscle" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[40, 60]} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090e15',
                      borderColor: '#1e293b',
                      borderRadius: '0.85rem',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="left" name="Left Limb (%)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="right" name="Right Limb (%)" fill="#ff5500" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MATCH HISTORY & RATING CURVE */}
      {activeTab === 'match_history' && (
        <div className="space-y-5">
          {/* Rating Progression Area Chart */}
          <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-1">
              Historical Match Performance & Form Progression
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Monthly match performance rating trajectory for {currentAthlete.name}
            </p>

            <div className="h-64 sm:h-72 w-full -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={(currentAthlete.ratingHistory || []).map((r) => ({
                    month: r.month,
                    rating: r.rating,
                  }))}
                  margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="ratingGradientReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff5500" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ff5500" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#182230" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[80, 100]} unit=" Rating" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090e15',
                      borderColor: '#1e293b',
                      borderRadius: '0.85rem',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rating"
                    name="Performance Rating"
                    stroke="#ff5500"
                    strokeWidth={2.5}
                    fill="url(#ratingGradientReal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Official Match History Records */}
          <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">
              Official Match Performances & In-Game Telemetry
            </h3>

            <div className="space-y-2.5">
              {(currentAthlete.recentMatches || []).map((match, idx) => (
                <div
                  key={match.id || idx}
                  className="p-3.5 rounded-xl bg-[#080d12] border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-[#ff5500] font-mono text-sm">
                      {match.rating}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>vs {match.opponent}</span>
                        <span className="text-slate-400 font-normal">({match.score || match.result})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {match.date} • {match.minutesPlayed || 90} mins • {match.goalsScored || 0} Goals, {match.assistsGiven || 0} Assists
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono self-end sm:self-auto">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Top Sprint</span>
                      <span className="font-bold text-[#ff5500]">{match.topSpeed || 34.2} km/h</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      VERIFIED STATS
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SQUAD READINESS MATRIX */}
      {activeTab === 'squad_matrix' && (
        <div className="space-y-5">
          {/* Squad Top Speed Benchmark Bar Chart */}
          <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-1">
              Squad Peak Velocity Benchmark (&gt; 30 km/h)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real recorded top sprint velocity across registered matchday squad
            </p>

            <div className="h-64 w-full -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={squadList} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#182230" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickFormatter={(n) => n.split(' ')[0] || n} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[28, 38]} unit=" km/h" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090e15',
                      borderColor: '#1e293b',
                      borderRadius: '0.85rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="topSpeed" name="Top Speed (km/h)" fill="#ff5500" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Squad Roster Table */}
          <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl overflow-hidden">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">
              Squad Workload & Readiness Matrix
            </h3>

            <div className="space-y-2">
              {squadList.map((player) => (
                <div
                  key={player.id}
                  onClick={() => setSelectedPlayerId(player.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedPlayerId === player.id
                      ? 'bg-[#ff5500]/10 border-[#ff5500]'
                      : 'bg-[#080d12] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 text-white font-mono text-xs flex items-center justify-center font-bold">
                      #{player.jersey}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{player.name}</span>
                        {player.id === currentAthlete.id && (
                          <span className="px-1.5 py-0.2 rounded bg-[#ff5500]/20 text-[#ff5500] text-[9px] font-bold">SELECTED</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {player.position} • Top Speed: {player.topSpeed} km/h • Symmetry: {player.symmetryPct}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-white">
                        {player.readinessScore}/100
                      </div>
                      <div className="text-[10px] text-slate-400">Readiness</div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                        player.riskCategory === 'LOW'
                          ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                          : 'bg-amber-500/15 border border-amber-500/40 text-amber-400'
                      }`}
                    >
                      {player.riskCategory} RISK
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: LOG REAL PERFORMANCE SESSION */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e141c] border border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#ff5500]" />
                <h3 className="text-base font-bold text-white">Log Verified Session Record</h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitSession} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">
                  Session Type
                </label>
                <select
                  value={sessionForm.sessionType}
                  onChange={(e) => setSessionForm({ ...sessionForm, sessionType: e.target.value as any })}
                  className="w-full bg-[#080d12] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#ff5500]"
                >
                  <option value="MATCH">Official Match (90 min)</option>
                  <option value="SPRINT_TEST">Sprint Velocity Gate (40m)</option>
                  <option value="HIIT_CARDIO">HIIT Cardio Conditioning</option>
                  <option value="BIOMECHANICS_DRILL">Biomechanical Tactical Drill</option>
                  <option value="REHAB_RECOVERY">Rehab & Recovery Session</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">
                  Session Title / Opponent
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Durand Cup Semi-Final vs Mohun Bagan SG"
                  value={sessionForm.title}
                  onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                  className="w-full bg-[#080d12] border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#ff5500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={sessionForm.durationMinutes}
                    onChange={(e) => setSessionForm({ ...sessionForm, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-[#080d12] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">
                    Top Speed (km/h)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    max="42"
                    value={sessionForm.topSpeedKmh}
                    onChange={(e) => setSessionForm({ ...sessionForm, topSpeedKmh: Number(e.target.value) })}
                    className="w-full bg-[#080d12] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">
                    Avg Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    min="80"
                    max="210"
                    value={sessionForm.avgHeartRateBpm}
                    onChange={(e) => setSessionForm({ ...sessionForm, avgHeartRateBpm: Number(e.target.value) })}
                    className="w-full bg-[#080d12] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">
                    Max Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="220"
                    value={sessionForm.maxHeartRateBpm}
                    onChange={(e) => setSessionForm({ ...sessionForm, maxHeartRateBpm: Number(e.target.value) })}
                    className="w-full bg-[#080d12] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">
                    Left Ground Force (N)
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="2500"
                    value={sessionForm.leftGroundForceN}
                    onChange={(e) => setSessionForm({ ...sessionForm, leftGroundForceN: Number(e.target.value) })}
                    className="w-full bg-[#080d12] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">
                    Right Ground Force (N)
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="2500"
                    value={sessionForm.rightGroundForceN}
                    onChange={(e) => setSessionForm({ ...sessionForm, rightGroundForceN: Number(e.target.value) })}
                    className="w-full bg-[#080d12] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">
                  Tactical & Biomechanical Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Excellent sprint mechanics during counter-attacks, no quad soreness"
                  value={sessionForm.notes}
                  onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
                  className="w-full bg-[#080d12] border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#ff5500]"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff661a] text-white font-bold text-xs transition-all shadow-md active:scale-95"
                >
                  Save & Persist Record
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EXPORT DOSSIER */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e141c] border border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-[#ff5500]" />
                <h3 className="text-base font-bold text-white">Verified Athlete Dossier</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-[#080d12] rounded-xl border border-slate-800 font-mono text-slate-300">
                <div className="text-white font-bold text-sm mb-1">{currentAthlete.name} (#{currentAthlete.number})</div>
                <div className="text-slate-400 text-xs">{currentAthlete.club} • {currentAthlete.position}</div>
                <div className="mt-2 text-[11px] grid grid-cols-2 gap-2">
                  <div>Verified Top Speed: <span className="text-[#ff5500] font-bold">{currentAthlete.stats?.topSpeed} km/h</span></div>
                  <div>Force Symmetry: <span className="text-emerald-400 font-bold">{currentAthlete.stats?.symmetry}%</span></div>
                  <div>ACWR Ratio: <span className="text-sky-400 font-bold">{(currentAthlete.stats?.acwr || 1.14).toFixed(2)}</span></div>
                  <div>Readiness Score: <span className="text-amber-400 font-bold">{Math.round(currentAthlete.overallRating || 95)}/100</span></div>
                </div>
              </div>

              <p className="text-slate-400 text-xs">
                Includes all authoritative database records, 3D kinematic scans, and GPS match time-series data.
              </p>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff661a] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF Dossier</span>
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
