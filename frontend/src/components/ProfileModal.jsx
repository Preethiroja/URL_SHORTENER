import React, { useState, useEffect } from 'react';
import { X, User, Shield, Image } from 'lucide-react';

const API_BASE = 'http://localhost:5000'; 
const AVATARS = ["🦊", "🐼", "🦁", "🐯", "🦋", "🐬", "🚀", "💎"];

export default function ProfileModal({ user, onClose, onSaved }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '🦊');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔄 Syncs incoming asynchronous database user payloads down to local modal states
  useEffect(() => {
    if (user) {
      if (user.username) setUsername(user.username);
      if (user.email) setEmail(user.email);
      if (user.bio) setBio(user.bio);
      if (user.avatar) setAvatar(user.avatar);
    }
  }, [user]);
  
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim()) return alert("Username is required");
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ username, email, bio, avatar })
      });

      const text = await response.text();
      if (text.startsWith('<!DOCTYPE')) {
        throw new Error("Missing route endpoint or backend server offline.");
      }

      const data = JSON.parse(text);
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');

      onSaved(data.user, 'Profile updated successfully!');
      onClose();
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return alert("Please fill in all fields");
    if (newPassword !== confirmPassword) return alert("New passwords do not match!");

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ currentPassword: oldPassword, newPassword })
      });

      const text = await response.text();
      if (text.startsWith('<!DOCTYPE')) {
        throw new Error("Missing route endpoint or backend server offline.");
      }

      const data = JSON.parse(text);
      if (!response.ok) throw new Error(data.message || 'Failed to update password');

      alert("Password updated successfully!");
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Theme-Adaptive Dynamic Styles
  const inputStyle = { 
    width: '100%', 
    padding: '10px 12px', 
    borderRadius: '8px', 
    backgroundColor: 'var(--input-bg)', 
    border: '1px solid var(--border-color)', 
    color: 'var(--text-primary)', 
    fontSize: '14px', 
    outline: 'none', 
    boxSizing: 'border-box',
    transition: 'var(--transition)'
  };

  const primaryBtnStyle = { 
    padding: '10px 16px', 
    borderRadius: '8px', 
    backgroundColor: 'var(--primary)', 
    color: '#ffffff', 
    fontSize: '14px', 
    fontWeight: '600', 
    border: 'none', 
    cursor: 'pointer',
    transition: 'var(--transition)'
  };

  const secondaryBtnStyle = { 
    padding: '10px 16px', 
    borderRadius: '8px', 
    backgroundColor: 'transparent', 
    color: 'var(--text-secondary)', 
    fontSize: '14px', 
    fontWeight: '500', 
    border: '1px solid var(--border-color)', 
    cursor: 'pointer',
    transition: 'var(--transition)'
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px'
    }} onClick={onClose}>
      
      <div style={{
        backgroundColor: 'var(--modal-bg-custom)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '24px',
        width: '100%', maxWidth: '450px', padding: '28px', position: 'relative',
        boxShadow: 'var(--glass-shadow)', color: 'var(--text-primary)',
        fontFamily: 'var(--font-family)',
        transition: 'var(--transition)'
      }} onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: '24px', right: '24px', background: 'transparent',
          border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center'
        }}>
          <X size={20} style={{ transition: 'var(--transition)' }} />
        </button>

        <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 20px 0', textAlign: 'left', color: 'var(--text-primary)' }}>
          ⚙️ Profile Settings
        </h3>

        {/* Tab Header Navigation Panel */}
        <div style={{
          display: 'flex', gap: '6px', backgroundColor: 'var(--input-bg)', 
          padding: '6px', borderRadius: '12px', marginBottom: '24px',
          border: '1px solid var(--border-color)'
        }}>
          <button type="button" onClick={() => setActiveTab('profile')} style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: activeTab === 'profile' ? 'var(--primary)' : 'transparent', color: activeTab === 'profile' ? '#ffffff' : 'var(--text-secondary)', cursor: 'pointer', transition: 'var(--transition)' }}><User size={14} /> Profile</button>
          <button type="button" onClick={() => setActiveTab('avatar')} style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: activeTab === 'avatar' ? 'var(--primary)' : 'transparent', color: activeTab === 'avatar' ? '#ffffff' : 'var(--text-secondary)', cursor: 'pointer', transition: 'var(--transition)' }}><Image size={14} /> Avatar</button>
          <button type="button" onClick={() => setActiveTab('security')} style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: activeTab === 'security' ? 'var(--primary)' : 'transparent', color: activeTab === 'security' ? '#ffffff' : 'var(--text-secondary)', cursor: 'pointer', transition: 'var(--transition)' }}><Shield size={14} /> Security</button>
        </div>

        {/* TAB 1: USER INFO */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-secondary)', padding: '14px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>{avatar}</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>{username || 'No Name'}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{email || 'No email bound'}</div>
              </div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '700', letterSpacing: '0.5px' }}>USERNAME</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '700', letterSpacing: '0.5px' }}>EMAIL</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '700', letterSpacing: '0.5px' }}>BIO — OPTIONAL</label>
              <input type="text" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." maxLength={80} style={inputStyle} />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'right' }}>{bio.length}/80</div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" onClick={onClose} style={secondaryBtnStyle}>Cancel</button>
              <button type="submit" disabled={loading} style={primaryBtnStyle}>{loading ? 'Saving...' : 'Save Profile'}</button>
            </div>
          </form>
        )}

        {/* TAB 2: AVATAR PICKER */}
        {activeTab === 'avatar' && (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ textTransform: 'uppercase', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', textAlign: 'center', letterSpacing: '0.5px' }}>
              Selected Avatar: <span style={{ fontSize: '22px', marginLeft: '6px', verticalAlign: 'middle' }}>{avatar}</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '10px 0' }}>
              {AVATARS.map((emoji) => (
                <button 
                  key={emoji} 
                  type="button" 
                  onClick={() => setAvatar(emoji)} 
                  style={{ 
                    fontSize: '28px', 
                    padding: '12px', 
                    background: avatar === emoji ? 'var(--primary-glow)' : 'var(--input-bg)', 
                    border: avatar === emoji ? '2px solid var(--primary)' : '2px solid var(--border-color)', 
                    borderRadius: '14px', 
                    cursor: 'pointer', 
                    transition: 'var(--transition)' 
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" onClick={onClose} style={secondaryBtnStyle}>Cancel</button>
              <button type="submit" disabled={loading} style={primaryBtnStyle}>
                {loading ? 'Saving...' : 'Save Avatar'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: PASSWORD CONFIG */}
        {activeTab === 'security' && (
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '700', letterSpacing: '0.5px' }}>CURRENT PASSWORD</label>
              <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '700', letterSpacing: '0.5px' }}>NEW PASSWORD</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '700', letterSpacing: '0.5px' }}>CONFIRM NEW PASSWORD</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" onClick={onClose} style={secondaryBtnStyle}>Cancel</button>
              <button type="submit" disabled={loading} style={{ ...primaryBtnStyle, backgroundColor: 'var(--success)' }}>{loading ? 'Updating...' : 'Update Password'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}