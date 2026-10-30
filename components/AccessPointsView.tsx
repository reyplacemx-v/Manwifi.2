'use client';

import React, { useState } from 'react';
import { AccessPoint } from '@/lib/types';
import { Radio, ShieldCheck, Cpu, RefreshCw, Power, Thermometer, Plus, CheckCircle2, Wifi, Zap } from 'lucide-react';

interface AccessPointsViewProps {
  aps: AccessPoint[];
  onRebootAp: (apId: string) => void;
  onOptimizeChannels: (apId: string) => void;
  onAddAp: (newAp: AccessPoint) => void;
}

export default function AccessPointsView({ aps, onRebootAp, onOptimizeChannels, onAddAp }: AccessPointsViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [rebootingId, setRebootingId] = useState<string | null>(null);
  const [optimizingId, setOptimizingId] = useState<string | null>(null);

  // New AP Form
  const [apName, setApName] = useState('');
  const [apProvider, setApProvider] = useState<AccessPoint['provider']>('Totalplay Fiber');
  const [apModel, setApModel] = useState('TP-Link Omada EAP773');
  const [apIp, setApIp] = useState('192.168.1.10');

  const handleReboot = (id: string) => {
    setRebootingId(id);
    setTimeout(() => {
      onRebootAp(id);
      setRebootingId(null);
    }, 1500);
  };

  const handleOptimize = (id: string) => {
    setOptimizingId(id);
    setTimeout(() => {
      onOptimizeChannels(id);
      setOptimizingId(null);
    }, 1200);
  };

  const handleCreateAp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apName.trim()) return;

    const newAp: AccessPoint = {
      id: `ap-${Date.now()}`,
      name: apName,
      provider: apProvider,
      model: apModel,
      ip: apIp,
      mac: `74:83:52:${Math.floor(Math.random()*89+10)}:${Math.floor(Math.random()*89+10)}:${Math.floor(Math.random()*89+10)}`,
      channel24: 1,
      channel5: 48,
      channel6: 37,
      power24: 'High',
      power5: 'High',
      status: 'online',
      connectedClients: 0,
      temperature: 38.0,
      firmware: 'v2.1.0-WPA3',
      securityMode: 'WPA3-SAE',
      uptime: '1 min'
    };

    onAddAp(newAp);
    setApName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-6 h-6 text-cyan-400" /> Control Remoto de Puntos de Acceso (AP)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestión centralizada de infraestructura WISP y fibra (Totalplay, Megacable, CFE, Go Wireless) con cifrado WPA3.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Agregar Nuevo AP / Nodo
        </button>
      </div>

      {/* AP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aps.map((ap) => (
          <div key={ap.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
            
            {/* Top Info */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-[10px] font-semibold">
                    {ap.provider}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-2">{ap.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{ap.model} • IP: {ap.ip}</p>
                </div>
                <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Online</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-3 mt-5 bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <p className="text-slate-500 text-[10px]">Canales WiFi</p>
                  <p className="font-mono font-semibold text-slate-200 mt-0.5">2.4G:{ap.channel24} | 5G:{ap.channel5}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px]">Clientes</p>
                  <p className="font-mono font-semibold text-cyan-400 mt-0.5">{ap.connectedClients} activos</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px]">Temperatura</p>
                  <p className="font-mono font-semibold text-emerald-400 mt-0.5 flex items-center gap-1">
                    <Thermometer className="w-3 h-3" /> {ap.temperature}°C
                  </p>
                </div>
              </div>

              {/* Security & Firmware */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" /> {ap.securityMode}
                </div>
                <div className="font-mono text-[11px] text-slate-500">
                  FW: {ap.firmware}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => handleOptimize(ap.id)}
                disabled={optimizingId === ap.id}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {optimizingId === ap.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                {optimizingId === ap.id ? 'Optimizando...' : 'Optimizar Canales'}
              </button>

              <button
                onClick={() => handleReboot(ap.id)}
                disabled={rebootingId === ap.id}
                className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {rebootingId === ap.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Power className="w-3.5 h-3.5" />}
                {rebootingId === ap.id ? 'Reiniciando...' : 'Reiniciar AP'}
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Add AP Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-100 mb-2">Registrar Nuevo Punto de Acceso</h3>
            <p className="text-xs text-slate-400 mb-4">Integre un nuevo AP WISP o de fibra a la red con protocolo WPA3.</p>

            <form onSubmit={handleCreateAp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre del AP</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. AP Bodega Principal"
                  value={apName}
                  onChange={(e) => setApName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Proveedor / Enlace</label>
                <select
                  value={apProvider}
                  onChange={(e) => setApProvider(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Totalplay Fiber">Totalplay Fiber</option>
                  <option value="Megacable Enterprise">Megacable Enterprise</option>
                  <option value="CFE Telemetría">CFE Telemetría</option>
                  <option value="Go Wireless Pro">Go Wireless Pro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Modelo del Hardware</label>
                <input 
                  type="text"
                  required
                  value={apModel}
                  onChange={(e) => setApModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Dirección IP</label>
                <input 
                  type="text"
                  required
                  value={apIp}
                  onChange={(e) => setApIp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
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
                  Añadir AP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
