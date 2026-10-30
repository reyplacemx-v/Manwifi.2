'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, Globe, RefreshCw, CheckCircle2, Plus, Power } from 'lucide-react';

interface VpnProfile {
  id: string;
  name: string;
  provider: string;
  server: string;
  protocol: 'WireGuard' | 'OpenVPN' | 'IKEv2';
  active: boolean;
}

export default function VpnManagerView() {
  const [vpnList, setVpnList] = useState<VpnProfile[]>([
    { id: 'vpn-1', name: 'NexusWave Secure Gateway (CDMX)', provider: 'Enterprise WireGuard', server: 'cgw-mex.nexuswave.net:51820', protocol: 'WireGuard', active: true },
    { id: 'vpn-2', name: 'CFE Telemetría Encriptada', provider: 'OpenVPN Enterprise', server: 'vpn.cfe-grid.gob.mx:1194', protocol: 'OpenVPN', active: false }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [server, setServer] = useState('');
  const [protocol, setProtocol] = useState<VpnProfile['protocol']>('WireGuard');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleToggleVpn = (id: string) => {
    setVpnList(prev => prev.map(v => v.id === id ? { ...v, active: !v.active } : v));
    setSuccessMsg('Estado de conexión VPN actualizado exitosamente.');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleAddVpn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !server.trim()) return;

    const newVpn: VpnProfile = {
      id: `vpn-${Date.now()}`,
      name,
      provider: 'Custom Provider',
      server,
      protocol,
      active: false
    };

    setVpnList(prev => [...prev, newVpn]);
    setName('');
    setServer('');
    setShowAddModal(false);
    setSuccessMsg('Perfil VPN añadido con éxito.');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Lock className="w-6 h-6 text-cyan-400" /> Configuración y Gestión de Conexiones VPN
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestione túneles VPN cifrados (WireGuard, OpenVPN, IKEv2) para proteger la privacidad y el tráfico de los enlaces de red.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Añadir Perfil VPN
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* VPN Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vpnList.map((vpn) => (
          <div key={vpn.id} className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-[10px] font-semibold">
                    {vpn.protocol}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-2">{vpn.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">{vpn.server}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${vpn.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {vpn.active ? 'Conectado' : 'Desconectado'}
                </div>
              </div>

              <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between"><span className="text-slate-500">Cifrado:</span> <span className="font-mono text-emerald-400">ChaCha20 / AES-256</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Kill Switch:</span> <span className="font-mono text-cyan-400">Habilitado</span></div>
              </div>
            </div>

            <button
              onClick={() => handleToggleVpn(vpn.id)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                vpn.active ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
              }`}
            >
              <Power className="w-4 h-4" />
              {vpn.active ? 'Desactivar Túnel VPN' : 'Activar Túnel VPN'}
            </button>
          </div>
        ))}
      </div>

      {/* Add VPN Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fadeIn space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Configurar Nuevo Proveedor VPN</h3>
            <p className="text-xs text-slate-400">Introduzca los detalles del servidor y credenciales de acceso.</p>

            <form onSubmit={handleAddVpn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre del Perfil</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. VPN Oficina Central"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Servidor (Host:Puerto)</label>
                <input 
                  type="text"
                  required
                  placeholder="vpn.example.com:51820"
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Protocolo</label>
                <select
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="WireGuard">WireGuard</option>
                  <option value="OpenVPN">OpenVPN</option>
                  <option value="IKEv2">IKEv2</option>
                </select>
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
                  Guardar y Conectar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
