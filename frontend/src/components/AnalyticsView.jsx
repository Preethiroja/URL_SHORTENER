import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Calendar, ShieldAlert, Monitor, Globe, BarChart2, Zap } from 'lucide-react';
import Loader from './Shared/Loader';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';

// Register ChartJS modules safely
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AnalyticsView = ({ token, urlId, onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Wrapped in useCallback to prevent unnecessary re-creations across render ticks
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/url/${urlId}/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Failed to fetch analytics');
      }

      setData(resData);
    } catch (err) {
      setError(err.message || 'Error occurred fetching analytics');
    } finally {
      setLoading(false);
    }
  }, [urlId, token]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const renderDistributionList = (statsArray, colorClass = '--primary') => {
    if (!statsArray || statsArray.length === 0) {
      return <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No data recorded</p>;
    }

    const sorted = [...statsArray].sort((a, b) => b.value - a.value);
    const total = sorted.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="device-stats-list">
        {sorted.map((item, idx) => {
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
          return (
            <div key={idx} className="device-stat-row">
              <span className="device-stat-name">{item.name || 'Unknown'}</span>
              <div className="device-stat-bar-container">
                <div 
                  className="device-stat-bar" 
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: `var(${colorClass})`,
                    boxShadow: `0 0 10px var(${colorClass}-glow)`
                  }}
                ></div>
              </div>
              <span className="device-stat-count">
                {item.value} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <button className="analytics-back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <Loader message="Gathering click analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <button className="analytics-back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="alert alert-error" style={{ marginTop: '1.5rem' }}>
          <ShieldAlert size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const { url, totalClicks, lastVisit, visits, browserStats, osStats, deviceStats, dailyClicks } = data;

  const chartData = {
    labels: dailyClicks.map(d => formatDateLabel(d.date)),
    datasets: [
      {
        fill: true,
        label: 'Clicks',
        data: dailyClicks.map(d => d.clicks),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.06)',
        tension: 0.3,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#111827',
        titleFont: { family: 'Outfit', size: 13 },
        bodyFont: { family: 'Outfit', size: 13 },
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        padding: 10,
        displayColors: false
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Outfit' },
          stepSize: 1,
          precision: 0
        },
        beginAtZero: true
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Outfit' }
        }
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="analytics-header">
        <button className="analytics-back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>

      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Analytics Overview</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Detailed link statistics for <strong style={{ color: 'var(--accent)' }}>{url.title || 'Untitled Link'}</strong>
        </p>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem', wordBreak: 'break-all' }}>
          Original Link: <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">{url.originalUrl}</a>
        </span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
          Short URL: <a href={`${API_BASE}/${url.shortCode}`} target="_blank" rel="noopener noreferrer">{API_BASE}/{url.shortCode}</a>
        </span>
      </div>

      {/* Stats Summary Cards */}
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-icon">
            <BarChart2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Clicks</span>
            <span className="stat-value">{totalClicks}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon accent">
            <Zap size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Last Click Visit</span>
            <span className="stat-value" style={{ fontSize: lastVisit ? '1.1rem' : '1.5rem', fontWeight: 600 }}>
              {lastVisit ? formatDate(lastVisit) : 'No visits'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-glow)', color: 'var(--success)' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Created Date</span>
            <span className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {new Date(url.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Click Trends Chart */}
      <div className="analytics-grid">
        <div className="chart-wrapper">
          <div className="chart-title">
            <BarChart2 size={18} style={{ color: 'var(--primary)' }} />
            <span>Click Trend (Last 7 Days)</span>
          </div>
          <div className="chart-container" style={{ position: 'relative', height: '250px', width: '100%' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="chart-wrapper">
          <div className="chart-title">
            <Monitor size={18} style={{ color: 'var(--accent)' }} />
            <span>Device Type</span>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            {renderDistributionList(deviceStats, '--accent')}
          </div>
        </div>
      </div>

      {/* Browsers & OS Breakdown */}
      <div className="analytics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="chart-wrapper">
          <div className="chart-title">
            <Globe size={18} style={{ color: 'var(--primary)' }} />
            <span>Top Browsers</span>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            {renderDistributionList(browserStats, '--primary')}
          </div>
        </div>

        <div className="chart-wrapper">
          <div className="chart-title">
            <Monitor size={18} style={{ color: 'var(--accent)' }} />
            <span>Operating Systems</span>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            {renderDistributionList(osStats, '--accent')}
          </div>
        </div>
      </div>

      {/* Detailed Visit History Logs */}
      <div className="card" style={{ gap: '1rem' }}>
        <div className="card-title">
          <Monitor size={20} style={{ color: 'var(--success)' }} />
          <span>Recent Visit Logs (Up to 50 clicks)</span>
        </div>

        {visits.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', padding: '1rem 0' }}>No visit logs available yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th className="hide-mobile">IP Address</th>
                  <th>Browser</th>
                  <th className="hide-mobile">OS</th>
                  <th>Device</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit, index) => (
                  <tr key={visit._id || index}>
                    <td style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {formatDate(visit.timestamp)}
                    </td>
                    <td className="hide-mobile" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {visit.ip}
                    </td>
                    <td style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {visit.browser}
                    </td>
                    <td className="hide-mobile" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {visit.os}
                    </td>
                    <td style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      <span style={{ textTransform: 'capitalize' }}>{visit.device}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsView;