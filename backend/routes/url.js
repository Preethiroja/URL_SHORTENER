const express = require('express');
const router = express.Router();
const validator = require('validator');
const Url = require('../models/Url');
const Visit = require('../models/Visit');
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// Helper to generate a unique short code
const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function generateShortCode(length = 6) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return result;
}

// @route   POST api/url/bulk
// @desc    Bulk shorten URLs from an uploaded CSV file
// @access  Private
router.post('/bulk', auth, upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const textContent = req.file.buffer.toString('utf8');
    const lines = textContent.split(/\r?\n/).map(line => line.trim()).filter(Boolean);

    if (lines.length < 2) {
      return res.status(400).json({ message: 'The uploaded CSV file contains no records' });
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const urlIndex = headers.indexOf('url');

    if (urlIndex === -1) {
      return res.status(400).json({ message: "CSV file must include a column explicitly named 'url'" });
    }

    const insertedLinks = [];

    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',');
      if (!columns[urlIndex]) continue;

      const targetUrl = columns[urlIndex].trim();

      const isValidUrl = validator.isURL(targetUrl, {
        protocols: ['http', 'https'],
        require_protocol: true
      });

      if (isValidUrl) {
        let shortCode = generateShortCode();
        
        const existing = await Url.findOne({ $or: [{ shortCode }, { customAlias: shortCode }] });
        if (existing) {
          shortCode = generateShortCode() + i; 
        }

        let computedTitle = '';
        try {
          computedTitle = new URL(targetUrl).hostname;
        } catch (_) {
          computedTitle = 'Shortened Link';
        }

        insertedLinks.push({
          originalUrl: targetUrl,
          shortCode,
          title: computedTitle,
          userId: req.user.id,
          expiresAt: null,
          clickCount: 0
        });
      }
    }

    if (insertedLinks.length === 0) {
      return res.status(400).json({ message: 'No valid URLs containing http:// or https:// found inside the file' });
    }

    await Url.insertMany(insertedLinks);

    res.status(201).json({
      success: true,
      count: insertedLinks.length,
      message: 'Bulk operations processed successfully'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error processing your bulk upload request' });
  }
});

// @route   POST api/url/shorten
// @desc    Create a shortened URL
// @access  Private
router.post('/shorten', auth, async (req, res) => {
  const { originalUrl, customAlias, expiresAt, title } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ message: 'Original URL is required' });
  }

  const isValidUrl = validator.isURL(originalUrl, {
    protocols: ['http', 'https'],
    require_protocol: true
  });
  if (!isValidUrl) {
    return res.status(400).json({ message: 'Please provide a valid URL, including http:// or https://' });
  }

  try {
    let shortCode;

    if (customAlias) {
      const aliasClean = customAlias.trim();
      if (aliasClean.length < 3) {
        return res.status(400).json({ message: 'Custom alias must be at least 3 characters' });
      }
      if (!/^[a-zA-Z0-9-_]+$/.test(aliasClean)) {
        return res.status(400).json({ message: 'Custom alias can only contain letters, numbers, hyphens, and underscores' });
      }

      const existing = await Url.findOne({
        $or: [{ shortCode: aliasClean }, { customAlias: aliasClean }]
      });
      if (existing) {
        return res.status(400).json({ message: 'Custom alias is already in use' });
      }
      shortCode = aliasClean;
    } else {
      let unique = false;
      let attempts = 0;
      while (!unique && attempts < 10) {
        shortCode = generateShortCode();
        const existing = await Url.findOne({
          $or: [{ shortCode }, { customAlias: shortCode }]
        });
        if (!existing) {
          unique = true;
        }
        attempts++;
      }
      if (!unique) {
        return res.status(500).json({ message: 'Failed to generate a unique short code. Please try again.' });
      }
    }

    let urlTitle = title || '';
    if (!urlTitle) {
      try {
        const urlObj = new URL(originalUrl);
        urlTitle = urlObj.hostname;
      } catch (e) {
        urlTitle = 'Shortened Link';
      }
    }

    const newUrl = new Url({
      originalUrl,
      shortCode,
      customAlias: customAlias ? customAlias.trim() : undefined,
      title: urlTitle,
      userId: req.user.id,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    await newUrl.save();
    res.status(201).json(newUrl);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating short link' });
  }
});

// @route   GET api/url
// @desc    Get all URLs for authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching links' });
  }
});

// @route   GET api/url/public-stats/:id
// @desc    Get clean analytics details for a short URL publicly
// @access  Public
router.get('/public-stats/:id', async (req, res) => {
  try {
    const urlData = await Url.findById(req.params.id)
      .select('title originalUrl shortCode clickCount'); 

    if (!urlData) {
      return res.status(404).json({ message: 'Short URL analytics not found' });
    }

    res.json(urlData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching public data' });
  }
});

// @route   PUT api/url/:id
// @desc    Update a URL (destination URL and/or expiry)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { originalUrl, expiresAt, title } = req.body;

  if (originalUrl) {
    const isValidUrl = validator.isURL(originalUrl, {
      protocols: ['http', 'https'],
      require_protocol: true
    });
    if (!isValidUrl) {
      return res.status(400).json({ message: 'Please provide a valid URL, including http:// or https://' });
    }
  }

  try {
    const url = await Url.findOne({ _id: req.params.id, userId: req.user.id });
    if (!url) {
      return res.status(404).json({ message: 'URL not found or unauthorized' });
    }

    if (originalUrl) url.originalUrl = originalUrl;
    if (title !== undefined) url.title = title;
    
    if (expiresAt === null || expiresAt === '') {
      url.expiresAt = null;
    } else if (expiresAt) {
      url.expiresAt = new Date(expiresAt);
    }

    await url.save();
    res.json(url);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating link' });
  }
});

// @route   DELETE api/url/:id
// @desc    Delete a URL and its visit analytics
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const url = await Url.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!url) {
      return res.status(404).json({ message: 'URL not found or unauthorized' });
    }

    await Visit.deleteMany({ urlId: url._id });
    res.json({ message: 'URL and associated analytics deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting link' });
  }
});

// @route   GET api/url/:id/analytics
// @desc    Get detailed analytics for a short URL
// @access  Private
router.get('/:id/analytics', auth, async (req, res) => {
  try {
    const url = await Url.findOne({ _id: req.params.id, userId: req.user.id });
    if (!url) {
      return res.status(404).json({ message: 'URL not found or unauthorized' });
    }

    const visits = await Visit.find({ urlId: url._id }).sort({ timestamp: -1 }).limit(50);

    const browserStats = await Visit.aggregate([
      { $match: { urlId: url._id } },
      { $group: { _id: '$browser', count: { $sum: 1 } } }
    ]);

    const osStats = await Visit.aggregate([
      { $match: { urlId: url._id } },
      { $group: { _id: '$os', count: { $sum: 1 } } }
    ]);

    const deviceStats = await Visit.aggregate([
      { $match: { urlId: url._id } },
      { $group: { _id: '$device', count: { $sum: 1 } } }
    ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const clickTrends = await Visit.aggregate([
      { 
        $match: { 
          urlId: url._id,
          timestamp: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp', timezone: 'UTC' } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dailyClicks = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const formattedDate = d.toISOString().split('T')[0];
      const match = clickTrends.find(item => item._id === formattedDate);
      dailyClicks.push({
        date: formattedDate,
        clicks: match ? match.clicks : 0
      });
    }

    const lastVisit = visits.length > 0 ? visits[0].timestamp : null;

    res.json({
      url,
      totalClicks: url.clickCount,
      lastVisit,
      visits,
      browserStats: browserStats.map(item => ({ name: item._id, value: item.count })),
      osStats: osStats.map(item => ({ name: item._id, value: item.count })),
      deviceStats: deviceStats.map(item => ({ name: item._id, value: item.count })),
      dailyClicks
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});

module.exports = router;