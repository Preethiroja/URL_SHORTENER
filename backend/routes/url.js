const express = require('express');
const router = express.Router();
const validator = require('validator');
const Url = require('../models/Url');
const Visit = require('../models/Visit');
const auth = require('../middleware/auth');

// Helper to generate a unique short code
const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function generateShortCode(length = 6) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return result;
}

// @route   POST api/url/shorten
// @desc    Create a shortened URL
// @access  Private
router.post('/shorten', auth, async (req, res) => {
  const { originalUrl, customAlias, expiresAt, title } = req.body;

  // Validate original URL
  if (!originalUrl) {
    return res.status(400).json({ message: 'Original URL is required' });
  }

  // Validate URL format (isURL checks protocol, host, etc.)
  const isValidUrl = validator.isURL(originalUrl, {
    protocols: ['http', 'https'],
    require_protocol: true
  });
  if (!isValidUrl) {
    return res.status(400).json({ message: 'Please provide a valid URL, including http:// or https://' });
  }

  try {
    let shortCode;

    // Handle Custom Alias
    if (customAlias) {
      const aliasClean = customAlias.trim();
      if (aliasClean.length < 3) {
        return res.status(400).json({ message: 'Custom alias must be at least 3 characters' });
      }
      if (!/^[a-zA-Z0-9-_]+$/.test(aliasClean)) {
        return res.status(400).json({ message: 'Custom alias can only contain letters, numbers, hyphens, and underscores' });
      }

      // Check if alias exists in system (shortCode OR customAlias)
      const existing = await Url.findOne({
        $or: [{ shortCode: aliasClean }, { customAlias: aliasClean }]
      });
      if (existing) {
        return res.status(400).json({ message: 'Custom alias is already in use' });
      }
      shortCode = aliasClean;
    } else {
      // Generate a unique short code
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

    // Determine a title if none is provided
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
    const url = await Url.findOne({ _id: req.id || req.params.id, userId: req.user.id });
    if (!url) {
      return res.status(404).json({ message: 'URL not found or unauthorized' });
    }

    if (originalUrl) url.originalUrl = originalUrl;
    if (title !== undefined) url.title = title;
    
    // Allow removing expiry date by sending null/empty
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

    // Delete associated visits
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

    // Get the 50 most recent visits
    const visits = await Visit.find({ urlId: url._id }).sort({ timestamp: -1 }).limit(50);

    // Aggregate visits by Browser, OS, Device
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

    // Daily click trends for the last 7 days
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

    // Ensure we send back a complete array of the last 7 dates even if there are 0 clicks
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

    // Find the last visited time
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
