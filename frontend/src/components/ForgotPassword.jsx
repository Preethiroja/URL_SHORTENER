import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Enter your email to receive a password reset link.</p>
        {message && <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your-email@example.com" />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <div className="auth-footer"><Link to="/login">Back to Login</Link></div>
      </div>
    </div>
  );
}