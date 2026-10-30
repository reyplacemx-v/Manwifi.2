import { ConnectedDevice, AccessPoint, GuestNetwork, CredentialItem, NetworkLog, SpeedTestResult } from './types';

export const initialDevices: ConnectedDevice[] = [
  {
    id: 'dev-1',
    name: 'MacBook Pro M3 Max (Admin)',
    ip: '192.168.1.10',
    mac: 'a4:83:e7:91:2b:44',
    type: 'laptop',
    apId: 'ap-1',
    signalStrength: -42,
    linkSpeed: '2400 Mbps',
    frequency: '6 GHz (Wi-Fi 6E/7)',
    security: 'WPA3-Enterprise',
    downloadUsage: 45.2,
    uploadUsage: 8.4,
    status: 'online',
    connectedSince: 'Hace 4 horas'
  },
  {
    id: 'dev-2',
    name: 'Servidor Central CFE Telemetría',
    ip: '192.168.1.5',
    mac: '00:1a:2b:3c:4d:5e',
    type: 'server',
    apId: 'ap-2',
    signalStrength: -35,
    linkSpeed: '1800 Mbps',
    frequency: '5 GHz',
    security: 'WPA3-SAE',
    downloadUsage: 312.8,
    uploadUsage: 145.6,
    status: 'online',
    connectedSince: '14 días'
  },
  {
    id: 'dev-3',
    name: 'iPhone 16 Pro Max (Supervisor)',
    ip: '192.168.1.24',
    mac: 'dc:a9:04:77:88:12',
    type: 'smartphone',
    apId: 'ap-1',
    signalStrength: -58,
    linkSpeed: '1200 Mbps',
    frequency: '6 GHz (Wi-Fi 6E/7)',
    security: 'WPA3-Enterprise',
    downloadUsage: 12.4,
    uploadUsage: 2.1,
    status: 'online',
    connectedSince: 'Hace 45 min'
  },
  {
    id: 'dev-4',
    name: 'Cámara IP Perimetral Megacable',
    ip: '192.168.1.105',
    mac: 'bc:ff:41:00:99:a1',
    type: 'camera',
    apId: 'ap-3',
    signalStrength: -65,
    linkSpeed: '433 Mbps',
    frequency: '2.4 GHz',
    security: 'WPA3-SAE',
    downloadUsage: 88.5,
    uploadUsage: 195.4,
    status: 'online',
    connectedSince: '3 días'
  },
  {
    id: 'dev-5',
    name: 'Estación de Trabajo Go Wireless',
    ip: '192.168.1.42',
    mac: '58:ef:68:12:34:56',
    type: 'laptop',
    apId: 'ap-4',
    signalStrength: -50,
    linkSpeed: '866 Mbps',
    frequency: '5 GHz',
    security: 'WPA3-Enterprise',
    downloadUsage: 19.6,
    uploadUsage: 4.3,
    status: 'online',
    connectedSince: 'Hace 2 horas'
  },
  {
    id: 'dev-6',
    name: 'Terminal de Pago Invitado (Cafetería)',
    ip: '192.168.2.15',
    mac: '70:3a:0e:55:66:77',
    type: 'iot',
    apId: 'ap-1',
    signalStrength: -70,
    linkSpeed: '300 Mbps',
    frequency: '2.4 GHz',
    security: 'WPA2-AES',
    downloadUsage: 1.5,
    uploadUsage: 0.8,
    status: 'guest',
    connectedSince: 'Hace 6 horas'
  }
];

export const initialAccessPoints: AccessPoint[] = [
  {
    id: 'ap-1',
    name: 'AP Principal Sala de Control',
    provider: 'Totalplay Fiber',
    model: 'TP-Link Omada EAP773 Wi-Fi 7',
    ip: '192.168.1.2',
    mac: '64:9a:19:00:11:22',
    channel24: 6,
    channel5: 44,
    channel6: 37,
    power24: 'High',
    power5: 'High',
    status: 'online',
    connectedClients: 14,
    temperature: 41.5,
    firmware: 'v1.4.2-WPA3-PRO',
    securityMode: 'WPA3-SAE',
    uptime: '18d 6h 22m'
  },
  {
    id: 'ap-2',
    name: 'AP Nodo Operativo CFE / Enlace',
    provider: 'CFE Telemetría',
    model: 'Ubiquiti U7 Pro Enterprise',
    ip: '192.168.1.3',
    mac: '78:8a:20:44:55:66',
    channel24: 1,
    channel5: 36,
    channel6: 117,
    power24: 'High',
    power5: 'High',
    status: 'online',
    connectedClients: 8,
    temperature: 39.2,
    firmware: 'v4.7.1-CFE-SECURE',
    securityMode: 'WPA3-Enterprise',
    uptime: '45d 12h 10m'
  },
  {
    id: 'ap-3',
    name: 'AP Zona Perimetral Megacable',
    provider: 'Megacable Enterprise',
    model: 'Huawei AirEngine 6760-X1',
    ip: '192.168.1.4',
    mac: '90:9a:41:88:99:00',
    channel24: 11,
    channel5: 149,
    power24: 'Medium',
    power5: 'High',
    status: 'online',
    connectedClients: 5,
    temperature: 44.0,
    firmware: 'V200R022C10',
    securityMode: 'WPA3-SAE',
    uptime: '12d 4h 50m'
  },
  {
    id: 'ap-4',
    name: 'AP Cobertura Externa Go Wireless',
    provider: 'Go Wireless Pro',
    model: 'Aruba AP-555 Campus AP',
    ip: '192.168.1.6',
    mac: '00:0b:86:11:22:33',
    channel24: 6,
    channel5: 48,
    power24: 'High',
    power5: 'Medium',
    status: 'online',
    connectedClients: 9,
    temperature: 42.8,
    firmware: '8.11.0.0-86520',
    securityMode: 'WPA3-Enterprise',
    uptime: '9d 18h 41m'
  }
];

export const initialGuestNetworks: GuestNetwork[] = [
  {
    id: 'guest-1',
    ssid: 'NexusWave_Invitados_5G',
    password: 'WPA3_Guest_Secure_2026!',
    enabled: true,
    bandwidthLimitDown: 50,
    bandwidthLimitUp: 20,
    durationHours: 8,
    activeGuests: 6,
    security: 'WPA3-Guest',
    vlan: 20
  },
  {
    id: 'guest-2',
    ssid: 'NexusWave_Visitas_IoT',
    password: 'PortalCautivo2026*',
    enabled: true,
    bandwidthLimitDown: 15,
    bandwidthLimitUp: 5,
    durationHours: 4,
    activeGuests: 2,
    security: 'Captive Portal',
    vlan: 25
  }
];

export const initialCredentials: CredentialItem[] = [
  {
    id: 'cred-1',
    title: 'Router Principal Totalplay 10G Gateway',
    category: 'Router Root',
    username: 'root_admin_totalplay',
    encryptedPassword: 'TP_Secure#9821_WPA3Root!',
    host: '192.168.1.1',
    notes: 'Credencial principal de acceso root para fibra óptica simétrica 10Gbps.',
    lastUpdated: '2026-10-15',
    securityLevel: 'Maximum (WPA3)',
    owner: 'Ing. Carlos Mendoza (Director)'
  },
  {
    id: 'cred-2',
    title: 'Firewall Megacable Enterprise Gateway',
    category: 'Switch/Firewall',
    username: 'sysadmin_mega',
    encryptedPassword: 'Mega_Secure_Firewall#774!',
    host: '192.168.1.254',
    notes: 'Control de VLANs, filtrado MAC y reglas de mitigación DDoS.',
    lastUpdated: '2026-10-20',
    securityLevel: 'Maximum (WPA3)',
    owner: 'Lic. Sofía Rivas (Seguridad)'
  },
  {
    id: 'cred-3',
    title: 'Servidor de Telemetría CFE Substación',
    category: 'Admin Server',
    username: 'cfe_telemetry_root',
    encryptedPassword: 'CFE_Grid_Master_2026$$',
    host: '192.168.1.5',
    notes: 'Monitoreo crítico de enlaces de alta tensión y respaldo de energía.',
    lastUpdated: '2026-10-25',
    securityLevel: 'Maximum (WPA3)',
    owner: 'Ing. Alejandro Vega'
  },
  {
    id: 'cred-4',
    title: 'Controlador Go Wireless Cloud Master',
    category: 'ISP Portal',
    username: 'admin@gowireless.mx',
    encryptedPassword: 'GW_Pro_Access_9090!',
    host: 'cloud.gowireless.mx',
    notes: 'Gestión remota de nodos en campo y antenas direccionales.',
    lastUpdated: '2026-10-22',
    securityLevel: 'High',
    owner: 'Equipo Técnico Campo'
  },
  {
    id: 'cred-5',
    title: 'WPA3 Enterprise Radius Certificate Key',
    category: 'WPA3 Enterprise',
    username: 'radius_auth_service',
    encryptedPassword: 'WPA3_Enterprise_802.1X_CertKey',
    host: '192.168.1.10:1812',
    notes: 'Llave de autenticación basada en certificados para todo el personal técnico.',
    lastUpdated: '2026-10-26',
    securityLevel: 'Maximum (WPA3)',
    owner: 'Admin Principal'
  }
];

export const initialLogs: NetworkLog[] = [
  {
    id: 'log-1',
    timestamp: 'Hace 2 minutos',
    type: 'success',
    title: 'WPA3 Handshake Completado',
    description: 'Dispositivo MacBook Pro M3 Max autenticado exitosamente mediante SAE en 6GHz.',
    source: 'AP Principal Sala de Control'
  },
  {
    id: 'log-2',
    timestamp: 'Hace 14 minutos',
    type: 'security',
    title: 'Intento de Asociación Bloqueado (MAC No Autorizada)',
    description: 'Dispositivo desconocido (cc:44:99:11:22:33) bloqueado automáticamente por política WPA3.',
    source: 'AP Zona Perimetral Megacable'
  },
  {
    id: 'log-3',
    timestamp: 'Hace 1 hora',
    type: 'info',
    title: 'Optimización Automática de Canales WiFi',
    description: 'Canal 5GHz cambiado del canal 36 al 44 para evitar interferencia de radar DFS.',
    source: 'AP Nodo Operativo CFE'
  },
  {
    id: 'log-4',
    timestamp: 'Hace 3 horas',
    type: 'warning',
    title: 'Pico de Trono de Ancho de Banda Detectado',
    description: 'El servidor de telemetría CFE consumió 450Mbps sostenidos durante respaldo de base de datos.',
    source: 'Gateway Principal Totalplay'
  }
];

export const initialSpeedTest: SpeedTestResult = {
  timestamp: 'Hoy, 09:42 AM',
  download: 942.5,
  upload: 485.1,
  ping: 4.2,
  jitter: 0.8,
  server: 'Totalplay Fiber 10G Edge (CDMX)',
  isp: 'Totalplay / CFE Telecom'
};
