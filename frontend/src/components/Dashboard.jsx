import React, { useState, useEffect } from 'react';
import { Copy, BarChart2, QrCode, Trash2, Edit2, ExternalLink, Link as LinkIcon, RefreshCw, AlertCircle } from 'lucide-react';
import LinkForm from './LinkForm';
import QRModal from './QRModal';
import EditModal from './EditModal';
import Loader from './Shared/Loader';
import ThemeToggle from './ThemeToggle';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = ({ token, user, onViewAnalytics }) => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copyFeedback, setCopyFeedback] = useState({}); // Stores shortCode -> boolean mapping for copied state
  
  // Modal states
  const [selectedQrUrl, setSelectedQrUrl] = useState(null);
  const [selectedEditUrl, setSelectedEditUrl] = useState(null);

  const fetchUrls = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/url`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch links');
      }

      setUrls(data);
    } catch (err) {
      setError(err.message || 'Error fetching links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [token]);

  const handleUrlAdded = (newUrl) => {
    setUrls((prevUrls) => [newUrl, ...prevUrls]);
  };

  const handleUrlUpdated = (updatedUrl) => {
    setUrls((prevUrls) => 
      prevUrls.map((url) => (url._id === updatedUrl._id ? updatedUrl : url))
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shortened URL? This will also remove all analytics for this link.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/url/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete URL');
      }

      setUrls((prevUrls) => prevUrls.filter((url) => url._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete link');
    }
  };

  const handleCopy = (shortCode) => {
    const fullShortUrl = `${API_BASE}/${shortCode}`;
    navigator.clipboard.writeText(fullShortUrl);
    
    setCopyFeedback((prev) => ({ ...prev, [shortCode]: true }));
    setTimeout(() => {
      setCopyFeedback((prev) => ({ ...prev, [shortCode]: false }));
    }, 2000);
  };

  const formatShortUrl = (shortCode) => {
    // Trim protocol for clean representation in UI
    const domain = API_BASE.replace(/(^\w+:|^)\/\//, '');
    return `${domain}/${shortCode}`;
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, <strong style={{ color: 'var(--primary)' }}>{user?.username || 'Guest'}</strong>! Manage and track your URLs here.</p>
        </div>
        <button className="analytics-back-btn" onClick={fetchUrls}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Left Side: Create URL Form */}
        <div>
          <LinkForm token={token} onUrlAdded={handleUrlAdded} />
        </div>

        {/* Right Side: Links Table */}
        <div className="card" style={{ gap: '1rem' }}>
          <div className="card-title">
            <LinkIcon size={20} style={{ color: 'var(--accent)' }} />
            <span>Your Shortened Links</span>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <Loader message="Fetching your links..." />
          ) : urls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No shortened URLs yet</h3>
              <p>Enter a long URL on the left to generate your first SnapLink!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Link Detail</th>
                    <th>Short URL</th>
                    <th className="hide-mobile">Expiry</th>
                    <th className="hide-mobile">Created</th>
                    <th>Clicks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((url) => {
                    const expired = isExpired(url.expiresAt);
                    return (
                      <tr key={url._id}>
                        <td className="url-cell">
                          <div className="url-title">{url.title || 'Untitled Link'}</div>
                          <div className="url-original" title={url.originalUrl}>
                            {url.originalUrl}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <a
                              href={`${API_BASE}/${url.shortCode}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="short-url-link"
                            >
                              {formatShortUrl(url.shortCode)}
                              <ExternalLink size={12} />
                            </a>
                            {copyFeedback[url.shortCode] && (
                              <span className="copied-text">Copied!</span>
                            )}
                          </div>
                        </td>
                        <td className="hide-mobile">
                          {url.expiresAt ? (
                            <span className={`expiry-date ${expired ? 'expired' : ''}`}>
                              {formatDate(url.expiresAt)} {expired ? '(Expired)' : ''}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>No expiry</span>
                          )}
                        </td>
                        <td className="hide-mobile" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          {formatDate(url.createdAt)}
                        </td>
                        <td>
                          <span className="clicks-badge">{url.clickCount}</span>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button
                              className="action-btn"
                              title="Copy to clipboard"
                              onClick={() => handleCopy(url.shortCode)}
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              className="action-btn"
                              title="View Analytics"
                              onClick={() => onViewAnalytics(url._id)}
                            >
                              <BarChart2 size={14} />
                            </button>
                            <button
                              className="action-btn"
                              title="QR Code"
                              onClick={() => setSelectedQrUrl(url)}
                            >
                              <QrCode size={14} />
                            </button>
                            <button
                              className="action-btn"
                              title="Edit destination"
                              onClick={() => setSelectedEditUrl(url)}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="action-btn delete"
                              title="Delete Link"
                              onClick={() => handleDelete(url._id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Render Modals */}
      {selectedQrUrl && (
        <QRModal urlObj={selectedQrUrl} onClose={() => setSelectedQrUrl(null)} />
      )}

      {selectedEditUrl && (
        <EditModal
          urlObj={selectedEditUrl}
          token={token}
          onClose={() => setSelectedEditUrl(null)}
          onUpdateSuccess={handleUrlUpdated}
        />
      )}
    </div>
  );
};

export default Dashboard;
