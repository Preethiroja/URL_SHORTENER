import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const QRModal = ({ urlObj, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shortUrl = `${import.meta.env.VITE_API_URL || 'https://url-shortener-j2ye.onrender.com'}/${urlObj.shortCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      // fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${urlObj.shortCode}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <h2 className="modal-title">QR Code</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '-0.75rem' }}>
          Scan code to visit shortened link
        </p>

        <div className="qr-container">
          <QRCodeSVG
            id="qr-code-svg"
            value={shortUrl}
            size={200}
            level={"H"}
            includeMargin={false}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button className="btn btn-secondary" style={{ width: '50%' }} onClick={copyLink}>
            {copied ? (
              <>
                <Check size={16} style={{ color: 'var(--success)' }} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy Link
              </>
            )}
          </button>
          <button className="btn btn-accent" style={{ width: '50%' }} onClick={downloadQR}>
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
