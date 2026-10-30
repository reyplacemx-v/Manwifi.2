'use client';

import React, { useState } from 'react';
import { Bell, ShieldCheck, KeyRound, CheckCircle2, RefreshCw, Mail, Smartphone } from 'lucide-react';

interface AlertRule {
  id: string;
  name: string;
  description: string;
  push: boolean;
  email: boolean;
  enabled: boolean;
}

export default function AlertsManagerView() {
  const [rules, setRules] = useState<AlertRule[]>([
    { id: 'rule-1', name: 'Nuevos dispositivos detectados', description: 'Notificar al unirse un equipo desconocido a la red WPA3', push: true, email: true, enabled: true },
    { id: 'rule-2', name: 'Pérdida de conexión a internet', description: 'Alerta instantánea si cae el enlace Totalplay o CFE', push: true, email: true, enabled: true },
    { id: 'rule-3', name: 'Bajo rendimiento de velocidad', description: 'Notificar si la bajada baja de 300 Mbps', push: false, email: true, enabled: true },
    { id: 'rule-4', name: 'Intento de intrusión / MAC bloqueada', description: 'Alerta de seguridad por paquetes maliciosos', push: true, email: false, enabled: true },
  ]);

  const [tfaEnabled, setTfaEnabled] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const toggleRule = (id: string, type: 'push' | 'email' | 'enabled') => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, [type]: !r[type] } : r));
    setSuccessMsg('Configuración de alertas actualizada.');
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  const toggle2fa = () => {
    setTfaEnabled(!tfaEnabled);
    setSuccessMsg(!tfaEnabled ? 'Autenticación de Dos Factores (2FA) activada para todas las cuentas.' : '2FA desactivado.');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyan-400" /> Sistema de Alertas Personalizables & Autenticación 2FA
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestione notificaciones push/email para eventos de red y proteja las cuentas con autenticación de dos factores.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2FA Section Card */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
            <KeyRound className="w-8 h-8" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-semibold">
              SEGURIDAD REQUERIDA
            </span>
            <h3 className="text-lg font-bold text-slate-100 mt-2">Autenticación de Dos Factores (2FA - TOTP / SMS)</h3>
            <p className="text-xs text-slate-400 mt-1">Exigir código de verificación de 6 dígitos además de la contraseña para iniciar sesión en la plataforma.</p>
          </div>
        </div>

        <button
          onClick={toggle2fa}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            tfaEnabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          {tfaEnabled ? '2FA Activo (TOTP)' : 'Habilitar 2FA'}
        </button>
      </div>

      {/* Alert Rules Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" /> Reglas de Notificación de Eventos
          </h3>
          <p className="text-xs text-slate-400">Seleccione qué eventos disparan alertas Push o Email.</p>
        </div>

        <div className="divide-y divide-slate-800">
          {rules.map((rule) => (
            <div key={rule.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
              <div>
                <h4 className="text-sm font-bold text-slate-200">{rule.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{rule.description}</p>
              </div>

              <div className="flex items-center space-x-6 text-xs">
                {/* Push Toggle */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={rule.push}
                    onChange={() => toggleRule(rule.id, 'push')}
                    className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span className="text-slate-300 flex items-center gap-1"><Smartphone className="w-3.5 h-3.5 text-cyan-400" /> Push App</span>
                </label>

                {/* Email Toggle */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={rule.email}
                    onChange={() => toggleRule(rule.id, 'email')}
                    className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span className="text-slate-300 flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-400" /> Email</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
