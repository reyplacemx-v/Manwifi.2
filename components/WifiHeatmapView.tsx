'use client';

import React, { useState } from 'react';
import { AccessPoint } from '@/lib/types';
import { Signal, RefreshCw, Sparkles, MapPin, Sliders, AlertCircle, CheckCircle2, Building, Home } from 'lucide-react';

interface WifiHeatmapViewProps {
  aps: AccessPoint[];
}

export default function WifiHeatmapView({ aps }: WifiHeatmapViewProps) {
  const [selectedLayout, setSelectedLayout] = useState<'casa' | 'oficina' | 'bodega'>('oficina');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Simulated grid cells (e.g. 5x5 rooms)
  const [gridData, setGridData] = useState<{ [key: string]: number }>({
    '0-0': -42, '0-1': -48, '0-2': -55, '0-3': -68, '0-4': -78,
    '1-0': -45, '1-1': -50, '1-2': -58, '1-3': -70, '1-4': -82,
    '2-0': -52, '2-1': -58, '2-2': -62, '2-3': -75, '2-4': -85,
    '3-0': -60, '3-1': -65, '3-2': -70, '3-3': -80, '3-4': -88,
    '4-0': -72, '4-1': -76, '4-2': -82, '4-3': -89, '4-4': -94,
  });

  const getCellColor = (rssi: number) => {
    if (rssi >= -50) return 'bg-emerald-500/80 text-slate-950 border-emerald-400';
    if (rssi >= -68) return 'bg-cyan-500/70 text-slate-950 border-cyan-400';
    if (rssi >= -78) return 'bg-amber-500/70 text-slate-950 border-amber-400';
    return 'bg-rose-500/80 text-white border-rose-400';
  };

  const getSignalLabel = (rssi: number) => {
    if (rssi >= -50) return 'Excelente (-50 dBm)';
    if (rssi >= -68) return 'Bueno (-68 dBm)';
    if (rssi >= -78) return 'Regular (-78 dBm)';
    return 'Débil / Zona ciega (< -80 dBm)';
  };

  const handleCellClick = (key: string) => {
    // Cycle signal strength or simulate toggle
    setGridData(prev => {
      const current = prev[key];
      let next = -45;
      if (current === -45) next = -65;
      else if (current === -65) next = -85;
      else next = -45;
      return { ...prev, [key]: next };
    });
  };

  const runAiHeatmapOptimization = async () => {
    setLoadingAi(true);
    setAiAnalysis(null);
    try {
      const res = await fetch('/api/wifi-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analiza este plano de cobertura WiFi (${selectedLayout}) con múltiples Puntos de Acceso (Totalplay, Megacable, CFE, Go Wireless). Se detectaron zonas débiles en las esquinas inferiores con RSSI inferior a -80 dBm. Proporciona recomendaciones precisas sobre dónde reubicar los APs o añadir un puente WDS Go Wireless.`
        })
      });
      const data = await res.json();
      setAiAnalysis(data.text);
    } catch (e) {
      setAiAnalysis("Error al generar el análisis de cobertura.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Signal className="w-6 h-6 text-cyan-400" /> Mapa de Calor Interactivo WiFi & Cobertura
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visualice la intensidad de señal (RSSI) en su espacio, identifique zonas ciegas y optimice la ubicación de sus APs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSelectedLayout('casa')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              selectedLayout === 'casa' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Home className="w-4 h-4" /> Residencia
          </button>
          <button
            onClick={() => setSelectedLayout('oficina')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              selectedLayout === 'oficina' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Building className="w-4 h-4" /> Oficina / Planta
          </button>
        </div>
      </div>

      {/* Main Heatmap Grid & Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grid Visualizer */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Plano Interactivo ({selectedLayout.toUpperCase()}) - Celdas de Cobertura</h3>
            <span className="text-[11px] text-slate-400">Haga clic en una celda para simular intensidad</span>
          </div>

          <div className="grid grid-cols-5 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
            {Object.entries(gridData).map(([key, rssi]) => (
              <button
                key={key}
                onClick={() => handleCellClick(key)}
                className={`h-24 rounded-xl border p-3 flex flex-col justify-between transition-all transform hover:scale-105 cursor-pointer ${getCellColor(rssi)}`}
              >
                <div className="flex justify-between items-center w-full text-[10px] font-bold">
                  <span>{key}</span>
                  <Signal className="w-3.5 h-3.5" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-mono font-extrabold">{rssi} dBm</span>
                </div>
                <span className="text-[9px] truncate opacity-90">{rssi >= -68 ? 'Óptimo' : 'Débil'}</span>
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span>Excelente (&gt; -50 dBm)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-cyan-500"></span>
              <span>Bueno (-68 dBm)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-amber-500"></span>
              <span>Regular (-78 dBm)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-rose-500"></span>
              <span>Zona Ciega (&lt; -80 dBm)</span>
            </div>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" /> Optimización de Cobertura AI
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Analice las zonas con señal débil y descubra dónde colocar un puente Go Wireless o reubicar su AP Totalplay.
            </p>
          </div>

          <div className="flex-1 my-4">
            {aiAnalysis ? (
              <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 text-xs text-slate-200 leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">
                {aiAnalysis}
              </div>
            ) : (
              <div className="h-48 bg-slate-950/50 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
                <MapPin className="w-8 h-8 text-cyan-500/40 mb-2" />
                Haga clic abajo para analizar el plano y detectar puntos ciegos.
              </div>
            )}
          </div>

          <button
            onClick={runAiHeatmapOptimization}
            disabled={loadingAi}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loadingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loadingAi ? 'Analizando Plano...' : 'Generar Recomendación IA'}
          </button>
        </div>

      </div>

    </div>
  );
}
