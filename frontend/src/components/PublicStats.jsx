import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart2, ExternalLink, ArrowLeft, Globe } from 'lucide-react';
import Loader from './Shared/Loader';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PublicStats = () => {
  const { id } = useParams(); 
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetching without passing any Authorization Bearer header token
        const response = await fetch(`${API_BASE}/api/url/public-stats/${id}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || 'Failed to view public link data');
        setStats(data);
      } catch (err) {
        setError(err.message || 'Error loading dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [id]);

  if (loading) return <Loader message="Loading public metrics panel..." />;

  if (error) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <h2>Link Stats Unavailable</h2>
        <p>{error}</p>
        <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Public Link Insights</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time usage tracking infrastructure indicators</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '0.4rem 0.8rem', borderRadius: '20px', background: 'rgba(0,128,0,0.1)', color: 'green' }}>
          <Globe size={14} /> Public View Enabled
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>{stats?.title || 'Untitled Redirect'}</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
          Destination: <a href={stats?.originalUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>{stats?.originalUrl} <ExternalLink size={12} style={{ display: 'inline' }} /></a>
        </p>
      </div>

      {/* Counter Block */}
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center', borderTop: '4px solid var(--primary)' }}>
        <BarChart2 size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
        <p style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', color: 'var(--text-secondary)', margin: 0 }}>Total Engagement Events</p>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0.5rem 0' }}>{stats?.clickCount || 0}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Clicks are recorded instantly as traffic flows through our gateway infrastructure</p>
      </div>
    </div>
  );
};

export default PublicStats;