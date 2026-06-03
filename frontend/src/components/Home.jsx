import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Link2, ArrowRight, BarChart3, QrCode, Shield, Layers } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="public-landing">
      {/* 🌐 NAV BAR */}
      <nav className="public-nav">
        <div className="nav-brand">
          <Link2 size={24} style={{ color: 'var(--primary)' }} />
          <span>SnapLink</span>
        </div>
        <div className="public-nav-actions">
          <Link to="/login" className="btn-nav-login">Sign In</Link>
          <button onClick={() => navigate('/register')} className="btn btn-primary btn-small">
            Create Account
          </button>
        </div>
      </nav>

      {/* 🚀 HERO SECTION */}
      <header className="hero-section">
        <div className="badge-promo">
          <span>URL Shortener Platform</span>
        </div>
        <h1>Shorten links, enhance capabilities.</h1>
        <p className="hero-subtitle">
          Create short links, set custom aliases, generate QR codes, and track your total click metrics from a clean, unified dashboard.
        </p>
        <div className="hero-cta-group">
          <button onClick={() => navigate('/register')} className="btn btn-primary btn-large">
            Get Started Free <ArrowRight size={18} />
          </button>
        </div>
      </header>

      {/* 🛠️ WHAT WE ARE IMPLEMENTING (CURRENT FEATURES GRID) */}
      <section id="features" className="features-grid-section">
        <div className="section-header">
          <h2>Core Features</h2>
          <p>Everything you need to manage your links effectively.</p>
        </div>

        <div className="grid-container">
          <div className="feature-grid-card">
            <div className="grid-icon bg-blue"><Link2 size={20} /></div>
            <h3>Link Shortening</h3>
            <p>Transform long, messy URLs into clean, recognizable links with optional custom backhalves/aliases.</p>
          </div>

          <div className="feature-grid-card">
            <div className="grid-icon bg-orange"><BarChart3 size={20} /></div>
            <h3>Click Analytics</h3>
            <p>Monitor your link performance with live click counters and track basic historical engagement data.</p>
          </div>

          <div className="feature-grid-card">
            <div className="grid-icon bg-green"><QrCode size={20} /></div>
            <h3>QR Code Generation</h3>
            <p>Instantly generate and download standard QR codes for your links to use in offline media or displays.</p>
          </div>

          <div className="feature-grid-card">
            <div className="grid-icon bg-purple"><Shield size={20} /></div>
            <h3>Secure Accounts</h3>
            <p>Protected user authentication ensuring your links, dashboard updates, and profile settings remain private.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;