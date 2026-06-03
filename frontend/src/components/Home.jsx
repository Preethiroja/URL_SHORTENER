import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Link2,
  ArrowRight,
  BarChart3,
  QrCode,
  Layers,
  Calendar,
  Globe,
  Activity,
  Clock,
  Edit3,
  FileSpreadsheet,
  Share2,
  ExternalLink,
  Copy,
  Check,
  MousePointer,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Play
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  // Sandbox simulation states
  const [tab, setTab] = useState('single'); // 'single' | 'bulk'
  const [longUrl, setLongUrl] = useState('https://github.com/google-deepmind/antigravity');
  const [alias, setAlias] = useState('gdm-antigravity');
  const [expiry, setExpiry] = useState('2026-12-31');
  const [shortUrl, setShortUrl] = useState('https://snap.lk/gdm-antigravity');
  const [destinationUrl, setDestinationUrl] = useState('https://github.com/google-deepmind/antigravity');
  const [isEditingDestination, setIsEditingDestination] = useState(false);
  const [tempDestination, setTempDestination] = useState('https://github.com/google-deepmind/antigravity');
  const [copied, setCopied] = useState(false);
  const [clicks, setClicks] = useState(42);
  const [lastVisited, setLastVisited] = useState('2 minutes ago');
  const [publicStats, setPublicStats] = useState(true);

  // CSV Bulk shortener simulation
  const [csvFile, setCsvFile] = useState(null);
  const [csvShortening, setCsvShortening] = useState(false);
  const [csvProgress, setCsvProgress] = useState(0);
  const [csvLinks, setCsvLinks] = useState([]);

  // Live click simulator history
  const [visits, setVisits] = useState([
    { timestamp: '2026-06-03 21:10:45', geo: '🇺🇸 United States', browser: 'Chrome', device: 'Desktop' },
    { timestamp: '2026-06-03 20:54:12', geo: '🇮🇳 India', browser: 'Firefox', device: 'Mobile' },
    { timestamp: '2026-06-03 19:30:05', geo: '🇬🇧 United Kingdom', browser: 'Safari', device: 'Mobile' }
  ]);

  // Chart data state (simulating clicks over last 7 days)
  const [chartData, setChartData] = useState([5, 8, 12, 6, 15, 10, 8]);

  const handleShorten = (e) => {
    e.preventDefault();
    setShortUrl(`https://snap.lk/${alias || 'link'}`);
    setDestinationUrl(longUrl);
    setTempDestination(longUrl);
  };

  const handleSaveDestination = () => {
    setDestinationUrl(tempDestination);
    setLongUrl(tempDestination);
    setIsEditingDestination(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateClick = () => {
    setClicks(prev => prev + 1);
    const now = new Date();
    const formatTime = (d) => {
      return d.toISOString().replace('T', ' ').substring(0, 19);
    };
    setLastVisited('Just now');

    const geos = ['🇺🇸 United States', '🇮🇳 India', '🇬🇧 United Kingdom', '🇩🇪 Germany', '🇨🇦 Canada', '🇯🇵 Japan', '🇦🇺 Australia'];
    const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
    const devices = ['Desktop', 'Mobile', 'Tablet'];

    const randomGeo = geos[Math.floor(Math.random() * geos.length)];
    const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];
    const randomDevice = devices[Math.floor(Math.random() * devices.length)];

    const newVisit = {
      timestamp: formatTime(now),
      geo: randomGeo,
      browser: randomBrowser,
      device: randomDevice
    };

    setVisits(prev => [newVisit, ...prev.slice(0, 4)]);
    setChartData(prev => {
      const updated = [...prev];
      updated[updated.length - 1] += 1;
      return updated;
    });
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const handleProcessCsv = () => {
    if (!csvFile) return;
    setCsvShortening(true);
    setCsvProgress(10);

    const interval = setInterval(() => {
      setCsvProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCsvShortening(false);
          setCsvLinks([
            { original: 'https://google.com/search?q=ai', short: 'https://snap.lk/bulk-ai', clicks: 12 },
            { original: 'https://github.com/trending', short: 'https://snap.lk/bulk-git', clicks: 8 },
            { original: 'https://stackoverflow.com', short: 'https://snap.lk/bulk-so', clicks: 35 }
          ]);
          return 100;
        }
        return prev + 30;
      });
    }, 300);
  };

  const handleDownloadQr = () => {
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 120 120" style="background:#fff;padding:12px;border-radius:12px;">
        <rect x="10" y="10" width="30" height="30" fill="%23970747" stroke="%23000" stroke-width="2"/>
        <rect x="16" y="16" width="18" height="18" fill="%23fff"/>
        <rect x="22" y="22" width="6" height="6" fill="%23970747"/>
        <rect x="80" y="10" width="30" height="30" fill="%23970747" stroke="%23000" stroke-width="2"/>
        <rect x="86" y="16" width="18" height="18" fill="%23fff"/>
        <rect x="92" y="22" width="6" height="6" fill="%23970747"/>
        <rect x="10" y="80" width="30" height="30" fill="%23970747" stroke="%23000" stroke-width="2"/>
        <rect x="16" y="86" width="18" height="18" fill="%23fff"/>
        <rect x="22" y="92" width="6" height="6" fill="%23970747"/>
        <rect x="50" y="10" width="6" height="6" fill="%23970747"/>
        <rect x="62" y="10" width="6" height="6" fill="%23970747"/>
        <rect x="56" y="16" width="6" height="6" fill="%23970747"/>
        <rect x="68" y="16" width="6" height="6" fill="%23970747"/>
        <rect x="50" y="22" width="6" height="12" fill="%23970747"/>
        <rect x="62" y="28" width="12" height="6" fill="%23970747"/>
        <rect x="10" y="50" width="6" height="6" fill="%23970747"/>
        <rect x="16" y="56" width="12" height="6" fill="%23970747"/>
        <rect x="28" y="50" width="6" height="18" fill="%23970747"/>
        <rect x="50" y="50" width="18" height="6" fill="%23970747"/>
        <rect x="56" y="62" width="6" height="12" fill="%23970747"/>
        <rect x="68" y="56" width="6" height="6" fill="%23970747"/>
        <rect x="80" y="50" width="6" height="18" fill="%23970747"/>
        <rect x="92" y="56" width="12" height="6" fill="%23970747"/>
        <rect x="104" y="50" width="6" height="6" fill="%23970747"/>
        <rect x="50" y="80" width="12" height="6" fill="%23970747"/>
        <rect x="68" y="80" width="6" height="18" fill="%23970747"/>
        <rect x="56" y="92" width="6" height="6" fill="%23970747"/>
        <rect x="50" y="104" width="12" height="6" fill="%23970747"/>
        <rect x="80" y="80" width="6" height="6" fill="%23970747"/>
        <rect x="92" y="86" width="6" height="12" fill="%23970747"/>
        <rect x="86" y="98" width="12" height="6" fill="%23970747"/>
        <rect x="104" y="92" width="6" height="18" fill="%23970747"/>
      </svg>`
    )
    }`;
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `qr-${alias || 'link'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="public-landing">
      {/* 🔮 CUSTOM LANDING GLASSMORPHIC STYLING BLOCK */}
      <style>{`
        .public-landing {
          font-family: var(--font-family);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          overflow-x: hidden;
        }
        
        .public-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2rem;
          max-width: 1300px;
          width: 100%;
          margin: 0 auto;
          background: transparent;
          border-bottom: 1px solid var(--border-color);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .public-nav-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .hero-section {
          padding: 5rem 1.5rem 3rem 1.5rem;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .hero-section h1 {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -1.5px;
          line-height: 1.1;
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 700px;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .badge-promo {
          background: var(--primary-glow);
          color: var(--primary);
          border: 1px solid rgba(151, 7, 71, 0.2);
          padding: 0.35rem 1rem;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* 🧪 INTERACTIVE SIMULATOR SECTION */
        .simulator-section {
          max-width: 1100px;
          width: 100%;
          margin: 1rem auto 5rem auto;
          padding: 0 1.5rem;
        }

        .simulator-container {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          box-shadow: var(--glass-shadow);
          backdrop-filter: blur(16px);
          overflow: hidden;
          transition: border-color 0.3s ease;
        }

        .simulator-container:hover {
          border-color: rgba(151, 7, 71, 0.25);
        }

        .sim-header {
          padding: 1.75rem 2rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .sim-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sim-title h3 {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .sim-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--success);
          background: var(--success-glow);
          padding: 0.25rem 0.75rem;
          border-radius: 99px;
        }

        .sim-status-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--success);
          animation: pulse 2s infinite;
        }

        .sim-tabs {
          display: flex;
          gap: 0.5rem;
          background: rgba(0, 0, 0, 0.05);
          padding: 0.25rem;
          border-radius: 12px;
        }

        .sim-tab-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sim-tab-btn.active {
          background: var(--bg-primary);
          color: var(--primary);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .sim-body {
          padding: 2rem;
        }

        .sim-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 2.5rem;
        }

        @media (max-width: 900px) {
          .sim-grid {
            grid-template-columns: 1fr;
          }
        }

        .sim-input-card {
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .sim-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sim-form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .sim-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sim-input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }

        .sim-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          color: var(--text-primary);
          font-family: var(--font-family);
          font-size: 0.95rem;
          outline: none;
          transition: var(--transition);
        }

        .sim-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-glow);
        }

        .sim-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .sim-dashboard {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 18px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }

        .sim-shortened-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sim-url-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .sim-url-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          width: 100%;
        }

        .sim-orig-url {
          font-size: 0.8rem;
          color: var(--text-muted);
          word-break: break-all;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          max-width: 90%;
        }

        .sim-short-url-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.5rem;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
        }

        .sim-short-link {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--primary);
        }

        .sim-action-btn-small {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.35rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .sim-action-btn-small:hover {
          background: var(--primary-glow);
          color: var(--primary);
        }

        .sim-edit-box {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.25rem;
          width: 100%;
        }

        .sim-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .sim-metric-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }

        .sim-metric-num {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .sim-metric-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-top: 0.25rem;
        }

        .sim-qr-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
        }

        .sim-btn-download {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          cursor: pointer;
          transition: var(--transition);
        }

        .sim-btn-download:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .sim-analytics-zone {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sim-chart-wrapper {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1rem;
        }

        .sim-chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }

        .sim-chart-container {
          height: 110px;
          width: 100%;
        }

        .sim-visits-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sim-visit-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1.3fr;
          align-items: center;
          padding: 0.4rem 0.75rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 0.75rem;
          color: var(--text-secondary);
          animation: slideInUp 0.3s ease;
        }

        .sim-btn-simulate {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          color: white;
          border: none;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 0.85rem;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 4px 15px var(--primary-glow);
          transition: var(--transition);
        }

        .sim-btn-simulate:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(151, 7, 71, 0.3);
        }

        .sim-btn-simulate:active {
          transform: translateY(0);
        }

        /* CSV Upload Dropzone Mock styling */
        .csv-dropzone {
          border: 2px dashed var(--border-color);
          border-radius: 16px;
          padding: 2.5rem 1.5rem;
          text-align: center;
          background: rgba(0, 0, 0, 0.01);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .csv-dropzone:hover {
          border-color: var(--primary);
          background: var(--primary-glow);
        }

        .csv-progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(0,0,0,0.05);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .csv-progress-fill {
          height: 100%;
          background: var(--primary);
          transition: width 0.3s ease;
        }

        .csv-results {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .csv-result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 0.8rem;
        }

        /* 📋 CORE FEATURES SECTION */
        .features-grid-section {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto 6rem auto;
          padding: 0 1.5rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .section-header h2 {
          font-size: 2.25rem;
          font-weight: 800;
          letter-spacing: -0.75px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .section-header p {
          color: var(--text-secondary);
          margin-top: 0.5rem;
          font-size: 1.1rem;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .feature-grid-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                      border-color 0.4s ease;
          will-change: transform, box-shadow;
        }

        .feature-grid-card:hover {
          transform: translateY(-8px);
          border-color: rgba(151, 7, 71, 0.2);
          box-shadow: 0 15px 30px -10px rgba(151, 7, 71, 0.12), var(--glass-shadow);
        }

        .grid-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.25rem;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .feature-grid-card:hover .grid-icon {
          transform: scale(1.1) rotate(3deg);
        }

        .bg-hsl-rose { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }
        .bg-hsl-violet { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
        .bg-hsl-emerald { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .bg-hsl-amber { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .bg-hsl-blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .bg-hsl-teal { background: rgba(20, 184, 166, 0.1); color: #20b8a6; }
        .bg-hsl-pink { background: rgba(236, 72, 153, 0.1); color: #ec4899; }
        .bg-hsl-indigo { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
        .bg-hsl-cyan { background: rgba(6, 182, 212, 0.1); color: #06b6d4; }
        .bg-hsl-fuchsia { background: rgba(217, 70, 239, 0.1); color: #d946ef; }

        .feature-grid-card h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .feature-grid-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* 🔄 KEYFRAMES */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
      `}</style>

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
          <span>Enterprise Link Analytics</span>
        </div>
        <h1>Shorten links, enhance capabilities.</h1>
        <p className="hero-subtitle">
          An intuitive workspace featuring expiration controls, downloadable QR codes, granular visitor timestamps, daily trend charting, and bulk import capacities.
        </p>
      </header>

      {/* 🛠️ LIVE INTERACTIVE SIMULATOR SECTION */}
      <section className="simulator-section">
        <div className="simulator-container">
          {/* Header of simulator */}
          <div className="sim-header">
            <div className="sim-title">
              <Activity size={18} style={{ color: 'var(--primary)' }} />
              <h3>Interactive Live Sandbox</h3>
              <div className="sim-status">
                <div className="sim-status-pulse"></div>
                Live Sandbox Simulator
              </div>
            </div>
            
            <div className="sim-tabs">
              <button 
                onClick={() => setTab('single')} 
                className={`sim-tab-btn ${tab === 'single' ? 'active' : ''}`}
              >
                <Link2 size={15} /> Single Shortener
              </button>
              <button 
                onClick={() => setTab('bulk')} 
                className={`sim-tab-btn ${tab === 'bulk' ? 'active' : ''}`}
              >
                <FileSpreadsheet size={15} /> Bulk CSV Upload
              </button>
            </div>
          </div>

          {/* Body of simulator */}
          <div className="sim-body">
            <div className="sim-grid">
              
              {/* Left Column: Interactive Form controls */}
              <div className="sim-left-pane">
                {tab === 'single' ? (
                  <form onSubmit={handleShorten} className="sim-input-card">
                    <div className="sim-form-group">
                      <label htmlFor="sim-destination">Destination URL</label>
                      <div className="sim-input-wrapper">
                        <Link2 size={16} className="sim-input-icon" />
                        <input
                          id="sim-destination"
                          type="url"
                          required
                          className="sim-input"
                          value={longUrl}
                          onChange={(e) => setLongUrl(e.target.value)}
                          placeholder="https://example.com/very-long-original-url"
                        />
                      </div>
                    </div>

                    <div className="sim-row">
                      <div className="sim-form-group">
                        <label htmlFor="sim-alias">Custom Alias (Optional)</label>
                        <div className="sim-input-wrapper">
                          <Edit3 size={16} className="sim-input-icon" />
                          <input
                            id="sim-alias"
                            type="text"
                            className="sim-input"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            placeholder="alias-name"
                          />
                        </div>
                      </div>

                      <div className="sim-form-group">
                        <label htmlFor="sim-expiry">Expiry Date</label>
                        <div className="sim-input-wrapper">
                          <Calendar size={16} className="sim-input-icon" />
                          <input
                            id="sim-expiry"
                            type="date"
                            className="sim-input"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="sim-btn-simulate" style={{ marginTop: '0.5rem' }}>
                      Generate Smart Link <ArrowRight size={16} />
                    </button>
                  </form>
                ) : (
                  <div className="sim-input-card">
                    <div className="sim-form-group">
                      <label>Bulk CSV URL Shortening</label>
                      <div className="csv-dropzone" onClick={() => document.getElementById('csv-file-input').click()}>
                        <Upload size={28} style={{ color: 'var(--primary)' }} />
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                            {csvFile ? csvFile.name : 'Click to select marketing_campaign.csv'}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            CSV file containing a list of target destination URLs
                          </p>
                        </div>
                        <input
                          id="csv-file-input"
                          type="file"
                          accept=".csv"
                          style={{ display: 'none' }}
                          onChange={handleCsvUpload}
                        />
                      </div>
                    </div>

                    {csvFile && (
                      <button 
                        onClick={handleProcessCsv} 
                        className="sim-btn-simulate" 
                        disabled={csvShortening}
                      >
                        {csvShortening ? (
                          <>
                            <RefreshCw size={16} className="spinner" style={{ animation: 'spin 1.5s linear infinite' }} /> 
                            Processing...
                          </>
                        ) : (
                          <>
                            Process CSV File <Play size={16} />
                          </>
                        )}
                      </button>
                    )}

                    {csvShortening && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span>Parsing rows</span>
                          <span>{csvProgress}%</span>
                        </div>
                        <div className="csv-progress-bar">
                          <div className="csv-progress-fill" style={{ width: `${csvProgress}%` }}></div>
                        </div>
                      </div>
                    )}

                    {csvLinks.length > 0 && (
                      <div className="csv-results">
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          Bulk Export Output:
                        </span>
                        {csvLinks.map((item, idx) => (
                          <div key={idx} className="csv-result-item">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', maxWidth: '70%' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {item.original}
                              </span>
                              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                                {item.short}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                              Clicks: {item.clicks}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Simulated QR Code box */}
                <div className="sim-qr-zone" style={{ marginTop: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
                    <QrCode size={16} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>QR Code for Short URL</span>
                  </div>
                  
                  {/* Styled QR Vector Mock */}
                  <svg width="100" height="100" viewBox="0 0 120 120" style={{ background: '#fff', padding: '6px', borderRadius: '8px' }}>
                    <rect x="10" y="10" width="30" height="30" fill="var(--primary)" stroke="#000" strokeWidth="1.5" />
                    <rect x="16" y="16" width="18" height="18" fill="#fff" />
                    <rect x="22" y="22" width="6" height="6" fill="var(--primary)" />
                    
                    <rect x="80" y="10" width="30" height="30" fill="var(--primary)" stroke="#000" strokeWidth="1.5" />
                    <rect x="86" y="16" width="18" height="18" fill="#fff" />
                    <rect x="92" y="22" width="6" height="6" fill="var(--primary)" />
                    
                    <rect x="10" y="80" width="30" height="30" fill="var(--primary)" stroke="#000" strokeWidth="1.5" />
                    <rect x="16" y="86" width="18" height="18" fill="#fff" />
                    <rect x="22" y="92" width="6" height="6" fill="var(--primary)" />
                    
                    <rect x="50" y="10" width="6" height="6" fill="var(--primary)" />
                    <rect x="62" y="10" width="6" height="6" fill="var(--primary)" />
                    <rect x="56" y="16" width="6" height="6" fill="var(--primary)" />
                    <rect x="68" y="16" width="6" height="6" fill="var(--primary)" />
                    <rect x="50" y="22" width="6" height="12" fill="var(--primary)" />
                    <rect x="62" y="28" width="12" height="6" fill="var(--primary)" />
                    
                    <rect x="10" y="50" width="6" height="6" fill="var(--primary)" />
                    <rect x="16" y="56" width="12" height="6" fill="var(--primary)" />
                    <rect x="28" y="50" width="6" height="18" fill="var(--primary)" />
                    
                    <rect x="50" y="50" width="18" height="6" fill="var(--primary)" />
                    <rect x="56" y="62" width="6" height="12" fill="var(--primary)" />
                    <rect x="68" y="56" width="6" height="6" fill="var(--primary)" />
                    
                    <rect x="80" y="50" width="6" height="18" fill="var(--primary)" />
                    <rect x="92" y="56" width="12" height="6" fill="var(--primary)" />
                    <rect x="104" y="50" width="6" height="6" fill="var(--primary)" />
                    
                    <rect x="50" y="80" width="12" height="6" fill="var(--primary)" />
                    <rect x="68" y="80" width="6" height="18" fill="var(--primary)" />
                    <rect x="56" y="92" width="6" height="6" fill="var(--primary)" />
                    <rect x="50" y="104" width="12" height="6" fill="var(--primary)" />
                    
                    <rect x="80" y="80" width="6" height="6" fill="var(--primary)" />
                    <rect x="92" y="86" width="6" height="12" fill="var(--primary)" />
                    <rect x="86" y="98" width="12" height="6" fill="var(--primary)" />
                    <rect x="104" y="92" width="6" height="18" fill="var(--primary)" />
                  </svg>

                  <button onClick={handleDownloadQr} className="sim-btn-download">
                    <Download size={13} /> Download QR Code (.svg)
                  </button>
                </div>
              </div>

              {/* Right Column: Live Simulator Analytics Dashboard */}
              <div className="sim-right-pane">
                <div className="sim-dashboard">
                  
                  {/* Short Link Details Card */}
                  <div className="sim-shortened-card">
                    <div className="sim-url-header">
                      <div className="sim-url-meta">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                            Destination URL
                          </span>
                          {!isEditingDestination ? (
                            <button onClick={() => { setTempDestination(destinationUrl); setIsEditingDestination(true); }} className="sim-action-btn-small">
                              <Edit3 size={12} />
                            </button>
                          ) : null}
                        </div>
                        
                        {isEditingDestination ? (
                          <div className="sim-edit-box">
                            <input 
                              type="url" 
                              className="sim-input" 
                              style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', height: '28px' }} 
                              value={tempDestination} 
                              onChange={(e) => setTempDestination(e.target.value)} 
                            />
                            <button 
                              onClick={handleSaveDestination} 
                              className="btn btn-primary btn-small"
                              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', height: '28px' }}
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <span className="sim-orig-url">
                            {destinationUrl} 
                            <a href={destinationUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center' }}>
                              <ExternalLink size={10} style={{ marginLeft: '2px', color: 'var(--text-muted)' }} />
                            </a>
                          </span>
                        )}

                        <div className="sim-short-url-row">
                          <span className="sim-short-link">{shortUrl}</span>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button onClick={handleCopy} className="sim-action-btn-small" title="Copy Link">
                              {copied ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>

                        {/* Expiry and Public page flags */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={12} />
                            Expires: <strong style={{ color: 'var(--primary)' }}>{expiry || 'Never'}</strong>
                          </span>
                          
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                            <input 
                              type="checkbox" 
                              checked={publicStats} 
                              onChange={(e) => setPublicStats(e.target.checked)}
                              style={{ accentColor: 'var(--primary)' }}
                            />
                            <span>Public Stats Page</span>
                          </label>
                        </div>

                        {publicStats && (
                          <div style={{ background: 'var(--primary-glow)', padding: '0.35rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Public URL: <strong>{shortUrl}/stats</strong></span>
                            <Eye size={10} style={{ color: 'var(--primary)' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Clicks and Last Visited Statistics */}
                  <div className="sim-metrics-grid">
                    <div className="sim-metric-card">
                      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }} className="sim-status">
                        <div className="sim-status-pulse"></div>
                      </div>
                      <div className="sim-metric-num">{clicks}</div>
                      <div className="sim-metric-label">Total Clicks</div>
                    </div>

                    <div className="sim-metric-card">
                      <div className="sim-metric-num" style={{ fontSize: '1rem', fontWeight: 700, padding: '0.4rem 0' }}>
                        {lastVisited}
                      </div>
                      <div className="sim-metric-label">Last Visited Time</div>
                    </div>
                  </div>

                  {/* SVG Chart for Daily Click Trends */}
                  <div className="sim-chart-wrapper">
                    <div className="sim-chart-header">
                      <span>Daily Click Trends</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Last 7 Days</span>
                    </div>
                    <div className="sim-chart-container">
                      <svg viewBox="0 0 300 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="1" />
                        <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="1" />
                        <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="1" />
                        <line x1="0" y1="110" x2="300" y2="110" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="1" />
                        
                        <path
                          d={`M 0 110 L 0 ${110 - chartData[0] * 5} L 50 ${110 - chartData[1] * 5} L 100 ${110 - chartData[2] * 5} L 150 ${110 - chartData[3] * 5} L 200 ${110 - chartData[4] * 5} L 250 ${110 - chartData[5] * 5} L 300 ${110 - chartData[6] * 5} L 300 110 Z`}
                          fill="url(#chartGrad)"
                          opacity="0.15"
                          style={{ transition: 'all 0.3s ease' }}
                        />
                        
                        <path
                          d={`M 0 ${110 - chartData[0] * 5} L 50 ${110 - chartData[1] * 5} L 100 ${110 - chartData[2] * 5} L 150 ${110 - chartData[3] * 5} L 200 ${110 - chartData[4] * 5} L 250 ${110 - chartData[5] * 5} L 300 ${110 - chartData[6] * 5}`}
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ transition: 'all 0.3s ease' }}
                        />
                        
                        {chartData.map((val, idx) => (
                          <circle
                            key={idx}
                            cx={idx * 50}
                            cy={110 - val * 5}
                            r="4"
                            fill="var(--accent)"
                            stroke="var(--bg-primary)"
                            strokeWidth="2"
                            style={{ transition: 'all 0.3s ease' }}
                          />
                        ))}
                        
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary)" />
                            <stop offset="100%" stopColor="transparent" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  {/* Geolocation & Device Analytics Mock presentation */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Top Geolocation
                      </span>
                      <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span>🇺🇸 United States</span>
                        <strong>48%</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span>🇮🇳 India</span>
                        <strong>32%</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Devices / Browsers
                      </span>
                      <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Desktop (Chrome)</span>
                        <strong>60%</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Mobile (Safari)</span>
                        <strong>40%</strong>
                      </div>
                    </div>
                  </div>

                  {/* Recent Visit History - timestamped logs */}
                  <div className="sim-analytics-zone">
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      Recent Visit History
                    </span>
                    <div className="sim-visits-list">
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.3fr', padding: '0 0.75rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        <span>Timestamp</span>
                        <span>Location</span>
                        <span>Browser / Device</span>
                      </div>
                      
                      {visits.map((visit, idx) => (
                        <div key={idx} className="sim-visit-row">
                          <span style={{ fontFamily: 'monospace' }}>{visit.timestamp}</span>
                          <span style={{ fontWeight: 600 }}>{visit.geo}</span>
                          <span>{visit.browser} ({visit.device})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Simulate Visit Interaction */}
                  <button onClick={handleSimulateClick} className="sim-btn-simulate">
                    <MousePointer size={16} /> Simulate Visitor Click 🖱️
                  </button>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 🛠️ SPECIFIC DETAILED FEATURES GRID */}
      <section id="features" className="features-grid-section">
        <div className="section-header">
          <h2>Platform Capabilities</h2>
          <p>Everything you need to short-link, secure, and trace engagement metrics.</p>
        </div>

        <div className="grid-container">
          
          <div className="feature-grid-card">
            <div className="grid-icon bg-hsl-rose"><QrCode size={20} /></div>
            <h3>QR Code Generation</h3>
            <p>Generate and save a crisp, high-resolution QR vector code for every shortened URL to integrate seamlessly into flyers, print, or offline materials.</p>
          </div>

          <div className="feature-grid-card">
            <div className="grid-icon bg-hsl-amber"><Calendar size={20} /></div>
            <h3>Expiry Date for Links</h3>
            <p>Control the lifespan of your URLs. Pick an absolute date and time, after which links expire and redirect to an inactive notification.</p>
          </div>

          <div className="feature-grid-card">
            <div className="grid-icon bg-hsl-emerald"><Globe size={20} /></div>
            <h3>Geolocation & Browser Analytics</h3>
            <p>Pinpoint the location of incoming traffic down to the country and examine the exact browser (Chrome, Safari, Firefox) and device environment (Desktop, Mobile).</p>
          </div>

          <div className="feature-grid-card">
            <div className="grid-icon bg-hsl-blue"><BarChart3 size={20} /></div>
            <h3>Charts for Daily Click Trends</h3>
            <p>Visualize aggregate user engagement metrics with detailed daily click charts, displaying peak time and periodic engagement trends.</p>
          </div>

          <div className="feature-grid-card">
            <div className="grid-icon bg-hsl-violet"><Share2 size={20} /></div>
            <h3>Public Stats Page</h3>
            <p>Generate clean public analytics views. Show performance metrics to sponsors, customers, or public communities without providing login credentials.</p>
          </div>

          <div className="feature-grid-card">
            <div className="grid-icon bg-hsl-teal"><Edit3 size={20} /></div>
            <h3>Edit Destination URL</h3>
            <p>Keep your short URLs active. Easily edit the original target URL behind the short link to correct broken destinations without invalidating distribution paths.</p>
          </div>

          <div className="feature-grid-card">
            <div className="grid-icon bg-hsl-indigo"><FileSpreadsheet size={20} /></div>
            <h3>Bulk Shortening via CSV</h3>
            <p>Upload a structured CSV spreadsheet of long links to create, label, and download thousands of short redirects in a single click.</p>
          </div>

          <div className="feature-grid-card">
            <div className="grid-icon bg-hsl-pink"><Activity size={20} /></div>
            <h3>Count Clicks per Short URL</h3>
            <p>Keep a real-time running counter of total clicks on every single link, updating instant counters on dashboards.</p>
          </div>

          <div className="feature-grid-card">
            <div className="grid-icon bg-hsl-cyan"><Clock size={20} /></div>
            <h3>Record Visit Timestamps</h3>
            <p>Log a granular millisecond-level timestamp for each visitor visit, mapping clicking traffic timelines.</p>
          </div>

          <div className="feature-grid-card">
            <div className="grid-icon bg-hsl-fuchsia"><Layers size={20} /></div>
            <h3>Analytics Page & Details</h3>
            <p>View detailed analysis for each short URL, showcasing total click counts, last visited time, and recent visit history logs.</p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;