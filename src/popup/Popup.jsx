import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Popup() {
  const [tab, setTab] = useState('core');
  const [config, setConfig] = useState({});
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ likes: 0, skips: 0, errors: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [logFilter, setLogFilter] = useState('');
  const storage = chrome.storage.sync;

  useEffect(() => {
    storage.get(null, (data) => {
      setConfig(data);
      setLogs(data.logs || []);
      setStats(data.stats || { likes: 0, skips: 0, errors: 0 });
      setIsPaused(data.isPaused || false);
    });
  }, []);

  const saveConfig = () => {
    storage.set(config);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'updateConfig', config });
    });
    alert('保存成功');
  };

  const togglePause = () => {
    const newPaused = !isPaused;
    setIsPaused(newPaused);
    storage.set({ isPaused: newPaused });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: newPaused ? 'pause' : 'resume' });
    });
  };

  const testExecute = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'test' });
    });
  };

  const resetConfig = () => {
    if (confirm('重置默认？')) {
      storage.clear();
      location.reload();
    }
  };

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(config)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    a.click();
  };

  const drawStatsChart = () => {
    const data = {
      labels: ['点赞', '跳过', '错误'],
      datasets: [{
        data: [stats.likes, stats.skips, stats.errors],
        backgroundColor: ['#4CAF50', '#FF9800', '#f44336']
      }]
    };
    return <Pie data={data} />;
  };

  // 日志过滤
  const filteredLogs = logs.filter(l => l.includes(logFilter));

  // UI 组件
  const tabs = {
    core: (
      <div className="space-y-4">
        <label className="block">刷新频率 (秒): <input type="number" value={config.duration || ''} onChange={e => setConfig({...config, duration: +e.target.value})} className="ml-2 border rounded px-2" min="30" /></label>
        <label className="block">点赞延迟 (秒): <input type="number" value={config.likeDelay || ''} onChange={e => setConfig({...config, likeDelay: +e.target.value})} className="ml-2 border rounded px-2" min="1" /></label>
        <label className="block">滚动次数: <input type="number" value={config.scrollCount || ''} onChange={e => setConfig({...config, scrollCount: +e.target.value})} className="ml-2 border rounded px-2" min="1" /></label>
        <label className="block">每日上限: <input type="number" value={config.dailyLimit || ''} onChange={e => setConfig({...config, dailyLimit: +e.target.value})} className="ml-2 border rounded px-2" min="0" /></label>
      </div>
    ),
    ui: (
      <div className="space-y-4">
        <label>主题: <select value={config.theme || 'default'} onChange={e => setConfig({...config, theme: e.target.value})} className="ml-2 border rounded px-2">
          <option value="default">默认</option>
          <option value="tech">科技蓝</option>
          <option value="eco">环保绿</option>
        </select></label>
        <label>状态栏透明度: <input type="number" value={config.statusOpacity || ''} onChange={e => setConfig({...config, statusOpacity: +e.target.value})} className="ml-2 border rounded px-2" min="0.1" max="1" step="0.1" /></label>
        <label>暗黑模式自动: <input type="checkbox" checked={!!config.darkModeAuto} onChange={e => setConfig({...config, darkModeAuto: e.target.checked})} className="ml-2" /></label>
      </div>
    ),
    filter: (
      <div className="space-y-4">
        <label>关键词过滤(逗号分隔): <textarea value={config.filterKeywords ? config.filterKeywords.join(',') : ''} onChange={e => setConfig({...config, filterKeywords: e.target.value.split(',').map(s => s.trim())})} className="w-full border rounded px-2" rows={2} /></label>
        <label>过滤模式: <select value={config.filterMode || 'block'} onChange={e => setConfig({...config, filterMode: e.target.value})} className="ml-2 border rounded px-2">
          <option value="block">屏蔽</option>
          <option value="allow">仅允许</option>
        </select></label>
        <label>黑名单(逗号分隔): <textarea value={config.blocked ? config.blocked.join(',') : ''} onChange={e => setConfig({...config, blocked: e.target.value.split(',').map(s => s.trim())})} className="w-full border rounded px-2" rows={2} /></label>
        <label>白名单(逗号分隔): <textarea value={config.whiteList ? config.whiteList.join(',') : ''} onChange={e => setConfig({...config, whiteList: e.target.value.split(',').map(s => s.trim())})} className="w-full border rounded px-2" rows={2} /></label>
      </div>
    ),
    logs: (
      <div>
        <input type="text" placeholder="搜索日志..." className="w-full mb-2 border rounded px-2" value={logFilter} onChange={e => setLogFilter(e.target.value)} />
        <table className="w-full border-collapse text-xs dark:text-white">
          <thead><tr><th>时间</th><th>级别</th><th>消息</th></tr></thead>
          <tbody>{filteredLogs.map((l, i) => <tr key={i}><td>{l.split('] [')[0].slice(1)}</td><td>{l.split('] [')[1].split('] ')[0]}</td><td>{l.split('] ')[2]}</td></tr>)}</tbody>
        </table>
      </div>
    ),
    stats: (
      <div>
        {drawStatsChart()}
        <p>点赞: {stats.likes} | 跳过: {stats.skips} | 错误: {stats.errors}</p>
        <button onClick={() => { setStats({ likes: 0, skips: 0, errors: 0 }); storage.set({ stats: { likes: 0, skips: 0, errors: 0 } }); }} className="bg-red-500 text-white px-4 py-2 rounded">清除统计</button>
      </div>
    ),
    accounts: (
      <div className="space-y-4">
        <label>当前账号: <input type="text" value={config.currentAccount || ''} onChange={e => setConfig({...config, currentAccount: e.target.value})} className="ml-2 border rounded px-2" /></label>
        <label>账号列表(逗号分隔): <textarea value={config.accounts ? Object.keys(config.accounts).join(',') : ''} onChange={e => setConfig({...config, accounts: Object.fromEntries(e.target.value.split(',').map(s => [s.trim(), true]))})} className="w-full border rounded px-2" rows={2} /></label>
      </div>
    )
  };

  return (
    <div className="p-4 w-96 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="flex space-x-2 mb-4">
        <button onClick={() => setTab('core')} className={`px-4 py-2 rounded ${tab === 'core' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>核心</button>
        <button onClick={() => setTab('ui')} className={`px-4 py-2 rounded ${tab === 'ui' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>界面</button>
        <button onClick={() => setTab('filter')} className={`px-4 py-2 rounded ${tab === 'filter' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>过滤</button>
        <button onClick={() => setTab('logs')} className={`px-4 py-2 rounded ${tab === 'logs' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>日志</button>
        <button onClick={() => setTab('stats')} className={`px-4 py-2 rounded ${tab === 'stats' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>统计</button>
        <button onClick={() => setTab('accounts')} className={`px-4 py-2 rounded ${tab === 'accounts' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>账号</button>
      </div>
      {tabs[tab]}
      <div className="mt-4 flex space-x-2">
        <button onClick={saveConfig} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">保存</button>
        <button onClick={togglePause} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">{isPaused ? '恢复' : '暂停'}</button>
        <button onClick={testExecute} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">测试</button>
        <button onClick={resetConfig} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">重置</button>
        <button onClick={exportConfig} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition">导出</button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Popup />);
