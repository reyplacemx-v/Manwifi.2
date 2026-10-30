'use client';

import React, { useState } from 'react';
import { GuestNetwork } from '@/lib/types';
import { Users, Wifi, QrCode, ShieldCheck, Clock, Download, Upload, Plus, Check } from 'lucide-react';

interface GuestNetworksViewProps {
  guestNetworks: GuestNetwork[];
  onToggleGuest: (id: string) => void;
  onAddGuest: (newGuest: GuestNetwork) => void;
}

export default function GuestNetworksView({ guestNetworks, onToggleGuest, onAddGuest }: GuestNetworksViewProps) {
  const [showQrModal, setShowQrModal] = useState<GuestNetwork | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New guest form
  const [ssid, setSsid] = useState('NexusWave_Visitas_2026');
  const [password, setPassword] = useState('GuestPass#2026!');
  const [limitDown, setLimitDown] = useState(40);
  const [limitUp, setLimitUp] = useState(15);
  const [duration, setDuration] = useState(8);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ssid.trim()) return;

    const newGuest: GuestNetwork = {
      id: `guest-${Date.now()}`,
      ssid,
      password,
      enabled: true,
      bandwidthLimitDown: limitDown,
      bandwidthLimitUp: limitUp,
      durationHours: duration,
      activeGuests: 0,
      security: 'WPA3-Guest',
      vlan: 30
    };

    onAddGuest(newGuest);
    setShowAddModal(false);
  };

  const copyPassword = (pwd: string, id: string) => {
    navigator.clipboard.writeText(pwd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" /> Redes de Invitados con Generador QR Integrado
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de SSIDs de invitados con aislamiento de VLAN, control de ancho de banda y código QR único por red.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Crear Red de Invitados
        </button>
      </div>

      {/* Guest Networks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guestNetworks.map((net) => {
          const isCopied = copiedId === net.id;
          return (
            <div key={net.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
              
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-100">{net.ssid}</h3>
                      <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded text-[10px] font-mono">
                        VLAN {net.vlan}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Seguridad: <span className="text-emerald-400 font-semibold">{net.security}</span></p>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => onToggleGuest(net.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      net.enabled 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {net.enabled ? 'Activa' : 'Desactivada'}
                  </button>
                </div>

                {/* Password & QR Widget Box */}
                <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500">Contraseña WPA3 Guest</p>
                    <p className="font-mono text-sm font-bold text-cyan-300">{net.password}</p>
                    <button
                      onClick={() => copyPassword(net.password, net.id)}
                      className="mt-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Wifi className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Contraseña Copiada' : 'Copiar Clave'}</span>
                    </button>
                  </div>

                  {/* Embedded QR Generator Box */}
                  <div className="bg-white p-2.5 rounded-xl border border-cyan-500/30 flex flex-col items-center shadow-md">
                    <div className="w-20 h-20 bg-slate-950 rounded-lg flex items-center justify-center text-cyan-400">
                      <QrCode className="w-14 h-14" />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-slate-900 mt-1">Escanear WiFi</span>
                  </div>
                </div>

                {/* Limits */}
                <div className="grid grid-cols-3 gap-3 mt-4 text-xs text-slate-300">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] flex items-center gap-1">
                      <Download className="w-3 h-3 text-cyan-400" /> Límite Down
                    </span>
                    <p className="font-bold text-slate-200 mt-1">{net.bandwidthLimitDown} Mbps</p>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] flex items-center gap-1">
                      <Upload className="w-3 h-3 text-blue-400" /> Límite Up
                    </span>
                    <p className="font-bold text-slate-200 mt-1">{net.bandwidthLimitUp} Mbps</p>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> Duración
                    </span>
                    <p className="font-bold text-slate-200 mt-1">{net.durationHours} hrs</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Invitados Conectados Ahora:</span>
                <span className="font-bold text-cyan-400">{net.activeGuests} usuarios</span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Guest Network Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-100 mb-2">Crear Red de Invitados</h3>
            <p className="text-xs text-slate-400 mb-4">Configure parámetros de seguridad WPA3 y límites de ancho de banda.</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre SSID Invitados</label>
                <input 
                  type="text"
                  required
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña WPA3</label>
                <input 
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Límite Down (Mbps)</label>
                  <input 
                    type="number"
                    value={limitDown}
                    onChange={(e) => setLimitDown(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Límite Up (Mbps)</label>
                  <input 
                    type="number"
                    value={limitUp}
                    onChange={(e) => setLimitUp(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  Crear Red
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
