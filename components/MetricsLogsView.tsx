'use client';

import React from 'react';
import { NetworkLog } from '@/lib/types';
import { BarChart3, ShieldAlert, ShieldCheck, AlertTriangle, Info, CheckCircle2, Clock } from 'lucide-react';

interface MetricsLogsViewProps {
  logs: NetworkLog[];
}

export default function MetricsLogsView({ logs }: MetricsLogsViewProps) {
  const getLogIcon = (type: NetworkLog['type']) => {
    switch (type) {
      case 'security': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'success': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      default: return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getLogBadge = (type: NetworkLog['type']) => {
    switch (type) {
      case 'security': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'warning': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'success': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default: return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" /> Auditoría de Red y Métricas de Seguridad
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Registro en tiempo real de eventos WPA3, asociaciones de dispositivos y optimizaciones de infraestructura.
          </p>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <p className="text-xs font-semibold text-slate-400 uppercase">Integridad WPA3 Enterprise</p>
          <div className="flex items-baseline space-x-2 mt-3">
            <h3 className="text-3xl font-extrabold text-emerald-400">100%</h3>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Sin vulnerabilidades</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Protección SAE activa en todos los nodos WISP</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <p className="text-xs font-semibold text-slate-400 uppercase">Eventos Bloqueados (24h)</p>
          <div className="flex items-baseline space-x-2 mt-3">
            <h3 className="text-3xl font-extrabold text-cyan-400">12</h3>
            <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">MACs extrañas repelidas</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Filtrado estricto en perímetro CFE / Megacable</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <p className="text-xs font-semibold text-slate-400 uppercase">Disponibilidad (Uptime)</p>
          <div className="flex items-baseline space-x-2 mt-3">
            <h3 className="text-3xl font-extrabold text-blue-400">99.99%</h3>
            <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Fibra Simétrica 10G</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Enlace estable Totalplay / CFE</p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" /> Registro de Actividad y Alertas de Seguridad
          </h3>
          <p className="text-xs text-slate-400">Historial detallado para mantenimiento técnico eficiente.</p>
        </div>

        <div className="divide-y divide-slate-800/80">
          {logs.map((log) => (
            <div key={log.id} className="p-5 hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className={`p-2.5 rounded-xl border ${getLogBadge(log.type)}`}>
                  {getLogIcon(log.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-slate-200">{log.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getLogBadge(log.type)}`}>
                      {log.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{log.description}</p>
                </div>
              </div>

              <div className="text-right md:text-right text-xs">
                <p className="font-medium text-cyan-400">{log.source}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
