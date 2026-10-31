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
import { initialDevices, initialAccessPoints, initialGuestNetworks, initialCredentials, initialLogs, initialSpeedTest } from '@/lib/mock-data';

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showManual, setShowManual] = useState(false);

  const [devices, setDevices] = useState<ConnectedDevice[]>(initialDevices);
  const [aps, setAps] = useState<AccessPoint[]>(initialAccessPoints);
  const [guestNetworks, setGuestNetworks] = useState<GuestNetwork[]>(initialGuestNetworks);
  const [credentials, setCredentials] = useState<CredentialItem[]>(initialCredentials);
  const [logs, setLogs] = useState<NetworkLog[]>(initialLogs);
  const [latestSpeed, setLatestSpeed] = useState<SpeedTestResult>(initialSpeedTest);

  // Real-time synchronization with Firestore
  useEffect(() => {
    let unsubDevices = () => {};
    let unsubAps = () => {};
    let unsubCreds = () => {};

    try {
      unsubDevices = onSnapshot(collection(db, 'devices'), (snapshot) => {
        if (!snapshot.empty) {
          setDevices(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as ConnectedDevice)));
        }
      }, (err) => {
        console.warn('Firestore devices offline/error:', err);
      });

      unsubAps = onSnapshot(collection(db, 'aps'), (snapshot) => {
        if (!snapshot.empty) {
          setAps(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as AccessPoint)));
        }
      }, (err) => {
        console.warn('Firestore aps offline/error:', err);
      });

      unsubCreds = onSnapshot(collection(db, 'credentials'), (snapshot) => {
        if (!snapshot.empty) {
          setCredentials(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as CredentialItem)));
        }
      }, (err) => {
        console.warn('Firestore credentials offline/error:', err);
      });
    } catch (e) {
      console.warn('Error setting up firestore listeners:', e);
    }
    
    // Check manual
    try {
      const hasSeenManual = localStorage.getItem('nexuswave_seen_manual');
      if (!hasSeenManual) {
        setTimeout(() => {
          setShowManual(true);
        }, 0);
        localStorage.setItem('nexuswave_seen_manual', 'true');
      }
    } catch (e) {
      console.warn(e);
    }

    return () => {
      unsubDevices();
      unsubAps();
      unsubCreds();
    };
  }, []);

  // Handlers - Updated for Firestore with optimistic local updates
  const handleUpdateDeviceStatus = async (deviceId: string, newStatus: 'online' | 'blocked' | 'guest') => {
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status: newStatus } : d));
    try {
      await updateDoc(doc(db, 'devices', deviceId), { status: newStatus });
    } catch (e) {
      console.warn('Firestore updateDoc failed:', e);
    }
  };

  const handleForceReconnect = async (deviceId: string) => {
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status: 'online', signalStrength: -40 } : d));
    try {
      await updateDoc(doc(db, 'devices', deviceId), { status: 'online', signalStrength: -40 });
    } catch (e) {
      console.warn('Firestore force reconnect update failed:', e);
    }
  };

  const handleAddDevice = async (newDev: ConnectedDevice) => {
    setDevices(prev => [newDev, ...prev]);
    try {
      await setDoc(doc(db, 'devices', newDev.id), newDev);
    } catch (e) {
      console.warn('Firestore add device failed:', e);
    }
  };

  const handleRebootAp = async (apId: string) => {
    const target = aps.find(a => a.id === apId);
    if (target) {
      setLogs(prev => [{
        id: `log-${Date.now()}`,
        timestamp: 'Hace un momento',
        type: 'warning',
        title: 'Punto de Acceso Reiniciado',
        description: `Se reinició remotamente el AP ${target.name}.`,
        source: 'Control Remoto AP'
      }, ...prev]);
    }
  };

  const handleOptimizeChannels = async (apId: string) => {
    const newCh = Math.floor(Math.random() * 40) + 36;
    setAps(prev => prev.map(a => a.id === apId ? { ...a, channel5: newCh } : a));
    try {
      await updateDoc(doc(db, 'aps', apId), { channel5: newCh });
    } catch (e) {
      console.warn('Firestore channel update failed:', e);
    }
  };

  const handleAddAp = async (newAp: AccessPoint) => {
    setAps(prev => [...prev, newAp]);
    try {
      await setDoc(doc(db, 'aps', newAp.id), newAp);
    } catch (e) {
      console.warn('Firestore add AP failed:', e);
    }
  };

  const handleToggleGuest = async (guestId: string) => {
    setGuestNetworks(prev => prev.map(g => g.id === guestId ? { ...g, enabled: !g.enabled } : g));
  };

  const handleAddGuest = async (newGuest: GuestNetwork) => {
    setGuestNetworks(prev => [...prev, newGuest]);
  };

  const handleAddCredential = async (newCred: CredentialItem) => {
    setCredentials(prev => [newCred, ...prev]);
    try {
      await setDoc(doc(db, 'credentials', newCred.id), newCred);
    } catch (e) {
      console.warn('Firestore add credential failed:', e);
    }
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
