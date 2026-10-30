'use client';

import React, { useState } from 'react';
import { Wifi, Globe, Zap, Radio, Users, KeyRound, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, X } from 'lucide-react';

interface InteractiveManualProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export default function InteractiveManual({ isOpen, onClose, onSelectTab }: InteractiveManualProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Bienvenido a NexusWave Pro",
      subtitle: "Gestión de Redes WiFi, WPA3 y Puentes WDS",
      description: "Su plataforma profesional definitiva para administrar la infraestructura de red de Totalplay, Megacable, CFE y Go Wireless. Con cifrado WPA3-SAE de grado militar y control total.",
      icon: Wifi,
      tab: 'dashboard',
      badge: "Paso 1 de 6"
    },
    {
      title: "Puentes WiFi & Mesh WDS",
      subtitle: "Conecte Totalplay con Go Wireless sin cables",
      description: "¿Zonas sin acceso a internet? Cree enlaces inalámbricos tipo mesa / WDS para tender puentes entre la fibra de Totalplay y antenas Go Wireless de largo alcance.",
      icon: Globe,
      tab: 'mesh',
      badge: "Paso 2 de 6"
    },
    {
      title: "Forzar Conexión y Roaming WPA3",
      subtitle: "Reconexión instantánea para personal técnico",
      description: "Obligue a dispositivos con señal débil o desconectados a reasociarse de inmediato al punto de acceso o puente más cercano con autenticación WPA3 segura.",
      icon: Zap,
      tab: 'mesh',
      badge: "Paso 3 de 6"
    },
    {
      title: "Pruebas de Velocidad & IA Network Doctor",
      subtitle: "Diagnóstico inteligente en tiempo real",
      description: "Mida ancho de banda real de subida, bajada, ping y jitter, y obtenga diagnósticos y recomendaciones automáticas impulsadas por Gemini AI.",
      icon: Radio,
      tab: 'speedtest',
      badge: "Paso 4 de 6"
    },
    {
      title: "Redes de Invitados con QR",
      subtitle: "Control de ancho de banda y portales",
      description: "Configure SSIDs temporales para visitantes o terminales IoT con limitación de velocidad, VLANs aisladas y códigos QR listos para escanear.",
      icon: Users,
      tab: 'guests',
      badge: "Paso 5 de 6"
    },
    {
      title: "Bóveda de Credenciales y Visor Root",
      subtitle: "Gestión cifrada de contraseñas de técnicos",
      description: "Almacene y visualice contraseñas root de routers, puertas de enlace ISP y llaves WPA3 Enterprise en un espacio seguro y organizado.",
      icon: KeyRound,
      tab: 'vault',
      badge: "Paso 6 de 6"
    }
  ];

  const step = steps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleJumpToTab = () => {
    onSelectTab(step.tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl w-full max-w-xl p-8 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-200 bg-slate-800 p-2 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Badge & Icon */}
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-xs font-bold">
              {step.badge}
            </span>
            <h2 className="text-xl font-extrabold text-slate-100 mt-1">{step.title}</h2>
          </div>
        </div>

        {/* Subtitle & Description */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
          <h3 className="text-sm font-bold text-cyan-300">{step.subtitle}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
        </div>

        {/* Navigation & Jump Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1 ${
                currentStep === 0 
                  ? 'opacity-40 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-600' 
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Anterior
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1 cursor-pointer"
            >
              {currentStep === steps.length - 1 ? 'Comenzar a Usar' : 'Siguiente'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleJumpToTab}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Ver esta sección ahora
          </button>
        </div>

      </div>
    </div>
  );
}
