const express = require('express');
const router = express.Router();
const UAParser = require('ua-parser-js');
const Url = require('../models/Url');
const Visit = require('../models/Visit');

// HTML template generator for error states (404, Expired)
function getErrorHtml(title, message, code) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - SnapLink</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        body {
          margin: 0;
          padding: 0;
          font-family: 'Outfit', sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          overflow: hidden;
        }
        .container {
          text-align: center;
          padding: 3rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          backdrop-filter: blur(12px);
          max-width: 450px;
          width: 90%;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }
        .icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        h1 {
          font-size: 2.2rem;
          font-weight: 800;
          margin: 0 0 1rem 0;
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p {
          font-size: 1.1rem;
          color: #94a3b8;
          line-height: 1.6;
          margin: 0 0 2rem 0;
        }
        .btn {
          display: inline-block;
          padding: 0.8rem 2rem;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }
        .code {
          font-size: 0.8rem;
          color: #475569;
          margin-top: 1.5rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">${code === 'EXPIRED' ? '⏳' : '🔍'}</div>
        <h1>${title}</h1>
        <p>${message}</p>
        <a href="http://localhost:5173" class="btn">Go to Dashboard</a>
        <div class="code">Error code: ${code}</div>
      </div>
    </body>
    </html>
  `;
}

// @route   GET /:shortCode
// @desc    Redirect to original URL and log visit analytics
// @access  Public
router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    // Find URL by shortCode or customAlias
    const url = await Url.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }]
    });

    if (!url) {
      return res.status(404).send(getErrorHtml(
        'Link Not Found', 
        'The shortened link you are trying to visit does not exist or has been deleted.',
        'URL_NOT_FOUND'
      ));
    }

    // Check expiration date
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).send(getErrorHtml(
        'Link Expired',
        'This shortened URL had an expiration date set and is no longer active.',
        'EXPIRED'
      ));
    }

    // Parse User Agent metadata
    const userAgentStr = req.headers['user-agent'] || '';
    const parser = new UAParser(userAgentStr);
    
    const browser = parser.getBrowser().name || 'Unknown Browser';
    const os = parser.getOS().name || 'Unknown OS';
    
    // Determine Device type
    let device = parser.getDevice().type || 'desktop';
    if (device === 'mobile') {
      device = 'mobile';
    } else if (device === 'tablet') {
      device = 'tablet';
    } else {
      device = 'desktop';
    }

    // Determine IP address (checking headers for proxy cases)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    // Log the visit record
    const visit = new Visit({
      urlId: url._id,
      ip: typeof ip === 'string' ? ip.split(',')[0].trim() : 'unknown',
      browser,
      os,
      device
    });

    await visit.save();

    // Increment click count on URL
    url.clickCount += 1;
    await url.save();

    // Redirect to original URL (Temporary redirect 302, to ensure subsequent hits also invoke backend for analytics)
    res.redirect(302, url.originalUrl);

  } catch (err) {
    console.error(err);
    res.status(500).send(getErrorHtml(
      'Server Error',
      'Something went wrong on our server. Please try again later.',
      'INTERNAL_SERVER_ERROR'
    ));
  }
});

module.exports = router;
