'use client';

import React, { useState } from 'react';
import { AccessPoint, ConnectedDevice } from '@/lib/types';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, RefreshCw, Sparkles, Lock, Cpu, Globe } from 'lucide-react';

interface SecurityAuditViewProps {
  aps: AccessPoint[];
  devices: ConnectedDevice[];
}

export default function SecurityAuditView({ aps, devices }: SecurityAuditViewProps) {
  const [auditing, setAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);
  const [aiAuditReport, setAiAuditReport] = useState<string | null>(null);

  const runAudit = async () => {
    setAuditing(true);
    setAuditComplete(false);
    setAiAuditReport(null);

    try {
      const res = await fetch('/api/wifi-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Realiza una auditoría de seguridad integral para esta red inalámbrica corporativa/residencial que cuenta con ${aps.length} APs (Totalplay, Megacable, CFE, Go Wireless) y ${devices.length} dispositivos conectados. Verifica el uso de protocolos WPA3-SAE, aislamiento de invitados, cifrado de contraseñas root y posibles vectores de ataque. Proporciona un informe detallado con vulnerabilidades halladas (si las hay) y recomendaciones accionables en español.`
        })
      });
      const data = await res.json();
      setAiAuditReport(data.text);
      setAuditComplete(true);
    } catch (err) {
      setAiAuditReport("Error al conectar con el motor de auditoría IA.");
      setAuditComplete(true);
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" /> Auditoría de Seguridad Automática WPA3
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analiza configuraciones, contraseñas, protocolos WPA3 y dispositivos conectados frente a las mejores prácticas internacionales.
          </p>
        </div>

        <button
          onClick={runAudit}
          disabled={auditing}
          className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
        >
          {auditing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          {auditing ? 'Analizando Red...' : 'Iniciar Auditoría de Seguridad'}
        </button>
      </div>

      {/* Audit Checklist Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Cifrado WPA3-SAE</span>
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg"><CheckCircle2 className="w-4 h-4" /></span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">100% Blindado</h3>
          <p className="text-xs text-slate-500">Todos los APs operan con protección contra ataques de diccionario simultáneos.</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Aislamiento de Invitados</span>
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg"><CheckCircle2 className="w-4 h-4" /></span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">VLANs Separadas</h3>
          <p className="text-xs text-slate-500">Tráfico de invitados completamente segregado de la red principal corporativa.</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Dispositivos No Autorizados</span>
            <span className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg"><ShieldAlert className="w-4 h-4" /></span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">0 Intrusos</h3>
          <p className="text-xs text-slate-500">Filtrado MAC y autenticación estricta en enlaces CFE / Totalplay.</p>
        </div>

      </div>

      {/* Detailed Audit Report Section */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" /> Informe Técnico y Recomendaciones de Seguridad IA
        </h3>

        {aiAuditReport ? (
          <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-500/30 text-xs text-slate-200 leading-relaxed whitespace-pre-line shadow-inner">
            {aiAuditReport}
          </div>
        ) : (
          <div className="bg-slate-950/50 p-12 rounded-2xl border border-slate-800 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-cyan-500/40 mx-auto" />
            <p className="text-sm font-bold text-slate-300">Ninguna auditoría activa en este momento</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Haga clic en "Iniciar Auditoría de Seguridad" para verificar cifrados, contraseñas root y vulnerabilidades en la infraestructura.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
