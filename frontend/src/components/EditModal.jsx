import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://url-shortener-j2ye.onrender.com';

const EditModal = ({ urlObj, token, onClose, onUpdateSuccess }) => {
  const [originalUrl, setOriginalUrl] = useState(urlObj.originalUrl);
  const [title, setTitle] = useState(urlObj.title || '');

  const toLocalISOString = (date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const [expiresAt, setExpiresAt] = useState(
    urlObj.expiresAt ? toLocalISOString(new Date(urlObj.expiresAt)) : ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!originalUrl) {
      setError('Original URL is required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/url/${urlObj._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          originalUrl,
          title,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null // Send null to remove expiry if empty
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update URL');
      }

      onUpdateSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message || 'Error updating link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <h2 className="modal-title">Edit SnapLink</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '-0.75rem' }}>
          Short Code: <strong style={{ color: 'var(--accent)' }}>{urlObj.shortCode}</strong>
        </p>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.85rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label htmlFor="edit-url">Destination URL</label>
            <input
              id="edit-url"
              type="url"
              className="form-control form-control-noicon"
              placeholder="https://example.com/very-long-path"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-title">Link Title</label>
            <input
              id="edit-title"
              type="text"
              className="form-control form-control-noicon"
              placeholder="My personal website"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-expiry">Expiration Date</label>
            <input
              id="edit-expiry"
              type="datetime-local"
              className="form-control form-control-noicon"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={toLocalISOString(new Date())}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Leave blank to clear link expiration.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" style={{ width: '50%' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ width: '50%' }} disabled={loading}>
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
