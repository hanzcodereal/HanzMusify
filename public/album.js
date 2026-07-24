const Album = {
    init() {
        if(!gid('album-container')) {
            const div = document.createElement('div');
            div.id = 'album-container';
            document.body.appendChild(div);
        }
        gid('album-container').innerHTML = `
        <div id="album-modal" class="fixed inset-0 bg-[#121212] flex flex-col z-[150]" style="display:none; animation: slideUp 0.3s ease-out forwards;">
            <div class="flex items-center gap-3 p-4 pt-6 bg-transparent absolute top-0 left-0 w-full z-10" id="album-header">
                <button onclick="Album.close()" class="text-white/70 hover:text-white hover:bg-white/10 p-3 rounded-full active:scale-90 transition-all"><i data-lucide="arrow-left" class="w-6 h-6"></i></button>
                <h1 id="album-title" class="text-xl font-bold truncate text-white">Album</h1>
            </div>
            <div class="flex-1 overflow-y-auto hide-scrollbar pb-28 relative" id="album-content" onscroll="Album.handleScroll()">
                <div class="flex justify-center mt-32">
                    <div class="w-10 h-10 border-3 border-[#1ed760] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        </div>`;
        lucide.createIcons();
    },
    handleScroll() {
        const c = gid('album-content');
        const h = gid('album-header');
        if (c.scrollTop > 50) {
            h.style.background = 'rgba(18,18,18,0.9)';
            h.style.backdropFilter = 'blur(10px)';
        } else {
            h.style.background = 'transparent';
            h.style.backdropFilter = 'none';
        }
    },
    open(id) {
        gid('album-modal').style.display='flex';
        gid('album-content').innerHTML = `
        <div class="flex justify-center mt-32">
            <div class="w-10 h-10 border-3 border-[#1ed760] border-t-transparent rounded-full animate-spin"></div>
        </div>`;
        MP.hide();
        
        fetch('/api/album?id=' + id)
        .then(res => res.json())
        .then(data => {
            if(!data.status || !data.result) {
                gid('album-content').innerHTML = '<div class="p-6 text-center text-[#6b7280] mt-20">Gagal memuat album</div>';
                return;
            }
            const a = data.result;
            const im = a.thumbnails && a.thumbnails.length ? a.thumbnails[a.thumbnails.length - 1].url : FI;
            
            let html = `
            <div class="relative w-full aspect-square md:aspect-video max-h-[45vh] overflow-hidden -mt-20">
                <img src="${getHDImage(im)}" class="w-full h-full object-cover blur-3xl opacity-50 absolute inset-0 scale-125" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent"></div>
                
                <div class="absolute bottom-6 left-6 right-6 flex items-end gap-6 z-20">
                    <img src="${getHDImage(im)}" class="w-32 h-32 md:w-48 md:h-48 rounded-xl shadow-2xl object-cover border border-white/10" onerror="this.src='${FI}'" />
                    <div>
                        <p class="text-[10px] font-bold text-[#1ed760] uppercase tracking-[0.2em] mb-1">ALBUM / PLAYLIST</p>
                        <h1 class="text-3xl md:text-5xl font-black text-white mb-2 leading-tight drop-shadow-lg line-clamp-2">${es(a.title)}</h1>
                        ${a.description ? `<p class="text-[#b3b3b3] text-xs md:text-sm line-clamp-2">${es(a.description)}</p>` : ''}
                    </div>
                </div>
            </div>

            <div class="px-6 mt-6">
                <div class="flex items-center gap-4 mb-6">
                    <button onclick="Album.playAll('${id}')" class="bg-[#1ed760] hover:bg-[#1fdf64] text-black w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-all shadow-xl shadow-[#1ed760]/30">
                        <i data-lucide="play" class="w-7 h-7 fill-current ml-1"></i>
                    </button>
                    <button onclick="Album.importPlaylist('${id}', '${es(a.title).replace(/'/g, "\\'")}')" class="text-white/70 hover:text-white p-3 rounded-full active:scale-95 bg-white/5 transition-all"><i data-lucide="download" class="w-6 h-6"></i></button>
                    <button onclick="Album.shuffleAll('${id}')" class="text-white/70 hover:text-white p-3 rounded-full active:scale-95 bg-white/5 transition-all"><i data-lucide="shuffle" class="w-6 h-6"></i></button>
                    <button onclick="Album.toggleLikeAlbum('${id}')" class="text-white/70 hover:text-[#1ed760] p-3 rounded-full active:scale-95 bg-white/5 transition-all" id="album-like-btn"><i data-lucide="heart" class="w-6 h-6 ${isAlbumLiked(id) ? 'fill-[#1ed760] text-[#1ed760]' : ''}"></i></button>
                </div>`;

            if(a.songs && a.songs.length > 0) {
                S['album_'+id] = a.songs.map(s => {
                    const sim = s.thumbnails && s.thumbnails.length ? s.thumbnails[0].url : im;
                    return {
                        id: s.videoId, videoId: s.videoId, title: s.title, artist: s.artist, artistId: s.artistId, cover: getHDImage(sim), ytUrl: 'https://youtube.com/watch?v='+s.videoId
                    };
                });
                
                html += '<div class="space-y-1 pb-10">';
                a.songs.forEach((s, i) => {
                    const sim = s.thumbnails && s.thumbnails.length ? s.thumbnails[0].url : im;
                    const liked = isLiked(s.videoId);
                    html += `
                    <div class="flex items-center gap-3 p-3 hover:bg-[#282828] rounded-xl cursor-pointer group active:scale-[0.98] transition-all">
                        <div onclick="Album.playSong('${id}', ${i})" class="flex items-center gap-3 flex-1">
                            <div class="w-6 text-center text-[#6b7280] text-sm font-medium group-hover:text-white">${i+1}</div>
                            <img src="${getHDImage(sim)}" class="w-10 h-10 rounded object-cover shadow-sm" onerror="this.src='${FI}'" />
                            <div class="truncate flex-1 min-w-0 pr-4">
                                <p class="font-medium text-white text-base truncate mb-0.5">${es(s.title)}</p>
                                <p class="text-[#6b7280] text-xs truncate">${es(s.artist)}</p>
                            </div>
                        </div>
                        <div class="text-xs text-[#6b7280] font-mono opacity-80">${es(s.duration)}</div>
                        <button onclick="event.stopPropagation();toggleLikeTrack('${s.videoId}')" class="text-[#6b7280] hover:text-[#1ed760] p-2 active:scale-90 transition-colors">${liked ? '<i data-lucide="heart" class="w-4 h-4 fill-[#1ed760] text-[#1ed760]"></i>' : '<i data-lucide="heart" class="w-4 h-4"></i>'}</button>
                        <button onclick="event.stopPropagation();showPlaylistPicker(S['album_'+'${id}'][${i}])" class="text-[#6b7280] hover:text-white p-2 active:scale-90 opacity-0 group-hover:opacity-100 transition-opacity"><i data-lucide="plus" class="w-5 h-5"></i></button>
                    </div>`;
                });
                html += '</div>';
            } else {
                html += '<div class="text-center text-[#6b7280] py-12"><i data-lucide="disc-3" class="w-16 h-16 mx-auto mb-4 opacity-20"></i><p>Tidak ada lagu di album ini</p></div>';
            }

            html += '</div>';
            gid('album-content').innerHTML = html;
            lucide.createIcons();
            updateAlbumLikeButton(id);
        })
        .catch(e => {
            gid('album-content').innerHTML = '<div class="p-6 text-center text-[#6b7280] mt-20">Gagal: '+e.message+'</div>';
        });
    },
    close() {
        gid('album-modal').style.display = 'none';
        gid('album-content').innerHTML = '';
        MP.show();
    },
    playSong(id, index) {
        if(!S['album_'+id] || !S['album_'+id][index]) return;
        S.pl = S['album_'+id];
        S.pi = index;
        S.ps = 'album';
        S.ct = S.pl[S.pi];
        UU();
        MP.show();
        S.il = true;
        UB();
        updateLikeButton();
        resetLyricsUI(S.ct.videoId);
        loadTrack(S.ct);
    },
    playAll(id) {
        if(!S['album_'+id] || S['album_'+id].length === 0) return;
        this.playSong(id, 0);
    },
    importPlaylist(id, title) {
        if(!S['album_'+id] || S['album_'+id].length === 0) return;
        const plId = createPlaylist(title, '');
        var pls = getUserPlaylists();
        var pl = pls.find(p => p.id === plId);
        if(pl) {
            pl.songs = S['album_'+id].map(s => {
                const im = s.thumbnails && s.thumbnails.length ? s.thumbnails[s.thumbnails.length - 1].url : FI;
                return {
                    id: s.videoId,
                    videoId: s.videoId,
                    title: s.title,
                    artist: s.artist,
                    cover: getHDImage(im),
                    artistId: s.artistId || '',
                    ytUrl: 'https://youtube.com/watch?v=' + s.videoId
                };
            });
            
            if (pl.songs.length > 0 && !pl.image) {
                pl.image = pl.songs[0].cover;
            }
            
            saveUserPlaylists(pls);
            showToast('Playlist "' + title + '" tersimpan di Library!');
            
            if(window.Library) { Library.render(); }
        }
    },
    shuffleAll(id) {
        if(!S['album_'+id] || S['album_'+id].length === 0) return;
        S.pl = [...S['album_'+id]].sort(() => Math.random() - 0.5);
        this.playSong(id, 0);
    },
    toggleLikeAlbum(id) {
        var likedAlbums = getLikedAlbums();
        var idx = likedAlbums.indexOf(id);
        if(idx > -1) {
            likedAlbums.splice(idx, 1);
            showToast('Dihapus dari Album Disukai');
        } else {
            likedAlbums.push(id);
            showToast('Ditambahkan ke Album Disukai');
        }
        saveLikedAlbums(likedAlbums);
        updateAlbumLikeButton(id);
    }
};

function getLikedAlbums() {
    try{return JSON.parse(localStorage.getItem('hanzz_liked_albums')||'[]');}
    catch(e){return [];}
}

function saveLikedAlbums(albums) {
    try{localStorage.setItem('hanzz_liked_albums',JSON.stringify(albums));}
    catch(e){}
}

function isAlbumLiked(id) {
    var albums = getLikedAlbums();
    return albums.indexOf(id) > -1;
}

function updateAlbumLikeButton(id) {
    var btn = gid('album-like-btn');
    if(!btn) return;
    var liked = isAlbumLiked(id);
    if(liked) {
        btn.innerHTML = '<i data-lucide="heart" class="w-6 h-6 fill-[#1ed760] text-[#1ed760]"></i>';
    } else {
        btn.innerHTML = '<i data-lucide="heart" class="w-6 h-6"></i>';
    }
    lucide.createIcons();
}