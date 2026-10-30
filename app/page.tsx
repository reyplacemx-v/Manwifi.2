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
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';
import { ConnectedDevice, AccessPoint, GuestNetwork, CredentialItem, NetworkLog, SpeedTestResult } from '@/lib/types';
import { initialSpeedTest } from '@/lib/mock-data';

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showManual, setShowManual] = useState(false);

  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [aps, setAps] = useState<AccessPoint[]>([]);
  const [guestNetworks, setGuestNetworks] = useState<GuestNetwork[]>([]);
  const [credentials, setCredentials] = useState<CredentialItem[]>([]);
  const [logs, setLogs] = useState<NetworkLog[]>([]);
  const [latestSpeed, setLatestSpeed] = useState<SpeedTestResult>(initialSpeedTest);

  // Real-time synchronization with Firestore
  useEffect(() => {
    const unsubDevices = onSnapshot(collection(db, 'devices'), (snapshot) => {
      setDevices(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ConnectedDevice)));
    });
    const unsubAps = onSnapshot(collection(db, 'aps'), (snapshot) => {
      setAps(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AccessPoint)));
    });
    
    // Check manual
    const hasSeenManual = localStorage.getItem('nexuswave_seen_manual');
    if (!hasSeenManual) {
      setShowManual(true);
      localStorage.setItem('nexuswave_seen_manual', 'true');
    }

    return () => {
      unsubDevices();
      unsubAps();
    };
  }, []);

  // Handlers - Updated for Firestore
  const handleUpdateDeviceStatus = async (deviceId: string, newStatus: 'online' | 'blocked' | 'guest') => {
    await updateDoc(doc(db, 'devices', deviceId), { status: newStatus });
  };

  const handleForceReconnect = async (deviceId: string) => {
    await updateDoc(doc(db, 'devices', deviceId), { status: 'online', signalStrength: -40 });
  };

  const handleAddDevice = async (newDev: ConnectedDevice) => {
    await setDoc(doc(db, 'devices', newDev.id), newDev);
  };

  const handleRebootAp = async (apId: string) => {
    // Implementation for real reboot
  };

  const handleOptimizeChannels = async (apId: string) => {
    await updateDoc(doc(db, 'aps', apId), { channel5: Math.floor(Math.random() * 40) + 36 });
  };

  const handleAddAp = async (newAp: AccessPoint) => {
    await setDoc(doc(db, 'aps', newAp.id), newAp);
  };

  const handleToggleGuest = async (guestId: string) => {
    // Implementation
  };

  const handleAddGuest = async (newGuest: GuestNetwork) => {
    // Implementation
  };

  const handleAddCredential = async (newCred: CredentialItem) => {
    await setDoc(doc(db, 'credentials', newCred.id), newCred);
  };

  const handleSaveSpeedResult = (res: SpeedTestResult) => {
    setLatestSpeed(res);
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
        <OfflineIndicator />
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
        <p>NexusWave Pro • 2FA • VPN • Satélite LEO • Internet Gratuito • Conversor de Señal • WPA3 • Firestore Persistent</p>
      </footer>

    </div>
  );
}
