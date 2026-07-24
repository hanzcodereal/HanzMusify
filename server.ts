import express from 'express';
import path from 'path';
import https from 'https';
import http from 'http';
import searchHandler from './api/search.js';
import lyricsHandler from './api/lyrics.js';
import artistHandler from './api/artist.js';
import suggestHandler from './api/suggest.js';
import ytplayHandler from './api/ytplay.js';
import streamHandler from './api/stream.js';
import albumHandler from './api/album.js';
import proxyAudioHandler from './api/proxy-audio.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/player.js', (req, res) => res.sendFile(path.join(process.cwd(), 'public/player.js')));
app.get('/home.js', (req, res) => res.sendFile(path.join(process.cwd(), 'public/home.js')));
app.get('/search.js', (req, res) => res.sendFile(path.join(process.cwd(), 'public/search.js')));
app.get('/miniplayer.js', (req, res) => res.sendFile(path.join(process.cwd(), 'public/miniplayer.js')));
app.get('/fullplayer.js', (req, res) => res.sendFile(path.join(process.cwd(), 'public/fullplayer.js')));
app.get('/artist.js', (req, res) => res.sendFile(path.join(process.cwd(), 'public/artist.js')));
app.get('/album.js', (req, res) => res.sendFile(path.join(process.cwd(), 'public/album.js')));
app.get('/app.js', (req, res) => res.sendFile(path.join(process.cwd(), 'public/app.js')));

app.get('/api/search', searchHandler);
app.get('/api/lyrics', lyricsHandler);
app.get('/api/artist', artistHandler);
app.get('/api/suggest', suggestHandler);
app.post('/api/ytplay', ytplayHandler);
app.get('/api/stream', streamHandler);
app.get('/api/album', albumHandler);
app.get('/api/proxy-audio', proxyAudioHandler);

app.use(express.static(path.join(process.cwd(), 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});