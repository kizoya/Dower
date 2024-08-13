const express = require('express');
const ejs = require('ejs');
const axios = require('axios');
const ytdl = require('ytdl-core');
const TikTokApi = require('tiktok-api');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/download', async (req, res) => {
    const { url, platform, format, resolution } = req.body;
    let videoInfo = {};

    try {
        if (platform === 'youtube') {
            videoInfo = await ytdl.getInfo(url);
        } else if (platform === 'tiktok') {
            const tiktok = new TikTokApi();
            videoInfo = await tiktok.getVideoInfo(url);
        }

        res.json({
            success: true,
            title: videoInfo.videoDetails ? videoInfo.videoDetails.title : videoInfo.itemInfo.itemStruct.desc,
            thumbnail: videoInfo.videoDetails ? videoInfo.videoDetails.thumbnails[0].url : videoInfo.itemInfo.itemStruct.covers[0],
            creator: videoInfo.videoDetails ? videoInfo.videoDetails.author.name : videoInfo.itemInfo.itemStruct.author.uniqueId,
            likes: videoInfo.videoDetails ? videoInfo.videoDetails.likes : videoInfo.itemInfo.itemStruct.stats.diggCount,
            views: videoInfo.videoDetails ? videoInfo.videoDetails.viewCount : videoInfo.itemInfo.itemStruct.stats.playCount
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching video info' });
    }
});

app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});
