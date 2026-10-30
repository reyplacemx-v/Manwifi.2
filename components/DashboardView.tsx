'use client';

import React, { useState, useEffect } from 'react';
import { ConnectedDevice, AccessPoint } from '@/lib/types';
import { 
  Wifi, 
  ShieldAlert, 
  ShieldCheck, 
  Signal, 
  Smartphone, 
  Laptop, 
  Server, 
  Camera, 
  Router, 
  HardDrive, 
  Search, 
  SlidersHorizontal, 
  Lock, 
  Unlock, 
  Zap, 
  Activity, 
  AlertTriangle,
  CheckCircle2,
  Plus,
  RefreshCw,
  Sparkles,
  Radio,
  Clock,
  Calendar
} from 'lucide-react';

interface DashboardViewProps {
  devices: ConnectedDevice[];
  aps: AccessPoint[];
  onUpdateDeviceStatus: (deviceId: string, newStatus: 'online' | 'blocked' | 'guest') => void;
  onAddDevice: (newDev: ConnectedDevice) => void;
  onRunAiOptimization: () => void;
}

export default function DashboardView({ 
  devices, 
  aps, 
  onUpdateDeviceStatus, 
  onAddDevice,
  onRunAiOptimization 
}: DashboardViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<string | null>(null);

  // Recurring Schedule System State
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [scheduleTime, setScheduleTime] = useState('03:00');
  const [scheduleFrequency, setScheduleFrequency] = useState<'daily' | 'weekly'>('daily');
  const [scheduleTask, setScheduleTask] = useState<'optimization' | 'diagnostic' | 'both'>('both');
  const [scheduleSavedMsg, setScheduleSavedMsg] = useState(false);

  // New device form state
  const [newDevName, setNewDevName] = useState('');
  const [newDevIp, setNewDevIp] = useState('192.168.1.50');
  const [newDevType, setNewDevType] = useState<ConnectedDevice['type']>('smartphone');
  const [newDevAp, setNewDevAp] = useState(aps[0]?.id || 'ap-1');

  useEffect(() => {
    const saved = localStorage.getItem('nexuswave_schedule');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setScheduleEnabled(parsed.enabled);
          setScheduleTime(parsed.time);
          setScheduleFrequency(parsed.frequency);
          setScheduleTask(parsed.task);
        }, 0);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const config = { enabled: scheduleEnabled, time: scheduleTime, frequency: scheduleFrequency, task: scheduleTask };
    localStorage.setItem('nexuswave_schedule', JSON.stringify(config));
    setScheduleSavedMsg(true);
    setTimeout(() => setScheduleSavedMsg(false), 2500);
  };

  const filteredDevices = devices.filter(dev => {
    const matchesSearch = dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dev.ip.includes(searchTerm) ||
                          dev.mac.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || dev.type === filterType;
    return matchesSearch && matchesType;
  });

  const getDeviceIcon = (type: ConnectedDevice['type']) => {
    switch (type) {
      case 'smartphone': return <Smartphone className="w-5 h-5 text-cyan-400" />;
      case 'laptop': return <Laptop className="w-5 h-5 text-blue-400" />;
      case 'server': return <Server className="w-5 h-5 text-emerald-400" />;
      case 'camera': return <Camera className="w-5 h-5 text-amber-400" />;
      case 'router': return <Router className="w-5 h-5 text-purple-400" />;
      default: return <HardDrive className="w-5 h-5 text-slate-400" />;
    }
  };

  const getSignalBadge = (signal: number) => {
    if (signal >= -50) return { label: 'Excelente', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    if (signal >= -68) return { label: 'Bueno', color: 'bg-sky-500/10 text-sky-400 border-sky-500/30' };
    if (signal >= -78) return { label: 'Regular', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    return { label: 'Débil', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
  };

  const handleCreateDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevName.trim()) return;

    const newDevice: ConnectedDevice = {
      id: `dev-${Date.now()}`,
      name: newDevName,
      ip: newDevIp,
      mac: `aa:bb:cc:${Math.floor(Math.random()*89+10)}:${Math.floor(Math.random()*89+10)}:${Math.floor(Math.random()*89+10)}`,
      type: newDevType,
      apId: newDevAp,
      signalStrength: -48,
      linkSpeed: '1200 Mbps',
      frequency: '5 GHz',
      security: 'WPA3-SAE',
      downloadUsage: 1.2,
      uploadUsage: 0.4,
      status: 'online',
      connectedSince: 'Recién conectado'
    };

    onAddDevice(newDevice);
    setNewDevName('');
    setShowAddModal(false);
  };

  const triggerAiDiagnostic = async () => {
    setAiLoading(true);
    setAiDiagnosis(null);
    try {
      const res = await fetch('/api/wifi-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analiza el estado actual de la red con ${devices.length} dispositivos conectados y ${aps.length} puntos de acceso (Totalplay, Megacable, CFE, Go Wireless). Proporciona 3 recomendaciones clave para optimizar la intensidad de señal, canales y seguridad WPA3 en español.`
        })
      });
      const data = await res.json();
      setAiDiagnosis(data.text);
    } catch (err) {
      setAiDiagnosis("No se pudo conectar con el asistente de IA. Verifique su API Key de Gemini.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-cyan-400">
            <Wifi className="w-16 h-16" />
          </div>
          <p className="text-sm font-medium text-slate-400">Dispositivos Totales</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <h3 className="text-3xl font-extrabold text-slate-100">{devices.length}</h3>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
              {devices.filter(d => d.status === 'online').length} online
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Incluye IoT, Laptops y Servidores</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-400">
            <Radio className="w-16 h-16" />
          </div>
          <p className="text-sm font-medium text-slate-400">Puntos de Acceso Activos</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <h3 className="text-3xl font-extrabold text-slate-100">{aps.length}</h3>
            <span className="text-xs text-cyan-400 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded">
              WPA3 WISP / Fibra
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Totalplay, Megacable, CFE, Go Wireless</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-400">
            <ShieldCheck className="w-16 h-16" />
          </div>
          <p className="text-sm font-medium text-slate-400">Protocolo de Seguridad</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <h3 className="text-2xl font-extrabold text-emerald-400">WPA3-SAE</h3>
          </div>
          <p className="text-xs text-slate-500 mt-2">Cifrado robusto en 2.4/5/6 GHz</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Asistente IA Network Doctor</p>
            <p className="text-xs text-slate-400 mt-1">Diagnóstico inteligente en tiempo real</p>
          </div>
          <button 
            onClick={triggerAiDiagnostic}
            disabled={aiLoading}
            className="mt-3 w-full py-2 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {aiLoading ? 'Analizando Red...' : 'Ejecutar Diagnóstico AI'}
          </button>
        </div>

      </div>

      {/* AI Diagnosis Result Banner if present */}
      {aiDiagnosis && (
        <div className="bg-slate-900/95 border border-cyan-500/40 p-5 rounded-2xl shadow-2xl relative animate-fadeIn">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-cyan-300">Diagnóstico Inteligente NexusWave AI</h4>
                <p className="text-xs text-slate-400">Basado en telemetría en tiempo real y protocolos WPA3</p>
              </div>
            </div>
            <button 
              onClick={() => setAiDiagnosis(null)}
              className="text-slate-400 hover:text-slate-200 text-xs bg-slate-800 px-3 py-1 rounded-lg"
            >
              Cerrar
            </button>
          </div>
          <div className="mt-4 text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {aiDiagnosis}
          </div>
        </div>
      )}

      {/* Recurring Schedule System for Low-Traffic Hours */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" /> Sistema de Programación Automática (Horas de Bajo Tráfico)
            </h3>
            <p className="text-xs text-slate-400">Configure rutinas recurrentes para optimización automática de canales WiFi y escaneos de diagnóstico.</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setScheduleEnabled(!scheduleEnabled)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                scheduleEnabled 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {scheduleEnabled ? '● Automatización Activa' : '○ Pausada'}
            </button>
          </div>
        </div>

        {scheduleSavedMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>¡Horario de automatización guardado exitosamente! Se ejecutará automáticamente.</span>
          </div>
        )}

        <form onSubmit={handleSaveSchedule} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Hora de Ejecución (Madrugada)</label>
            <input 
              type="time" 
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Frecuencia Recurrente</label>
            <select
              value={scheduleFrequency}
              onChange={(e) => setScheduleFrequency(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="daily">Diaria (Todos los días)</option>
              <option value="weekly">Semanal (Domingos)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Tarea Automatizada</label>
            <select
              value={scheduleTask}
              onChange={(e) => setScheduleTask(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="both">Optimización Canales + Diagnóstico</option>
              <option value="optimization">Solo Optimización de Canales</option>
              <option value="diagnostic">Solo Escaneo de Diagnóstico</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Guardar Horario
            </button>
          </div>
        </form>
      </div>

      {/* Connected Devices Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header & Controls */}
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-cyan-400" /> Dispositivos Conectados en la Red
            </h3>
            <p className="text-xs text-slate-400">Monitoreo de señal, velocidad de enlace y estado de seguridad</p>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Buscar dispositivo, IP, MAC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Filter by Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">Todos los tipos</option>
              <option value="smartphone">Smartphones</option>
              <option value="laptop">Laptops</option>
              <option value="server">Servidores</option>
              <option value="camera">Cámaras</option>
              <option value="iot">IoT / Otros</option>
            </select>

            {/* Add Device Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Agregar Dispositivo
            </button>
          </div>
        </div>

        {/* Devices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase bg-slate-950/40">
                <th className="py-3 px-4">Dispositivo / Host</th>
                <th className="py-3 px-4">IP / MAC</th>
                <th className="py-3 px-4">Señal (RSSI)</th>
                <th className="py-3 px-4">Banda / Enlace</th>
                <th className="py-3 px-4">Seguridad</th>
                <th className="py-3 px-4">Tráfico (Down/Up)</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredDevices.map((dev) => {
                const signalBadge = getSignalBadge(dev.signalStrength);
                return (
                  <tr key={dev.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/50">
                          {getDeviceIcon(dev.type)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">{dev.name}</p>
                          <p className="text-[11px] text-slate-400">Conectado: {dev.connectedSince}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <div>{dev.ip}</div>
                      <div className="text-[10px] text-slate-500">{dev.mac}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${signalBadge.color}`}>
                          {dev.signalStrength} dBm ({signalBadge.label})
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{dev.frequency}</div>
                      <div className="text-[10px] text-cyan-400 font-mono">{dev.linkSpeed}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded text-[10px] font-medium">
                        {dev.security}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <div>↓ {dev.downloadUsage} GB</div>
                      <div className="text-[10px] text-slate-500">↑ {dev.uploadUsage} GB</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {dev.status === 'online' && (
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                        </span>
                      )}
                      {dev.status === 'guest' && (
                        <span className="px-2 py-0.5 bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit">
                          Invitado
                        </span>
                      )}
                      {dev.status === 'blocked' && (
                        <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit">
                          Bloqueado
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {dev.status !== 'blocked' ? (
                          <button
                            onClick={() => onUpdateDeviceStatus(dev.id, 'blocked')}
                            title="Bloquear acceso"
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateDeviceStatus(dev.id, 'online')}
                            title="Desbloquear"
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-100 mb-2">Registrar Nuevo Dispositivo</h3>
            <p className="text-xs text-slate-400 mb-4">Añade un equipo a la red con cifrado WPA3.</p>

            <form onSubmit={handleCreateDevice} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre del Dispositivo</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Servidor de Backup"
                  value={newDevName}
                  onChange={(e) => setNewDevName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Dirección IP Asignada</label>
                <input 
                  type="text"
                  required
                  value={newDevIp}
                  onChange={(e) => setNewDevIp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tipo</label>
                  <select 
                    value={newDevType}
                    onChange={(e) => setNewDevType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="smartphone">Smartphone</option>
                    <option value="laptop">Laptop / PC</option>
                    <option value="server">Servidor</option>
                    <option value="camera">Cámara IP</option>
                    <option value="iot">Dispositivo IoT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Punto de Acceso</label>
                  <select 
                    value={newDevAp}
                    onChange={(e) => setNewDevAp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                  >
                    {aps.map(ap => (
                      <option key={ap.id} value={ap.id}>{ap.name}</option>
                    ))}
                  </select>
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
                  Conectar Dispositivo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
