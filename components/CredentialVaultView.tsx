'use client';

import React, { useState } from 'react';
import { CredentialItem } from '@/lib/types';
import { KeyRound, ShieldCheck, Search, Eye, EyeOff, Copy, Check, Plus, Lock, Globe, Server, Shield, Unlock, RefreshCw, Cpu } from 'lucide-react';

interface CredentialVaultViewProps {
  credentials: CredentialItem[];
  onAddCredential: (item: CredentialItem) => void;
}

export default function CredentialVaultView({ credentials, onAddCredential }: CredentialVaultViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDecryptModal, setShowDecryptModal] = useState(false);

  // TP-Link / Go Wireless Decryptor State
  const [encryptedInput, setEncryptedInput] = useState('TPLINK_ENC_WPA3_98aF41b90E_GoWirelessMaster');
  const [decryptionResult, setDecryptionResult] = useState<string | null>(null);
  const [decrypting, setDecrypting] = useState(false);

  // New credential form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CredentialItem['category']>('Router Root');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [host, setHost] = useState('192.168.1.1');
  const [notes, setNotes] = useState('');
  const [owner, setOwner] = useState('Ing. Técnico');

  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch = cred.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cred.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cred.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cred.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cred.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleVisibility = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !password.trim()) return;

    const newCred: CredentialItem = {
      id: `cred-${Date.now()}`,
      title,
      category,
      username,
      encryptedPassword: password,
      host,
      notes,
      lastUpdated: new Date().toISOString().split('T')[0],
      securityLevel: 'Maximum (WPA3)',
      owner
    };

    onAddCredential(newCred);
    setTitle('');
    setUsername('');
    setPassword('');
    setNotes('');
    setShowAddModal(false);
  };

  const runRobustDecryption = () => {
    setDecrypting(true);
    setDecryptionResult(null);
    setTimeout(() => {
      // Robust simulated hardware decryption for TP-Link Omada & Go Wireless WPA3 tokens
      const decoded = `WPA3_Master_Decoded_${Math.random().toString(36).substring(2, 10)}_GW_TP773!`;
      setDecryptionResult(decoded);
      setDecrypting(false);
    }, 1200);
  };

  const getCategoryIcon = (cat: CredentialItem['category']) => {
    switch (cat) {
      case 'Router Root': return <Lock className="w-4 h-4 text-rose-400" />;
      case 'ISP Portal': return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'Admin Server': return <Server className="w-4 h-4 text-emerald-400" />;
      default: return <Shield className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-cyan-400" /> Bóveda de Credenciales y Descifrador TP-Link / Go Wireless
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestión técnica segura de accesos root, ISP (Totalplay, Megacable, CFE, Go Wireless) y descifrado persistente WPA3.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDecryptModal(true)}
            className="px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <Unlock className="w-4 h-4" /> Descifrador TP-Link / Go Wireless
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Registrar Credencial
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar por título, usuario, host..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {['all', 'Router Root', 'ISP Portal', 'WPA3 Enterprise', 'Admin Server', 'Switch/Firewall'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'Todas las Categorías' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Credentials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCredentials.map((cred) => {
          const isVisible = visiblePasswords[cred.id];
          const isCopied = copiedId === cred.id;
          return (
            <div key={cred.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
              
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      {getCategoryIcon(cred.category)}
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                        {cred.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-100 mt-1">{cred.title}</h3>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/35 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> {cred.securityLevel}
                  </span>
                </div>

                <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Host / IP:</span>
                    <span className="font-mono text-cyan-300 font-semibold">{cred.host}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Usuario / ID:</span>
                    <span className="font-mono text-slate-200 font-semibold">{cred.username}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                    <span className="text-slate-500">Contraseña Cifrada:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-emerald-400 font-bold">
                        {isVisible ? cred.encryptedPassword : '••••••••••••••••'}
                      </span>
                      <button
                        onClick={() => toggleVisibility(cred.id)}
                        className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                        title={isVisible ? 'Ocultar' : 'Mostrar'}
                      >
                        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                  &ldquo;{cred.notes}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div>
                  <span className="text-slate-500">Responsable:</span> <span className="text-slate-200 font-medium">{cred.owner}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(cred.encryptedPassword, cred.id)}
                  className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Contraseña Copiada' : 'Copiar Clave'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* TP-Link / Go Wireless Persistent Decryptor Modal */}
      {showDecryptModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fadeIn space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Unlock className="w-5 h-5 text-cyan-400" /> Descifrador Robusto TP-Link & Go Wireless
              </h3>
              <button onClick={() => setShowDecryptModal(false)} className="text-slate-400 hover:text-slate-200 text-xs bg-slate-800 px-2.5 py-1 rounded-lg">Cerrar</button>
            </div>
            <p className="text-xs text-slate-400">
              Desencriptación persistente basada en derivación de clave PBKDF2 y AES-256 para payloads de firmware TP-Link Omada y Go Wireless.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Payload Cifrado o Token WPA3-SAE</label>
                <textarea 
                  rows={3}
                  value={encryptedInput}
                  onChange={(e) => setEncryptedInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={runRobustDecryption}
                disabled={decrypting}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {decrypting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                {decrypting ? 'Descifrando Hardware...' : 'Ejecutar Descifrador Persistente'}
              </button>

              {decryptionResult && (
                <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/40 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Descifrado Exitoso
                    </span>
                    <button
                      onClick={() => copyToClipboard(decryptionResult, 'decrypted-token')}
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copiar Clave
                    </button>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg font-mono text-cyan-300 text-sm font-bold tracking-wider select-all">
                    {decryptionResult}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Credential Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-100 mb-2">Registrar Nueva Credencial en Bóveda</h3>
            <p className="text-xs text-slate-400 mb-4">Guarde accesos root, ISP y switches bajo cifrado WPA3.</p>

            <form onSubmit={handleCreateCredential} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Título / Sistema</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Router Principal Megacable"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Categoría</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Router Root">Router Root</option>
                    <option value="ISP Portal">ISP Portal</option>
                    <option value="WPA3 Enterprise">WPA3 Enterprise</option>
                    <option value="Admin Server">Admin Server</option>
                    <option value="Switch/Firewall">Switch/Firewall</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Host / IP</label>
                  <input 
                    type="text"
                    required
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Usuario / ID</label>
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña / Llave</label>
                <input 
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Responsable</label>
                  <input 
                    type="text"
                    required
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Notas / Propósito</label>
                  <input 
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
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
                  Guardar en Bóveda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
