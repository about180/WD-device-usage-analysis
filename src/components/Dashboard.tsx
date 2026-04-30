import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Search, AlertTriangle, ArrowLeft, Filter, 
  Users, Cpu, Activity, PieChart as PieChartIcon, 
  Info, ChevronDown, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReceiverLog, UserQueryRow, FirmwareRow, ReceiverAnalysisRow, UsageShareRow } from '../types';
import { generateHSLColor } from '../utils/dataProcessor';

interface DashboardProps {
  data: ReceiverLog[];
  onReset: () => void;
  filename: string;
}

export default function Dashboard({ data, onReset, filename }: DashboardProps) {
  const [selectedMac, setSelectedMac] = useState<string>('All');
  const [startTime, setStartTime] = useState<string>('All');
  const [activeTab, setActiveTab] = useState(0);

  // Global All MACs
  const allMacs = useMemo(() => Array.from(new Set(data.map(d => d.receiverMac))).sort(), [data]);

  // Filtered data based on global MAC filter and Time filter
  const filteredData = useMemo(() => {
    let filtered = selectedMac === 'All' ? data : data.filter(d => d.receiverMac === selectedMac);
    
    if (startTime !== 'All') {
      const now = new Date();
      let filterDate = new Date();
      
      if (startTime === '1h') filterDate.setHours(now.getHours() - 1);
      else if (startTime === '24h') filterDate.setHours(now.getHours() - 24);
      else if (startTime === '7d') filterDate.setDate(now.getDate() - 7);
      else if (startTime === '30d') filterDate.setDate(now.getDate() - 30);
      else if (startTime === '90d') filterDate.setDate(now.getDate() - 90);
      else if (startTime === '180d') filterDate.setDate(now.getDate() - 180);
      else if (startTime === '365d') filterDate.setDate(now.getDate() - 365);

      filtered = filtered.filter(d => {
        if (!d.recordTime) return false;
        const dDate = new Date(d.recordTime);
        return dDate >= filterDate;
      });
    }
    
    return filtered;
  }, [data, selectedMac, startTime]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navigation & Global Filter Bar */}
      <header className="h-16 bg-white border-b px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Upload New File
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            Device Usage <span className="text-blue-600">Analyzer</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-wider">Date & Time</label>
            <div className="relative">
              <select 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-white border-slate-200 rounded px-3 py-1 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none pr-8 appearance-none cursor-pointer min-w-[100px]"
              >
                <option value="All">All Time</option>
                <option value="1h">Past 1 Hour</option>
                <option value="24h">Past 24 Hours</option>
                <option value="7d">Past 7 Days</option>
                <option value="30d">Past 30 Days</option>
                <option value="90d">Past Quarter</option>
                <option value="180d">Past Half Year</option>
                <option value="365d">Past Year</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1.5 pointer-events-none text-slate-400" />
            </div>
          </div>

          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Global Device</label>
          <div className="relative">
            <select 
              value={selectedMac}
              onChange={(e) => setSelectedMac(e.target.value)}
              className="bg-white border-slate-200 rounded px-3 py-1 text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500 outline-none pr-8 appearance-none cursor-pointer"
            >
              <option value="All">All Receivers ({allMacs.length})</option>
              {allMacs.map(mac => <option key={mac} value={mac}>{mac}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1.5 pointer-events-none text-slate-400" />
          </div>
        </div>
      </header>

      {/* Tab System */}
      <nav className="h-12 bg-white border-b px-6 flex items-center gap-8 text-sm font-medium text-slate-500 flex-shrink-0 sticky top-16 z-40">
        {[
          { label: 'User Query' },
          { label: 'Firmware Version' },
          { label: 'Receiver Analysis' },
          { label: 'Usage Duration Share' },
          { label: 'Receiver Reboot' }
        ].map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`h-full flex items-center px-1 transition-all relative ${activeTab === idx ? 'text-blue-600' : 'hover:text-slate-900'}`}
          >
            {tab.label}
            {activeTab === idx && (
              <motion.div 
                layoutId="activeTab" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" 
              />
            )}
          </button>
        ))}
      </nav>

      {/* Dashboard Content Area */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6">
        {/* Sidebar Info Card */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">File Insight</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-500 font-medium">Active Records</span>
                <span className="text-xl font-bold text-slate-900">{data.length.toLocaleString()}</span>
              </div>
              <div className="h-px bg-slate-100"></div>
              <div className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Currently analyzing: <br/>
                <span className="text-slate-600 font-mono break-all">{filename}</span>
              </div>
              
              {/* Sparkline Visual - Decorative */}
              <div className="flex items-end gap-1 h-12 pt-2">
                {[0.4, 0.65, 0.9, 0.55, 0.3, 0.7, 0.45].map((h, i) => (
                  <div 
                    key={i} 
                    className={`w-full rounded-t-sm ${i === 2 ? 'bg-blue-600' : 'bg-blue-100'}`} 
                    style={{ height: `${h * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Contextual Sidebar Content (Filters) */}
          {activeTab === 0 && (
            <div id="tab-0-sidebar" />
          )}
        </aside>

        {/* Main Content Area */}
        <section className="col-span-12 lg:col-span-9">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 0 && <TabUserQuery data={filteredData} />}
            {activeTab === 1 && <TabFirmware data={filteredData} />}
            {activeTab === 2 && <TabReceiver data={filteredData} selectedMac={selectedMac} />}
            {activeTab === 3 && <TabUsageShare data={filteredData} />}
            {activeTab === 4 && <TabReboot data={filteredData} selectedMac={selectedMac} />}
          </motion.div>
        </section>
      </main>
    </div>
  );
}

// --- TAB COMPONENTS ---

function TabUserQuery({ data }: { data: ReceiverLog[] }) {
  const [sourceNameFilter, setSourceNameFilter] = useState('All');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [popupInfo, setPopupInfo] = useState<UserQueryRow['multipleValues'] | null>(null);

  const sourceNames = useMemo(() => Array.from(new Set(data.map(d => d.sourceName))).sort(), [data]);

  const queryResults = useMemo(() => {
    if (!searchTriggered) return [];
    
    const filtered = sourceNameFilter === 'All' 
      ? data 
      : data.filter(d => d.sourceName === sourceNameFilter);

    const groups: Record<string, ReceiverLog[]> = {};
    filtered.forEach(log => {
      const key = `${log.sourceName}|${log.receiverMac}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(log);
    });

    return Object.entries(groups).map(([key, logs]) => {
      const [_user, mac] = key.split('|');
      const uniqueNames = Array.from(new Set(logs.map(l => l.receiverName)));
      const uniqueChannels = Array.from(new Set(logs.map(l => l.channel)));
      const uniqueFWs = Array.from(new Set(logs.map(l => l.firmwareVersion)));

      const totalDuration = logs.reduce((sum, l) => sum + l.duration, 0);
      const maxDuration = Math.max(...logs.map(l => l.duration));

      const success = logs.filter(l => 
        l.eventDescription.includes('Connection success') || 
        l.eventDescription.includes('Airplay connection success') ||
        l.eventDescription.includes('ChromeCast connection success') ||
        l.eventDescription.includes('Infracast connection success') ||
        l.eventDescription.includes('HDMI input connected')
      ).length;

      const normalDis = logs.filter(l => 
        l.eventDescription.includes('Received RTSP tear-down from Source') || 
        l.eventDescription.includes('RTSP parsing error') ||
        l.eventDescription.includes('Airplay disconnect') ||
        l.eventDescription.includes('Chromecast disconnect') ||
        l.eventDescription.includes('Infracast disconnect') ||
        l.eventDescription.includes('HDMI input disconnect')
      ).length;

      const abnormalDis = logs.filter(l => 
        l.eventDescription.includes('Connection failed due to P2P connect fail') || 
        l.eventDescription.includes('Connection failed due to RTSP fail') ||
        l.eventDescription.includes('Media path error recovery') ||
        l.eventDescription.includes('Received disconnected-from-peer message from the hostapd')
      ).length;

      const hasMultiple = uniqueNames.length > 1 || uniqueChannels.length > 1 || uniqueFWs.length > 1;

      return {
        sourceUser: logs[0].sourceName,
        receiverName: logs[0].receiverName,
        receiverMac: mac,
        totalDuration,
        maxDuration,
        connectionSuccess: success,
        normalDisconnect: normalDis,
        abnormalDisconnect: abnormalDis,
        hasMultipleValues: hasMultiple,
        multipleValues: hasMultiple ? {
          receiverNames: uniqueNames,
          channels: uniqueChannels,
          firmwareVersions: uniqueFWs
        } : undefined
      } as UserQueryRow;
    });
  }, [data, sourceNameFilter, searchTriggered]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search Sidebar - Teleported/Rendered conditionally elsewhere if we had a proper layout, 
          but here we'll place it at the top for mobile and potentially sidebar for desktop if we use a portal or similar.
          For this exercise, I'll put the filter in a sidebar-like card above the table.
      */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Search Parameters</h3>
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Source Name</label>
            <div className="relative">
              <select
                value={sourceNameFilter}
                onChange={(e) => {
                  setSourceNameFilter(e.target.value);
                  setSearchTriggered(false);
                }}
                className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium cursor-pointer"
              >
                <option value="All">All Source Names</option>
                {sourceNames.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 pointer-events-none text-slate-400" />
            </div>
          </div>
          <button
            onClick={() => setSearchTriggered(true)}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Execute Search
          </button>
        </div>
      </div>

      {searchTriggered && (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-700">User Query Results</h2>
            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">
              Showing {queryResults.length} Matches
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b bg-white">
                  {['Source User', 'Receiver Name', 'Receiver MAC', 'Max (s)', 'Total (s)', 'Succ / Disc / Abn', 'Alert'].map(h => (
                    <th key={h} className={`px-4 py-3 font-bold ${h.includes('/') || h === 'Alert' ? 'text-center' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y text-[13px]">
                {queryResults.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3 font-semibold text-slate-900 group-hover:text-blue-600">{row.sourceUser}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-medium text-slate-600">
                        {row.receiverName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        {row.receiverMac}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">{row.maxDuration.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono font-medium text-slate-700">{row.totalDuration.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1.5 font-bold">
                        <span className="text-green-600">{row.connectionSuccess}</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-blue-500">{row.normalDisconnect}</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-red-500">{row.abnormalDisconnect}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.hasMultipleValues && (
                        <button
                          onClick={() => setPopupInfo(row.multipleValues!)}
                          className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold hover:bg-amber-100 transition-colors inline-flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Multiple Values
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {queryResults.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-400 italic">No matches found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Success</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Normal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Abnormal</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
              {queryResults.length > 0 ? `Showing ${queryResults.length} matched users` : 'No data'}
            </div>
          </div>
        </div>
      )}

      {/* Popup Overlay */}
      <AnimatePresence>
        {popupInfo && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPopupInfo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-200"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 text-amber-600 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-lg font-bold tracking-tight uppercase">Multiple Attributes Found</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Receiver Names', data: popupInfo.receiverNames },
                  { label: 'Channels', data: popupInfo.channels },
                  { label: 'Firmware Versions', data: popupInfo.firmwareVersions }
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.data.map((v, ii) => (
                        <span key={ii} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-xs font-medium text-slate-600">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPopupInfo(null)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors mt-6 shadow-lg shadow-slate-900/10"
              >
                Close Insights
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabFirmware({ data }: { data: ReceiverLog[] }) {
  const chartData = useMemo(() => {
    const fws: Record<string, Set<string>> = {};
    const names: Record<string, Set<string>> = {};

    data.forEach(log => {
      if (!fws[log.firmwareVersion]) {
        fws[log.firmwareVersion] = new Set();
        names[log.firmwareVersion] = new Set();
      }
      fws[log.firmwareVersion].add(log.receiverMac);
      names[log.firmwareVersion].add(log.receiverName);
    });

    return Object.entries(fws).map(([version, macs]) => ({
      version,
      deviceCount: macs.size,
      receiverNames: Array.from(names[version])
    })).sort((a, b) => b.version.localeCompare(a.version));
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight mb-8">Firmware Distribution</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="version" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} 
                dx={-10}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="deviceCount" fill="#2563eb" radius={[4, 4, 0, 0]} name="Device Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <th className="px-6 py-4">Version</th>
              <th className="px-6 py-4">Receivers</th>
              <th className="px-6 py-4 text-right">Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[13px]">
            {chartData.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-slate-900">{row.version}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {row.receiverNames.map(name => (
                      <span key={name} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-bold text-slate-500">
                        {name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-base font-bold text-slate-900">{row.deviceCount}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabReceiver({ data, selectedMac }: { data: ReceiverLog[], selectedMac: string }) {
  const stats = useMemo(() => {
    const uniqueNames = Array.from(new Set(data.map(d => d.receiverName)));
    return {
      name: selectedMac === 'All' ? `${uniqueNames.length} Devices` : data[0]?.receiverName,
      mac: selectedMac === 'All' ? 'Multiple Selected' : selectedMac,
      totalEvents: data.length
    };
  }, [data, selectedMac]);

  const userStats = useMemo(() => {
    const groups: Record<string, number[]> = {};
    data.forEach(log => {
      if (!groups[log.sourceName]) groups[log.sourceName] = [];
      groups[log.sourceName].push(log.duration);
    });

    return Object.entries(groups).map(([user, durations]) => ({
      sourceUser: user,
      totalDuration: durations.reduce((a, b) => a + b, 0),
      maxDuration: Math.max(...durations)
    })).sort((a, b) => b.totalDuration - a.totalDuration);
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Receiver Name', value: stats.name, icon: Monitor, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Receiver MAC', value: stats.mac, icon: Filter, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Total Events', value: stats.totalEvents.toLocaleString(), icon: Info, color: 'text-emerald-600', bg: 'bg-emerald-50' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className={`p-2.5 rounded-lg ${item.bg}`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
              <p className="text-lg font-bold text-slate-800 break-all">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Performance Comparison</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Total</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-200" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Max</span>
            </div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userStats} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="sourceUser" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                angle={-45}
                textAnchor="end"
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
              />
              <Bar dataKey="totalDuration" fill="#2563eb" radius={[3, 3, 0, 0]} name="Total Duration" />
              <Bar dataKey="maxDuration" fill="#bfdbfe" radius={[3, 3, 0, 0]} name="Max Duration" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <th className="px-6 py-4">Source User</th>
              <th className="px-6 py-4 text-right">Total Duration (s)</th>
              <th className="px-6 py-4 text-right">Max Duration (s)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[13px]">
            {userStats.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{row.sourceUser}</td>
                <td className="px-6 py-4 font-mono font-medium text-right text-slate-600">{row.totalDuration.toLocaleString()}</td>
                <td className="px-6 py-4 font-mono text-slate-400 text-right">{row.maxDuration.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabUsageShare({ data }: { data: ReceiverLog[] }) {
  const shareData = useMemo(() => {
    const groups: Record<string, number> = {};
    data.forEach(log => {
      groups[log.sourceName] = (groups[log.sourceName] || 0) + log.duration;
    });

    const total = Object.values(groups).reduce((a, b) => a + b, 0);
    
    return Object.entries(groups)
      .map(([user, dur], idx, arr) => ({
        sourceUser: user,
        totalDuration: dur,
        share: total > 0 ? (dur / total) * 100 : 0,
        color: generateHSLColor(idx, arr.length)
      }))
      .sort((a, b) => b.totalDuration - a.totalDuration);
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Duration Share Overview</h3>
          <Info className="w-4 h-4 text-slate-300" />
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={shareData}
                dataKey="totalDuration"
                nameKey="sourceUser"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                stroke="none"
              >
                {shareData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                formatter={(val: number) => [`${val.toLocaleString()}s`, 'Duration']}
              />
              <Legend 
                layout="vertical" 
                align="right" 
                verticalAlign="middle" 
                iconType="rect"
                wrapperStyle={{ paddingLeft: '20px', fontSize: '11px', fontWeight: 600, color: '#64748b' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              <th className="px-6 py-4">Source User</th>
              <th className="px-6 py-4 text-right">Total (s)</th>
              <th className="px-6 py-4 text-right">Share (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[13px]">
            {shareData.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: row.color }} />
                  <span className="font-bold text-slate-800">{row.sourceUser}</span>
                </td>
                <td className="px-6 py-4 font-mono text-right font-medium text-slate-600">{row.totalDuration.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-[12px] font-black text-slate-900">{row.share.toFixed(1)}%</span>
                    <div className="w-20 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${row.share}%` }} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabReboot({ data, selectedMac }: { data: ReceiverLog[], selectedMac: string }) {
  const stats = useMemo(() => {
    const uniqueNames = Array.from(new Set(data.map(d => d.receiverName)));
    return {
      name: selectedMac === 'All' ? `${uniqueNames.length} Devices` : data[0]?.receiverName,
      mac: selectedMac === 'All' ? 'Multiple Selected' : selectedMac,
      totalEvents: data.length
    };
  }, [data, selectedMac]);

  const rebootStats = useMemo(() => {
    const groups: Record<string, { 
      name: string,
      mgt: number, 
      cms: number, 
      usb: number, 
      inactivity: number, 
      web: number, 
      restarted: number,
      fault: number,
      mem: number,
      watchdog: number,
      initFail: number,
      player: number,
      netd: number,
      normalTotal: number,
      abnormalTotal: number
    }> = {};

    data.forEach(log => {
      if (!groups[log.receiverName]) {
        groups[log.receiverName] = { 
          name: log.receiverName,
          mgt: 0, cms: 0, usb: 0, inactivity: 0, web: 0, restarted: 0,
          fault: 0, mem: 0, watchdog: 0, initFail: 0, player: 0, netd: 0,
          normalTotal: 0, abnormalTotal: 0
        };
      }
      const g = groups[log.receiverName];
      const desc = log.eventDescription;

      if (desc.includes('Reboot by local MGT')) { g.mgt++; g.normalTotal++; }
      else if (desc.includes('Reboot by CMS policy')) { g.cms++; g.normalTotal++; }
      else if (desc.includes('Reboot by USB config')) { g.usb++; g.normalTotal++; }
      else if (desc.includes('Reboot due to inactivity')) { g.inactivity++; g.normalTotal++; }
      else if (desc.includes('Reboot by web or CMS config') || desc.includes('Reboot by web/CMS config')) { g.web++; g.normalTotal++; }
      else if (desc.includes('Reboot due to process restarted') || desc.includes('Reboot process restarted')) { g.restarted++; g.abnormalTotal++; }
      else if (desc.includes('Reboot due to exception fault') || desc.includes('Reboot exception fault')) { g.fault++; g.abnormalTotal++; }
      else if (desc.includes('Reboot due to memory full') || desc.includes('Reboot memory full')) { g.mem++; g.abnormalTotal++; }
      else if (desc.includes('Reboot due to hardware watchdog') || desc.includes('Reboot hardware watchdog')) { g.watchdog++; g.abnormalTotal++; }
      else if (desc.includes('Reboot due to system init failure') || desc.includes('Reboot system init failure')) { g.initFail++; g.abnormalTotal++; }
      else if (desc.includes('Reboot due to unresponsive mediaplayer') || desc.includes('Reboot unresponsive mediaplayer')) { g.player++; g.abnormalTotal++; }
      else if (desc.includes('Reboot due to Lost connection to Netd') || desc.includes('Reboot Lost connection to Netd')) { g.netd++; g.abnormalTotal++; }
    });

    return Object.values(groups).sort((a, b) => (b.normalTotal + b.abnormalTotal) - (a.normalTotal + a.abnormalTotal));
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Receiver Name', value: stats.name, icon: Monitor, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Receiver MAC', value: stats.mac, icon: Filter, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Total Events', value: stats.totalEvents.toLocaleString(), icon: Info, color: 'text-emerald-600', bg: 'bg-emerald-50' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className={`p-2.5 rounded-lg ${item.bg}`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
              <p className="text-lg font-bold text-slate-800 break-all">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Reboot Summary Chart</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Abnormal</span>
            </div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rebootStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
              />
              <Bar dataKey="normalTotal" fill="#2563eb" radius={[3, 3, 0, 0]} name="Normal Reboot" />
              <Bar dataKey="abnormalTotal" fill="#ef4444" radius={[3, 3, 0, 0]} name="Abnormal Reboot" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Normal Reboot Analysis</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-white border-b text-slate-400">
                  <th className="px-4 py-3">Receiver Name</th>
                  <th className="px-2 py-3 text-center">Local MGT</th>
                  <th className="px-2 py-3 text-center">CMS Pol</th>
                  <th className="px-2 py-3 text-center">USB Config</th>
                  <th className="px-2 py-3 text-center">Inactivity</th>
                  <th className="px-2 py-3 text-center">Web/CMS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rebootStats.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-bold text-slate-800">{row.name}</td>
                    <td className="px-2 py-3 text-center font-mono">{row.mgt}</td>
                    <td className="px-2 py-3 text-center font-mono">{row.cms}</td>
                    <td className="px-2 py-3 text-center font-mono">{row.usb}</td>
                    <td className="px-2 py-3 text-center font-mono">{row.inactivity}</td>
                    <td className="px-2 py-3 text-center font-mono">{row.web}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h3 className="text-xs font-black text-red-400 uppercase tracking-widest">Abnormal Reboot Analysis</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-white border-b text-slate-400">
                  <th className="px-4 py-3">Receiver Name</th>
                  <th className="px-2 py-3 text-center">Fault</th>
                  <th className="px-2 py-3 text-center">Mem Full</th>
                  <th className="px-2 py-3 text-center">Watchdog</th>
                  <th className="px-2 py-3 text-center">Init Fail</th>
                  <th className="px-2 py-3 text-center">Media Plyr</th>
                  <th className="px-2 py-3 text-center">Netd Lost</th>
                  <th className="px-2 py-3 text-center">Restarted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rebootStats.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-bold text-slate-800">{row.name}</td>
                    <td className="px-2 py-3 text-center font-mono text-red-600">{row.fault}</td>
                    <td className="px-2 py-3 text-center font-mono text-red-600">{row.mem}</td>
                    <td className="px-2 py-3 text-center font-mono text-red-600">{row.watchdog}</td>
                    <td className="px-2 py-3 text-center font-mono text-red-600">{row.initFail}</td>
                    <td className="px-2 py-3 text-center font-mono text-red-600">{row.player}</td>
                    <td className="px-2 py-3 text-center font-mono text-red-600">{row.netd}</td>
                    <td className="px-2 py-3 text-center font-mono text-red-600">{row.restarted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
