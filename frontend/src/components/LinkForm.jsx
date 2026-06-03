import React, { useState } from 'react';
import { Link2, Sparkles, Calendar, Tag, AlertCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LinkForm = ({ token, onUrlAdded }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!originalUrl) {
      setError('Please provide a URL to shorten');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/url/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          originalUrl,
          title: title || undefined,
          customAlias: customAlias || undefined,
          expiresAt: expiresAt || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to shorten URL');
      }

      setSuccess('Link shortened successfully!');
      setOriginalUrl('');
      setTitle('');
      setCustomAlias('');
      setExpiresAt('');
      
      if (onUrlAdded) {
        onUrlAdded(data);
      }
    } catch (err) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-title">
        <Sparkles size={20} style={{ color: 'var(--primary)' }} />
        <span>Shorten a URL</span>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={16} />
          <span style={{ fontSize: '0.85rem' }}>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <Sparkles size={16} />
          <span style={{ fontSize: '0.85rem' }}>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="originalUrl">Destination URL</label>
          <div className="input-wrapper">
            <span className="input-icon"><Link2 size={16} /></span>
            <input
              id="originalUrl"
              type="url"
              className="form-control"
              placeholder="https://example.com/very-long-path"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Link Title (Optional)</label>
          <div className="input-wrapper">
            <span className="input-icon"><Tag size={16} /></span>
            <input
              id="title"
              type="text"
              className="form-control"
              placeholder="My personal website"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="customAlias">Custom Alias (Optional)</label>
          <div className="input-wrapper">
            <span className="input-icon"><Sparkles size={16} /></span>
            <input
              id="customAlias"
              type="text"
              className="form-control"
              placeholder="my-portfolio"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="expiresAt">Expiration Date (Optional)</label>
          <div className="input-wrapper">
            <span className="input-icon"><Calendar size={16} /></span>
            <input
              id="expiresAt"
              type="datetime-local"
              className="form-control"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={loading}>
          {loading ? 'Shortening...' : 'Generate SnapLink'}
        </button>
      </form>
    </div>
  );
};

export default LinkForm;
