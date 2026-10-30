'use client';

import React from 'react';
import { 
  Wifi, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Users, 
  KeyRound, 
  BarChart3, 
  Zap,
  Globe,
  Radio,
  Lock,
  BookOpen,
  Signal,
  Satellite,
  Bell
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  deviceCount: number;
  apCount: number;
  onOpenManual: () => void;
}

export default function Navbar({ activeTab, setActiveTab, deviceCount, apCount, onOpenManual }: NavbarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Red', icon: Wifi },
    { id: 'mesh', label: 'Puentes WiFi & Mesh WDS', icon: Globe },
    { id: 'satellite', label: 'Satélite & Internet Gratis', icon: Satellite },
    { id: 'vpn', label: 'Gestión VPN & Seguridad', icon: Lock },
    { id: 'alerts', label: 'Alertas & 2FA', icon: Bell },
    { id: 'heatmap', label: 'Mapa de Calor WiFi', icon: Signal },
    { id: 'audit', label: 'Auditoría WPA3', icon: ShieldCheck },
    { id: 'speedtest', label: 'Speed Test & Diagnóstico', icon: Zap },
    { id: 'aps', label: 'Puntos de Acceso (AP)', icon: Radio },
    { id: 'guests', label: 'Redes de Invitados', icon: Users },
    { id: 'vault', label: 'Bóveda de Credenciales', icon: KeyRound },
    { id: 'metrics', label: 'Métricas y Auditoría', icon: BarChart3 },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur-xl border-b border-cyan-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-75 animate-pulse"></div>
              <div className="relative bg-slate-950 p-2.5 rounded-xl border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
                <Wifi className="w-7 h-7" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                  NexusWave Pro
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> WPA3 Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gestión Inalámbrica • Totalplay • Megacable • CFE • Go Wireless
              </p>
            </div>
          </div>

          {/* Quick Stats & Manual Button */}
          <div className="flex items-center space-x-4">
            <div className="hidden xl:flex items-center space-x-6 bg-slate-950/60 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="text-slate-400">APs Online:</span>
                <span className="font-bold text-cyan-400">{apCount}</span>
              </div>
              <div className="h-4 w-px bg-slate-800"></div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Dispositivos:</span>
                <span className="font-bold text-sky-400">{deviceCount} Activos</span>
              </div>
            </div>

            <button
              onClick={onOpenManual}
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Manual Interactivo</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
