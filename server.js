const express = require('express');
const cors = require('cors');
const TikTokScraper = require('tiktok-scraper');
const ytdl = require('ytdl-core');

const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());
app.use(express.json());

// Render index.ejs for the home route
app.get('/', (req, res) => {
  res.render('index', { title: 'TikTok and YouTube Downloader' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'TikTok and YouTube Downloader API' });
});

app.post('/api/tiktok/info', async (req, res) => {
  try {
    const { url } = req.body;
    const videoMeta = await TikTokScraper.getVideoMeta(url);
    res.json(videoMeta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tiktok/download', async (req, res) => {
  try {
    const { url } = req.body;
    const videoMeta = await TikTokScraper.getVideoMeta(url);
    const videoUrl = videoMeta.collector[0].videoUrl;
    res.json({ downloadUrl: videoUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/youtube/info', async (req, res) => {
  try {
    const { url } = req.body;
    const info = await ytdl.getInfo(url);
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/youtube/download', async (req, res) => {
  try {
    const { url, format } = req.body;
    const info = await ytdl.getInfo(url);
    let format_id = 'highestaudio';
    if (format === 'video') {
      format_id = 'highestvideo';
    }
    const format_info = ytdl.chooseFormat(info.formats, { quality: format_id });
    res.json({ downloadUrl: format_info.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
