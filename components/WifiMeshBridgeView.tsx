'use client';

import React, { useState } from 'react';
import { AccessPoint, ConnectedDevice } from '@/lib/types';
import { Globe, Radio, Wifi, ShieldCheck, Zap, RefreshCw, CheckCircle2, ArrowRightLeft, Shield, Lock, Smartphone } from 'lucide-react';

interface WifiMeshBridgeViewProps {
  aps: AccessPoint[];
  devices: ConnectedDevice[];
  onForceReconnect: (deviceId: string) => void;
  onAddBridgeNode: (newNode: AccessPoint) => void;
}

export default function WifiMeshBridgeView({ aps, devices, onForceReconnect, onAddBridgeNode }: WifiMeshBridgeViewProps) {
  const [bridgingStatus, setBridgingStatus] = useState<string | null>(null);
  const [forcingId, setForcingId] = useState<string | null>(null);
  const [showBridgeModal, setShowBridgeModal] = useState(false);

  // New Bridge Form
  const [bridgeName, setBridgeName] = useState('Puente Mesa Extremo - Bodega B');
  const [sourceIsp, setSourceIsp] = useState<'Totalplay Fiber' | 'Go Wireless Pro'>('Totalplay Fiber');
  const [targetExtender, setTargetExtender] = useState('Go Wireless Outdoor WDS 6GHz');

  const handleCreateBridge = (e: React.FormEvent) => {
    e.preventDefault();
    const newAp: AccessPoint = {
      id: `bridge-${Date.now()}`,
      name: bridgeName,
      provider: sourceIsp,
      model: targetExtender,
      ip: `192.168.1.${Math.floor(Math.random() * 50 + 50)}`,
      mac: `55:12:88:${Math.floor(Math.random()*89+10)}:${Math.floor(Math.random()*89+10)}:${Math.floor(Math.random()*89+10)}`,
      channel24: 6,
      channel5: 149,
      channel6: 45,
      power24: 'High',
      power5: 'High',
      status: 'online',
      connectedClients: 4,
      temperature: 39.5,
      firmware: 'WDS-Mesh-v3.2-WPA3',
      securityMode: 'WPA3-SAE',
      uptime: 'Justo ahora'
    };

    onAddBridgeNode(newAp);
    setBridgingStatus('¡Puente WiFi WDS configurado exitosamente entre Totalplay y Go Wireless! Cobertura extendida a zona sin cableado.');
    setShowBridgeModal(false);
  };

  const triggerForceReconnect = (deviceId: string, devName: string) => {
    setForcingId(deviceId);
    setTimeout(() => {
      onForceReconnect(deviceId);
      setForcingId(null);
      setBridgingStatus(`Conexión forzada con éxito para ${devName}. Reautenticación WPA3-SAE completada.`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Globe className="w-6 h-6 text-cyan-400" /> Puentes WiFi Tipo Mesa & Mesh WDS (Totalplay ⇄ Go Wireless)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Conecte nodos inalámbricos para llevar internet de alta velocidad a zonas remotas sin cableado, facilitando el acceso total bajo WPA3.
          </p>
        </div>

        <button
          onClick={() => setShowBridgeModal(true)}
          className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <ArrowRightLeft className="w-4 h-4" /> Crear Puente WDS Nuevo
        </button>
      </div>

      {bridgingStatus && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{bridgingStatus}</span>
          </div>
          <button onClick={() => setBridgingStatus(null)} className="text-emerald-400 font-bold hover:underline">Cerrar</button>
        </div>
      )}

      {/* Bridge Topology Visualizer */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Radio className="w-5 h-5 text-cyan-400" /> Topología de Enlace WDS (Totalplay Fiber ➔ Go Wireless Mesh)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold rounded">FUENTE ISP</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">Totalplay 10G Gateway</h4>
            <p className="text-xs text-slate-400">Salida troncal de fibra óptica principal con cifrado WPA3.</p>
            <div className="pt-2 border-t border-slate-900 flex justify-between text-xs font-mono text-slate-400">
              <span>IP: 192.168.1.1</span>
              <span className="text-emerald-400">940 Mbps</span>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-cyan-500/40 space-y-3 relative flex flex-col justify-between shadow-lg shadow-cyan-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-extrabold">
              PUENTE MESA / WDS
            </div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded">EXTENSOR ACTIVO</span>
              <Wifi className="w-5 h-5 text-cyan-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-100">Go Wireless Pro Outdoor WDS</h4>
            <p className="text-xs text-slate-400">Reenvío inalámbrico de señal hacia zonas sin cableado Ethernet.</p>
            <div className="pt-2 border-t border-slate-900 flex justify-between text-xs font-mono text-slate-400">
              <span>Banda: 6GHz WPA3</span>
              <span className="text-cyan-400">Latencia 3ms</span>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded">ZONA REMOTA</span>
              <Smartphone className="w-5 h-5 text-blue-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-100">Estaciones de Trabajo / IoT</h4>
            <p className="text-xs text-slate-400">Dispositivos conectados en áreas antes inaccesibles.</p>
            <div className="pt-2 border-t border-slate-900 flex justify-between text-xs font-mono text-slate-400">
              <span>Señal: -45 dBm</span>
              <span className="text-emerald-400">Conectado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Force Connection Section */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" /> Herramienta de Forzar Conexión y Roaming WPA3
            </h3>
            <p className="text-xs text-slate-400">Obligue a dispositivos con señal débil o desconectados a reasociarse inmediatamente al puente Go Wireless más cercano.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase bg-slate-950/50">
                <th className="py-3 px-4">Dispositivo</th>
                <th className="py-3 px-4">IP / MAC</th>
                <th className="py-3 px-4">Señal Actual</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción de Forzado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {devices.map((dev) => (
                <tr key={dev.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-200">{dev.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{dev.ip} ({dev.mac})</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">{dev.signalStrength} dBm</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px]">
                      {dev.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => triggerForceReconnect(dev.id, dev.name)}
                      disabled={forcingId === dev.id}
                      className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl font-semibold flex items-center gap-1.5 ml-auto cursor-pointer transition-all"
                    >
                      {forcingId === dev.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                      {forcingId === dev.id ? 'Forzando...' : 'Forzar Conexión WPA3'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bridge Modal */}
      {showBridgeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fadeIn space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Configurar Nuevo Puente WDS Mesa</h3>
            <p className="text-xs text-slate-400">Enlace Totalplay con Go Wireless para extender cobertura a lugares sin internet.</p>

            <form onSubmit={handleCreateBridge} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre del Puente</label>
                <input 
                  type="text"
                  required
                  value={bridgeName}
                  onChange={(e) => setBridgeName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Red Troncal de Origen</label>
                <select
                  value={sourceIsp}
                  onChange={(e) => setSourceIsp(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Totalplay Fiber">Totalplay Fiber 10G</option>
                  <option value="Go Wireless Pro">Go Wireless Pro Master</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Dispositivo Extensor WDS</label>
                <input 
                  type="text"
                  required
                  value={targetExtender}
                  onChange={(e) => setTargetExtender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBridgeModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  Establecer Puente WDS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
