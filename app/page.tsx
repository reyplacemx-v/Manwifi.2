'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DashboardView from '@/components/DashboardView';
import SpeedTestView from '@/components/SpeedTestView';
import AccessPointsView from '@/components/AccessPointsView';
import GuestNetworksView from '@/components/GuestNetworksView';
import CredentialVaultView from '@/components/CredentialVaultView';
import MetricsLogsView from '@/components/MetricsLogsView';
import WifiMeshBridgeView from '@/components/WifiMeshBridgeView';
import WifiHeatmapView from '@/components/WifiHeatmapView';
import SecurityAuditView from '@/components/SecurityAuditView';
import SatelliteAndFreeNetView from '@/components/SatelliteAndFreeNetView';
import VpnManagerView from '@/components/VpnManagerView';
import AlertsManagerView from '@/components/AlertsManagerView';
import InteractiveManual from '@/components/InteractiveManual';
import { 
  initialDevices, 
  initialAccessPoints, 
  initialGuestNetworks, 
  initialCredentials, 
  initialLogs, 
  initialSpeedTest 
} from '@/lib/mock-data';
import { ConnectedDevice, AccessPoint, GuestNetwork, CredentialItem, NetworkLog, SpeedTestResult } from '@/lib/types';

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showManual, setShowManual] = useState(false);

  const [devices, setDevices] = useState<ConnectedDevice[]>(initialDevices);
  const [aps, setAps] = useState<AccessPoint[]>(initialAccessPoints);
  const [guestNetworks, setGuestNetworks] = useState<GuestNetwork[]>(initialGuestNetworks);
  const [credentials, setCredentials] = useState<CredentialItem[]>(initialCredentials);
  const [logs, setLogs] = useState<NetworkLog[]>(initialLogs);
  const [latestSpeed, setLatestSpeed] = useState<SpeedTestResult>(initialSpeedTest);

  // Load from localStorage on mount and open manual if first visit
  useEffect(() => {
    try {
      const savedDevs = localStorage.getItem('nexuswave_devices');
      if (savedDevs) setDevices(JSON.parse(savedDevs));

      const savedAps = localStorage.getItem('nexuswave_aps');
      if (savedAps) setAps(JSON.parse(savedAps));

      const savedGuests = localStorage.getItem('nexuswave_guests');
      if (savedGuests) setGuestNetworks(JSON.parse(savedGuests));

      const savedCreds = localStorage.getItem('nexuswave_creds');
      if (savedCreds) setCredentials(JSON.parse(savedCreds));

      const savedLogs = localStorage.getItem('nexuswave_logs');
      if (savedLogs) setLogs(JSON.parse(savedLogs));

      const hasSeenManual = localStorage.getItem('nexuswave_seen_manual');
      if (!hasSeenManual) {
        setShowManual(true);
        localStorage.setItem('nexuswave_seen_manual', 'true');
      }
    } catch (e) {
      console.error("Error loading localStorage", e);
    }
  }, []);

  // Save helpers
  const updateDevices = (newDevs: ConnectedDevice[]) => {
    setDevices(newDevs);
    localStorage.setItem('nexuswave_devices', JSON.stringify(newDevs));
  };

  const updateAps = (newAps: AccessPoint[]) => {
    setAps(newAps);
    localStorage.setItem('nexuswave_aps', JSON.stringify(newAps));
  };

  const updateGuests = (newGuests: GuestNetwork[]) => {
    setGuestNetworks(newGuests);
    localStorage.setItem('nexuswave_guests', JSON.stringify(newGuests));
  };

  const updateCreds = (newCreds: CredentialItem[]) => {
    setCredentials(newCreds);
    localStorage.setItem('nexuswave_creds', JSON.stringify(newCreds));
  };

  const addLog = (newLog: NetworkLog) => {
    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem('nexuswave_logs', JSON.stringify(updated));
  };

  // Handlers
  const handleUpdateDeviceStatus = (deviceId: string, newStatus: 'online' | 'blocked' | 'guest') => {
    const updated = devices.map(d => d.id === deviceId ? { ...d, status: newStatus } : d);
    updateDevices(updated);
    const target = devices.find(d => d.id === deviceId);
    addLog({
      id: `log-${Date.now()}`,
      timestamp: 'Hace un momento',
      type: newStatus === 'blocked' ? 'security' : 'info',
      title: newStatus === 'blocked' ? 'Dispositivo Bloqueado' : 'Estado de Dispositivo Actualizado',
      description: `El dispositivo ${target?.name || deviceId} cambió su estado a ${newStatus}.`,
      source: 'Control de Acceso WPA3'
    });
  };

  const handleForceReconnect = (deviceId: string) => {
    const updated = devices.map(d => d.id === deviceId ? { ...d, status: 'online' as const, signalStrength: -40 } : d);
    updateDevices(updated);
    const target = devices.find(d => d.id === deviceId);
    addLog({
      id: `log-${Date.now()}`,
      timestamp: 'Hace un momento',
      type: 'success',
      title: 'Conexión Forzada WPA3-SAE',
      description: `Reautenticación exitosa forzada para ${target?.name || deviceId} a través del puente WDS.`,
      source: 'Puente Mesh Go Wireless'
    });
  };

  const handleAddDevice = (newDev: ConnectedDevice) => {
    updateDevices([newDev, ...devices]);
    addLog({
      id: `log-${Date.now()}`,
      timestamp: 'Hace un momento',
      type: 'success',
      title: 'Nuevo Dispositivo Conectado',
      description: `Se registró el dispositivo ${newDev.name} (${newDev.ip}) con WPA3-SAE.`,
      source: 'Punto de Acceso Principal'
    });
  };

  const handleRebootAp = (apId: string) => {
    const target = aps.find(a => a.id === apId);
    addLog({
      id: `log-${Date.now()}`,
      timestamp: 'Hace un momento',
      type: 'warning',
      title: 'Punto de Acceso Reiniciado',
      description: `Se reinició remotamente el AP ${target?.name || apId}.`,
      source: 'Control Remoto AP'
    });
  };

  const handleOptimizeChannels = (apId: string) => {
    const updated = aps.map(a => a.id === apId ? { ...a, channel5: Math.floor(Math.random() * 40) + 36 } : a);
    updateAps(updated);
    const target = aps.find(a => a.id === apId);
    addLog({
      id: `log-${Date.now()}`,
      timestamp: 'Hace un momento',
      type: 'success',
      title: 'Optimización de Canales WiFi',
      description: `Canales RF reasignados exitosamente para ${target?.name || apId}.`,
      source: 'Motor WPA3 RF'
    });
  };

  const handleAddAp = (newAp: AccessPoint) => {
    updateAps([...aps, newAp]);
    addLog({
      id: `log-${Date.now()}`,
      timestamp: 'Hace un momento',
      type: 'success',
      title: 'Nuevo AP Integrado a la Red',
      description: `Se añadió el nodo ${newAp.name} (${newAp.provider}) con WPA3.`,
      source: 'Infraestructura de Red'
    });
  };

  const handleToggleGuest = (guestId: string) => {
    const updated = guestNetworks.map(g => g.id === guestId ? { ...g, enabled: !g.enabled } : g);
    updateGuests(updated);
  };

  const handleAddGuest = (newGuest: GuestNetwork) => {
    updateGuests([...guestNetworks, newGuest]);
    addLog({
      id: `log-${Date.now()}`,
      timestamp: 'Hace un momento',
      type: 'success',
      title: 'Red de Invitados Creada',
      description: `SSID ${newGuest.ssid} habilitado con límite de ${newGuest.bandwidthLimitDown}Mbps.`,
      source: 'Portal Cautivo'
    });
  };

  const handleAddCredential = (newCred: CredentialItem) => {
    updateCreds([newCred, ...credentials]);
    addLog({
      id: `log-${Date.now()}`,
      timestamp: 'Hace un momento',
      type: 'security',
      title: 'Nueva Credencial Guardada en Bóveda',
      description: `Se añadió acceso cifrado para ${newCred.title} (${newCred.category}).`,
      source: 'Bóveda WPA3'
    });
  };

  const handleSaveSpeedResult = (res: SpeedTestResult) => {
    setLatestSpeed(res);
    addLog({
      id: `log-${Date.now()}`,
      timestamp: 'Hace un momento',
      type: 'success',
      title: 'Prueba de Velocidad Ejecutada',
      description: `Resultado: ${res.download} Mbps Down / ${res.upload} Mbps Up (Ping: ${res.ping}ms).`,
      source: 'Speed Test WISP'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        deviceCount={devices.filter(d => d.status === 'online').length}
        apCount={aps.length}
        onOpenManual={() => setShowManual(true)}
      />

      {/* Interactive Manual Onboarding Modal */}
      <InteractiveManual 
        isOpen={showManual}
        onClose={() => setShowManual(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView 
            devices={devices}
            aps={aps}
            onUpdateDeviceStatus={handleUpdateDeviceStatus}
            onAddDevice={handleAddDevice}
            onRunAiOptimization={() => setActiveTab('speedtest')}
          />
        )}

        {activeTab === 'mesh' && (
          <WifiMeshBridgeView 
            aps={aps}
            devices={devices}
            onForceReconnect={handleForceReconnect}
            onAddBridgeNode={handleAddAp}
          />
        )}

        {activeTab === 'satellite' && (
          <SatelliteAndFreeNetView />
        )}

        {activeTab === 'vpn' && (
          <VpnManagerView />
        )}

        {activeTab === 'alerts' && (
          <AlertsManagerView />
        )}

        {activeTab === 'heatmap' && (
          <WifiHeatmapView 
            aps={aps}
          />
        )}

        {activeTab === 'audit' && (
          <SecurityAuditView 
            aps={aps}
            devices={devices}
          />
        )}

        {activeTab === 'speedtest' && (
          <SpeedTestView 
            latestResult={latestSpeed}
            onSaveResult={handleSaveSpeedResult}
          />
        )}

        {activeTab === 'aps' && (
          <AccessPointsView 
            aps={aps}
            onRebootAp={handleRebootAp}
            onOptimizeChannels={handleOptimizeChannels}
            onAddAp={handleAddAp}
          />
        )}

        {activeTab === 'guests' && (
          <GuestNetworksView 
            guestNetworks={guestNetworks}
            onToggleGuest={handleToggleGuest}
            onAddGuest={handleAddGuest}
          />
        )}

        {activeTab === 'vault' && (
          <CredentialVaultView 
            credentials={credentials}
            onAddCredential={handleAddCredential}
          />
        )}

        {activeTab === 'metrics' && (
          <MetricsLogsView 
            logs={logs}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 mt-12 text-center text-xs text-slate-500">
        <p>NexusWave Pro • 2FA • VPN • Satélite LEO • Internet Gratuito • Conversor de Señal • WPA3</p>
      </footer>

    </div>
  );
}
