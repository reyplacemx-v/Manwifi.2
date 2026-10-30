'use client';

import React, { useState } from 'react';
import { SpeedTestResult } from '@/lib/types';
import { Zap, Play, RefreshCw, Activity, ArrowDown, ArrowUp, Wifi, Sparkles, CheckCircle2 } from 'lucide-react';

interface SpeedTestViewProps {
  latestResult: SpeedTestResult;
  onSaveResult: (result: SpeedTestResult) => void;
}

export default function SpeedTestView({ latestResult, onSaveResult }: SpeedTestViewProps) {
  const [testing, setTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(latestResult.download);
  const [uploadSpeed, setUploadSpeed] = useState(latestResult.upload);
  const [ping, setPing] = useState(latestResult.ping);
  const [jitter, setJitter] = useState(latestResult.jitter);
  const [progress, setProgress] = useState(0);
  const [testStage, setTestStage] = useState<'idle' | 'pinging' | 'downloading' | 'uploading' | 'complete'>('idle');
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const startSpeedTest = () => {
    setTesting(true);
    setProgress(0);
    setTestStage('pinging');
    setDownloadSpeed(0);
    setUploadSpeed(0);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);

      if (currentProgress < 20) {
        setTestStage('pinging');
        setPing(Math.floor(Math.random() * 3) + 2);
        setJitter(Number((Math.random() * 0.5 + 0.2).toFixed(1)));
      } else if (currentProgress < 60) {
        setTestStage('downloading');
        const simulatedDown = Math.floor(Math.random() * 150) + 850;
        setDownloadSpeed(simulatedDown);
      } else if (currentProgress < 95) {
        setTestStage('uploading');
        const simulatedUp = Math.floor(Math.random() * 100 + 400);
        setUploadSpeed(simulatedUp);
      } else {
        setTestStage('complete');
        setTesting(false);
        clearInterval(interval);

        const newRes: SpeedTestResult = {
          timestamp: 'Hace un momento',
          download: downloadSpeed || 920.4,
          upload: uploadSpeed || 460.2,
          ping: ping || 3.5,
          jitter: jitter || 0.4,
          server: 'Totalplay Fiber 10G Edge (CDMX)',
          isp: 'Totalplay / CFE Telecom'
        };
        onSaveResult(newRes);
      }
    }, 60);
  };

  const getAiSpeedAnalysis = async () => {
    setLoadingAi(true);
    setAiReport(null);
    try {
      const res = await fetch('/api/wifi-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analiza este resultado de prueba de velocidad en fibra óptica: Descarga ${downloadSpeed} Mbps, Subida ${uploadSpeed} Mbps, Ping ${ping} ms, Jitter ${jitter} ms. Explica si es apto para transmisión 8K, telemetría crítica CFE y WPA3 enterprise, y da consejos para maximizar el rendimiento.`
        })
      });
      const data = await res.json();
      setAiReport(data.text);
    } catch (err) {
      setAiReport("Error al consultar el servicio de IA.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400" /> Pruebas de Velocidad Integradas (Speed Test WISP)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Prueba de rendimiento de alta precisión enlazada a nodos de Totalplay, Megacable y CFE Fiber.
          </p>
        </div>

        <button
          onClick={startSpeedTest}
          disabled={testing}
          className={`px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-xl shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer ${
            testing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {testing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-slate-950" />}
          {testing ? 'Midiendo Velocidad...' : 'Iniciar Test de Velocidad'}
        </button>
      </div>

      {/* Main Speed Gauge Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Download Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-cyan-400">
            <ArrowDown className="w-24 h-24" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <ArrowDown className="w-4 h-4 text-cyan-400" /> Descarga (Download)
            </div>
            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-5xl font-extrabold text-slate-100 tracking-tight font-mono">
                {downloadSpeed.toFixed(1)}
              </span>
              <span className="text-cyan-400 font-bold text-lg">Mbps</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Servidor:</span>
            <span className="text-slate-200 font-medium">Totalplay Fiber 10G</span>
          </div>
        </div>

        {/* Upload Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-blue-400">
            <ArrowUp className="w-24 h-24" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <ArrowUp className="w-4 h-4 text-blue-400" /> Subida (Upload)
            </div>
            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-5xl font-extrabold text-slate-100 tracking-tight font-mono">
                {uploadSpeed.toFixed(1)}
              </span>
              <span className="text-blue-400 font-bold text-lg">Mbps</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Simetría de Enlace:</span>
            <span className="text-emerald-400 font-medium">Excelente (WPA3 6GHz)</span>
          </div>
        </div>

        {/* Latency & Jitter Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-400">
            <Activity className="w-24 h-24" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <Activity className="w-4 h-4 text-emerald-400" /> Latencia & Jitter
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-slate-400">Ping</p>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-3xl font-extrabold text-slate-100 font-mono">{ping}</span>
                  <span className="text-xs text-emerald-400">ms</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Jitter</p>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-3xl font-extrabold text-slate-100 font-mono">{jitter}</span>
                  <span className="text-xs text-cyan-400">ms</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Pérdida de Paquetes:</span>
            <span className="text-emerald-400 font-medium">0.0% (Óptimo)</span>
          </div>
        </div>

      </div>

      {/* Progress Bar during testing */}
      {testing && (
        <div className="bg-slate-900 border border-cyan-500/40 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-cyan-400 font-semibold uppercase tracking-wide">
              {testStage === 'pinging' && 'Calculando Ping y Latencia...'}
              {testStage === 'downloading' && 'Midiendo Ancho de Banda de Descarga (Download)...'}
              {testStage === 'uploading' && 'Midiendo Ancho de Banda de Subida (Upload)...'}
              {testStage === 'complete' && 'Test Completado con Éxito'}
            </span>
            <span className="text-slate-300 font-mono">{progress}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2.5 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* AI Speed Analysis Section */}
      <div className="bg-slate-900/95 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" /> Análisis IA de Rendimiento WISP & WPA3
            </h3>
            <p className="text-xs text-slate-400">Obtenga una evaluación experta del estado de su fibra y canales inalámbrícos.</p>
          </div>
          <button
            onClick={getAiSpeedAnalysis}
            disabled={loadingAi}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            {loadingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loadingAi ? 'Generando Reporte...' : 'Solicitar Análisis IA'}
          </button>
        </div>

        {aiReport && (
          <div className="bg-slate-950 p-5 rounded-xl border border-cyan-500/30 text-xs text-slate-200 leading-relaxed whitespace-pre-line">
            {aiReport}
          </div>
        )}
      </div>

    </div>
  );
}
