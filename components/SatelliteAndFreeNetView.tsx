'use client';

import React, { useState } from 'react';
import { Globe, Radio, Wifi, Zap, CheckCircle2, RefreshCw, Satellite, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function SatelliteAndFreeNetView() {
  const [satConnected, setSatConnected] = useState(true);
  const [freeNetActive, setFreeNetActive] = useState(true);
  const [converterMode, setConverterMode] = useState<'wisp' | 'satellite' | 'cellular'>('satellite');
  const [converting, setConverting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Configuration state
  const [satApiKey, setSatApiKey] = useState('SAT_LINK_8829_XXXX_XXXX');

  const handleToggleSat = () => {
    if (!satApiKey) {
      alert("Por favor, introduzca una clave API de suscripción satelital válida.");
      return;
    }
    setSatConnected(!satConnected);
    setSuccessMsg(!satConnected ? 'Enlace satelital LEO (Starlink / SatCom) activado con éxito.' : 'Enlace satelital pausado.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleToggleFreeNet = () => {
    setFreeNetActive(!freeNetActive);
    setSuccessMsg(!freeNetActive ? 'Modo de Internet Comunitario Gratuito habilitado.' : 'Internet Comunitario desactivado.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleRunConverter = () => {
    setConverting(true);
    setTimeout(() => {
      setConverting(false);
      setSuccessMsg(`Conversión de señal (${converterMode.toUpperCase()}) a punto de acceso WiFi 6 convertida y transmitiendo exitosamente.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Satellite className="w-6 h-6 text-cyan-400" /> Conexiones Satelitales & Internet Gratuito Comunitario
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de enlaces satelitales LEO, redes comunitarias de acceso libre y conversión de señales externas a WiFi local.
          </p>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 p-4 rounded-xl text-xs flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
        <div>
          <p className="font-bold">Aviso importante de configuración</p>
          <p>Para activar enlaces satelitales o servicios VPN gratuitos, el usuario debe poseer hardware compatible (antenas, módems) y suscripciones activas con el proveedor. Esta interfaz gestiona la configuración técnica de dichas conexiones.</p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Satellite & Free Net Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Satellite Link Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-[10px] font-semibold">
                  ÓRBITA BAJA (LEO)
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-2">Enlace Satelital Global</h3>
                <p className="text-xs text-slate-400">Conexión satelital directa para zonas sin infraestructura terrestre.</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${satConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                {satConnected ? 'Conectado' : 'Inactivo'}
              </div>
            </div>

            <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-3">
              <div>
                <label className="block text-slate-500 mb-1">Clave API Satelital (Suscripción):</label>
                <input type="text" value={satApiKey} onChange={(e) => setSatApiKey(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-cyan-300" />
              </div>
              <div className="flex justify-between"><span className="text-slate-500">Satélite:</span> <span className="font-mono text-slate-200">Starlink / SatCom-V2</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Latencia:</span> <span className="font-mono text-cyan-400">24.5 ms</span></div>
            </div>
          </div>

          <button
            onClick={handleToggleSat}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              satConnected ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
            }`}
          >
            {satConnected ? 'Desactivar Enlace Satelital' : 'Activar Enlace Satelital'}
          </button>
        </div>

        {/* Free Internet Community Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-semibold">
                  COMUNITARIO WISP
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-2">Internet Gratuito de Acceso Libre</h3>
                <p className="text-xs text-slate-400">Comparte excedente de ancho de banda de forma segura con la comunidad.</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${freeNetActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                {freeNetActive ? 'Activo' : 'Pausado'}
              </div>
            </div>

            <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between"><span className="text-slate-500">SSID Público:</span> <span className="font-mono text-slate-200">NexusWave_Free_Comunitario</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Límite por Usuario:</span> <span className="font-mono text-cyan-400">10 Mbps Down</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Seguridad:</span> <span className="font-mono text-emerald-400">Portal Cautivo + WPA3</span></div>
            </div>
          </div>

          <button
            onClick={handleToggleFreeNet}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              freeNetActive ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {freeNetActive ? 'Desactivar Red Gratuita' : 'Habilitar Red Gratuita'}
          </button>
        </div>

      </div>

      {/* Signal to WiFi Converter Tool */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" /> Conversor de Señal Externa a WiFi Local
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Convierta señales de radio WISP, antenas satelitales o redes celulares móviles en puntos de acceso WiFi seguros para todos los usuarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setConverterMode('satellite')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              converterMode === 'satellite' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <Satellite className="w-6 h-6 mb-2 text-cyan-400" />
            <h4 className="font-bold text-slate-200">Entrada Satelital LEO</h4>
            <p className="text-[11px] text-slate-400 mt-1">Convierte haz satelital en red WiFi 6</p>
          </button>

          <button
            onClick={() => setConverterMode('wisp')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              converterMode === 'wisp' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <Radio className="w-6 h-6 mb-2 text-blue-400" />
            <h4 className="font-bold text-slate-200">Receptor WISP / Antena</h4>
            <p className="text-[11px] text-slate-400 mt-1">Transforma enlace de largo alcance en SSID</p>
          </button>

          <button
            onClick={() => setConverterMode('cellular')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              converterMode === 'cellular' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <Wifi className="w-6 h-6 mb-2 text-emerald-400" />
            <h4 className="font-bold text-slate-200">Gateway Celular 5G/4G</h4>
            <p className="text-[11px] text-slate-400 mt-1">Modem LTE a repetidor WiFi cifrado</p>
          </button>
        </div>

        <div className="pt-2">
          <button
            onClick={handleRunConverter}
            disabled={converting}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            {converting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {converting ? 'Configurando Conversor...' : 'Iniciar Conversión y Transmisión WiFi'}
          </button>
        </div>
      </div>

    </div>
  );
}
