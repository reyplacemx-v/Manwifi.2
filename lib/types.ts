export interface ConnectedDevice {
  id: string;
  name: string;
  ip: string;
  mac: string;
  type: 'smartphone' | 'laptop' | 'iot' | 'router' | 'printer' | 'server' | 'camera';
  apId: string;
  signalStrength: number; // dBm (-30 to -90)
  linkSpeed: string; // e.g. "1200 Mbps"
  frequency: '2.4 GHz' | '5 GHz' | '6 GHz (Wi-Fi 6E/7)';
  security: 'WPA3-Enterprise' | 'WPA3-SAE' | 'WPA2-AES';
  downloadUsage: number; // GB
  uploadUsage: number; // GB
  status: 'online' | 'idle' | 'blocked' | 'guest';
  connectedSince: string;
}

export interface AccessPoint {
  id: string;
  name: string;
  provider: 'Totalplay Fiber' | 'Megacable Enterprise' | 'CFE Telemetría' | 'Go Wireless Pro' | 'Cisco Meraki';
  model: string;
  ip: string;
  mac: string;
  channel24: number;
  channel5: number;
  channel6?: number;
  power24: 'Low' | 'Medium' | 'High';
  power5: 'Low' | 'Medium' | 'High';
  status: 'online' | 'updating' | 'warning' | 'offline';
  connectedClients: number;
  temperature: number; // °C
  firmware: string;
  securityMode: 'WPA3-SAE' | 'WPA3-Enterprise' | 'WPA2/WPA3 Mixed';
  uptime: string;
}

export interface GuestNetwork {
  id: string;
  ssid: string;
  password: string;
  enabled: boolean;
  bandwidthLimitDown: number; // Mbps
  bandwidthLimitUp: number; // Mbps
  durationHours: number;
  activeGuests: number;
  security: 'WPA3-Guest' | 'Captive Portal' | 'Open (Encrypted)';
  vlan: number;
}

export interface CredentialItem {
  id: string;
  title: string;
  category: 'Router Root' | 'ISP Portal' | 'WPA3 Enterprise' | 'Admin Server' | 'VPN Gateway' | 'Switch/Firewall';
  username: string;
  encryptedPassword: string;
  host: string;
  notes: string;
  lastUpdated: string;
  securityLevel: 'Maximum (WPA3)' | 'High' | 'Standard';
  owner: string;
}

export interface NetworkLog {
  id: string;
  timestamp: string;
  type: 'security' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  source: string;
}

export interface SpeedTestResult {
  timestamp: string;
  download: number; // Mbps
  upload: number; // Mbps
  ping: number; // ms
  jitter: number; // ms
  server: string;
  isp: string;
}
