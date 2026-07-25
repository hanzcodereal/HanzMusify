var FullPlayer={
    init(){
        gid('full-container').innerHTML=`
        <div id="full-player" class="fixed flex flex-col justify-between z-[170] bg-[#0d0e15] text-white p-4 pt-safe sm:p-6 sm:pt-safe" style="display:none;transition:transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);transform:translateY(100%);top:0;left:0;right:0;bottom:0;overflow:hidden;touch-action:none;">
            
            <!-- Ambient Artwork Background -->
            <img id="full-bg-artwork" src="" class="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none z-0" />
            <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-[#0d0e15]/90 to-[#0d0e15] pointer-events-none z-0"></div>
            <!-- Dynamic Radial Ambient Glow -->
            <div id="full-bg-glow" class="absolute inset-0 pointer-events-none opacity-25 transition-all duration-700 bg-radial from-white/10 via-transparent to-transparent z-0"></div>

            <!-- Top Header (Padding top 16-20px) -->
            <div class="relative z-10 flex justify-between items-center flex-shrink-0 pt-1 pb-1">
                <button onclick="FullPlayer.close()" class="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full active:scale-90 transition-all cursor-pointer" title="Tutup Player"><i data-lucide="chevron-down" class="w-7 h-7"></i></button>
                <div class="text-center">
                    <p class="text-[9px] uppercase tracking-[0.22em] text-[#a0a5b0] font-bold">Sedang Diputar</p>
                    <p id="full-header-artist" class="text-xs font-bold text-white/90 truncate max-w-[180px] mt-0.5"></p>
                </div>
                <!-- Tombol Opsi dirapatkan ke kanan (hamburger menu) -->
                <div class="flex items-center gap-1">
                    <button onclick="FullPlayer.openMoreSheet()" class="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full active:scale-90 transition-all cursor-pointer" title="Opsi"><i data-lucide="more-vertical" class="w-5 h-5"></i></button>
                </div>
            </div>

            <!-- Cover Artwork Container (Slightly larger ~85-88% Width) -->
            <div class="relative z-10 flex-1 flex items-center justify-center my-auto px-4 py-2" style="min-height:0;overflow:hidden;">
                <div class="relative w-[86%] sm:w-[88%] max-w-[340px] aspect-square flex items-center justify-center">
                    <img id="full-cover" src="" class="w-full h-full object-cover rounded-2xl  transition-transform duration-300 border border-white/10" />
                    
                    <!-- Loading & Overlay -->
                    <div id="full-cover-overlay" class="absolute inset-0 rounded-2xl flex flex-col items-center justify-center bg-black/50 [2px] transition-opacity duration-200 opacity-0 pointer-events-none z-20">
                        <div id="full-cover-icon" class="mb-2 text-white flex items-center justify-center"></div>
                        <span id="full-cover-text" class="text-xs font-black text-white tracking-[0.2em] uppercase drop-shadow text-center px-4"></span>
                    </div>
                </div>
            </div>

            <!-- Song Info + Progress + Controls + Grid -->
            <div class="relative z-10 flex-shrink-0 w-full max-w-md mx-auto space-y-3 pb-2">
                <!-- Song Info (Title + Heart on same line) -->
                <div class="flex items-center justify-between gap-3 px-1">
                    <div class="flex-1 min-w-0 truncate">
                        <div class="flex items-center gap-2">
                            <h2 id="full-title" class="text-xl sm:text-2xl font-black text-white truncate leading-tight">Pilih lagu</h2>
                            <span id="full-status-tag" class="hidden px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase border border-white/20 text-white bg-white/10 shrink-0"></span>
                        </div>
                        <p id="full-artist" class="text-[#a0a5b0] text-xs sm:text-sm font-medium truncate cursor-pointer hover:text-white mt-1" onclick="FullPlayer.openArtist()"></p>
                    </div>
                    <button id="full-like-btn" onclick="toggleCurrentLike(); if(typeof event !== 'undefined') event.stopPropagation();" class="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center active:scale-90 transition-all shrink-0 cursor-pointer shadow-md" title="Sukai Lagu">
                        <i data-lucide="heart" class="w-5 h-5"></i>
                    </button>
                </div>

                <!-- Progress Bar (0:45 ───────────── 1:54) -->
                <div class="flex items-center gap-3 px-1 my-2">
                    <span id="time-curr" class="text-[11px] text-[#a0a5b0] font-mono shrink-0 w-8 text-right font-semibold">0:00</span>
                    <div class="relative flex-1 h-1.5 bg-white/10 rounded-full flex items-center group cursor-pointer">
                        <input type="range" id="seek-bar" min="0" max="100" value="0" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" oninput="SK(this.value)" />
                        <div id="full-progress" class="relative h-full bg-white rounded-full transition-all duration-75" style="width:0%;">
                            <div class="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>
                    <span id="time-dur" class="text-[11px] text-[#a0a5b0] font-mono shrink-0 w-8 font-semibold">0:00</span>
                </div>

                <!-- Music Controls (Shuffle Prev Play Next Repeat) -->
                <div class="flex items-center justify-between px-2 py-1">
                    <button id="full-shuffle-btn" onclick="SF()" class="relative text-[#a0a5b0] hover:text-white active:scale-90 w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer" title="Acak (Shuffle)">
                        <i data-lucide="shuffle" class="w-5 h-5"></i>
                        <span id="full-shuffle-dot" class="hidden absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full"></span>
                    </button>
                    <button id="full-prev-btn" onclick="PV()" class="text-white/80 hover:text-white active:scale-90 w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer" title="Lagu Sebelumnya">
                        <i data-lucide="skip-back" class="w-6 h-6 fill-current"></i>
                    </button>
                    <button onclick="TP()" id="full-play-btn-wrap" class="relative bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all  shadow-white/20 cursor-pointer flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 shrink-0">
                        <div id="full-play-btn" class="flex items-center justify-center">
                            <i data-lucide="play" class="w-8 h-8 fill-current ml-0.5"></i>
                        </div>
                    </button>
                    <button id="full-next-btn" onclick="NX()" class="text-white/80 hover:text-white active:scale-90 w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer" title="Lagu Berikutnya">
                        <i data-lucide="skip-forward" class="w-6 h-6 fill-current"></i>
                    </button>
                    <button onclick="TR()" id="btn-repeat" class="relative text-[#a0a5b0] hover:text-white active:scale-90 w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer" title="Ulang (Repeat)">
                        <i data-lucide="repeat" class="w-5 h-5"></i>
                        <span id="repeat-one" class="hidden absolute top-0.5 left-1/2 -translate-x-1/2 text-[8px] font-black text-white">1</span>
                    </button>
                </div>


            </div>
        </div>`;

        gid('lyrics-container').innerHTML=`
        <div id="lyrics-overlay" class="fixed flex flex-col z-[200]" style="display:none;background:#000000;transition:transform 0.35s ease-out;transform:translateY(100%);top:0;left:0;width:100%;height:100%;overflow:hidden;touch-action:none;">
            <!-- Mobile Header -->
            <div class="md:hidden flex justify-between items-center p-4 pt-safe flex-shrink-0 bg-[#000000] border-b border-white/10 relative z-20 ">
                <div class="flex items-center gap-3 overflow-hidden">
                    <img id="lyrics-header-cover" src="" class="w-12 h-12 rounded-md object-cover shadow-md flex-shrink-0 bg-white/5" />
                    <div class="flex flex-col min-w-0">
                        <span id="lyrics-header-title" class="font-bold text-white text-base truncate">Lirik</span>
                        <span id="lyrics-header-artist" class="text-white/70 text-sm truncate"></span>
                    </div>
                </div>
                <button onclick="toggleLyrics()" class="text-white/70 hover:text-white p-2 rounded-full active:scale-90 flex-shrink-0 transition-all bg-white/10 ml-3"><i data-lucide="chevron-down" class="w-6 h-6"></i></button>
            </div>

            <!-- Floating Sync Controls -->
            <div class="md:hidden absolute top-[100px] right-6 z-30 flex items-center gap-2 bg-[#1a1a1a]/90  px-3 py-1.5 rounded-full border border-white/10 ">
                <button onclick="lyricSyncPrev()" class="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full active:scale-90 flex items-center justify-center transition-all"><i data-lucide="minus" class="w-4 h-4"></i></button>
                <p id="lyric-sync-badge-mobile" class="hidden text-xs font-bold text-white tracking-wide">+0</p>
                <button onclick="lyricSyncNext()" class="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full active:scale-90 flex items-center justify-center transition-all"><i data-lucide="plus" class="w-4 h-4"></i></button>
            </div>

            <!-- Desktop Close Button -->
            <button onclick="toggleLyrics()" class="hidden md:flex absolute top-8 right-8 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full active:scale-90 transition-all ">
                <i data-lucide="chevron-down" class="w-8 h-8"></i>
            </button>
            
            <div class="flex-1 flex flex-col md:flex-row w-full h-full overflow-hidden relative">
                <!-- Left Side: Lyrics Scroll -->
                <div id="lyrics-scroll-container" class="w-full md:w-3/5 h-full overflow-y-auto px-6 md:px-16 hide-scrollbar z-10 relative">
                    <div class="pt-[30vh] pb-[60vh] w-full max-w-3xl mx-auto md:mx-0">
                        <div id="lyrics-loading" class="flex justify-center items-center h-[30vh] w-full">
                            <div class="w-10 h-10 border-4 border-[#cfd3d8] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div id="lyrics-content" class="hidden w-full"></div>
                        <div id="lyrics-empty" class="hidden flex justify-center items-center h-[30vh] w-full text-white/50">
                            <div class="text-center">
                                <i data-lucide="music" class="w-20 h-20 mx-auto mb-4 opacity-30"></i>
                                <p class="text-lg">Lirik tidak tersedia</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Side: Cover & Info -->
                <div class="hidden md:flex w-2/5 flex-col justify-center items-start p-12 z-10 pl-16">
                    <img id="lyrics-desktop-cover" src="" class="w-[350px] max-w-full aspect-square rounded-xl  mb-8 object-cover bg-white/5" />
                    <h2 id="lyrics-desktop-title" class="font-bold text-white text-3xl mb-2 line-clamp-2 leading-tight">Lirik</h2>
                    <p id="lyrics-desktop-artist" class="text-white/70 text-lg line-clamp-1"></p>
                    <div class="flex items-center justify-start gap-3 mt-8">
                        <button onclick="lyricSyncPrev()" title="Sinkron mundur 1 lirik" class="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full active:scale-90 flex items-center justify-center transition-all"><i data-lucide="minus" class="w-5 h-5"></i></button>
                        <p id="lyric-sync-badge-desktop" class="text-xs font-bold text-white tracking-wide">+0</p>
                        <button onclick="lyricSyncNext()" title="Sinkron lanjut 1 lirik" class="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full active:scale-90 flex items-center justify-center transition-all"><i data-lucide="plus" class="w-5 h-5"></i></button>
                    </div>
                </div>
            </div>
        </div>`;
        lucide.createIcons();
    },
    open(){
        var fp=gid('full-player');
        if(!fp) return;
        fp.style.display='flex';
        document.body.style.overflow='hidden';
        requestAnimationFrame(function(){fp.style.transform='translateY(0)';});
        if(typeof MP !== 'undefined' && MP.hide) MP.hide();
        try{
            updateSleepBadge();
            updateSpeedBadge();
            if(typeof UB==='function')UB();
            if(typeof updateLikeButtons==='function')updateLikeButtons();
            if(S.ct && typeof FullPlayer.updateBeats === 'function') FullPlayer.updateBeats(S.ct);
        }catch(e){}
    },
    close(){
        var fp=gid('full-player');
        if(!fp) return;
        fp.style.transform='translateY(100%)';
        document.body.style.overflow='';
        setTimeout(function(){
            fp.style.display='none';
            if(typeof S!=='undefined'&&!S.lo&&typeof MP!=='undefined')MP.show();
        },350);
    },
    openArtist(){if(S.ct&&S.ct.artistId){FullPlayer.close();setTimeout(function(){Artist.open(S.ct.artistId,S.ct.artist);},400);}},
    openMoreSheet() {
        var existing = gid('full-more-sheet');
        if (existing) existing.remove();

        var sheet = document.createElement('div');
        sheet.id = 'full-more-sheet';
        sheet.className = 'fixed inset-0 z-[250] flex items-end justify-center bg-black/60 ';
        sheet.onclick = function(e) { if (e.target === sheet) sheet.remove(); };

        sheet.innerHTML = `
        <div class="bg-[#181922] w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.25s ease-out forwards;">
            <div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5"></div>
            
            <div class="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-white/5">
                <img src="${(S.ct && S.ct.cover) ? S.ct.cover : FI}" class="w-12 h-12 rounded-xl object-cover" onerror="this.src='${FI}'" />
                <div class="min-w-0 flex-1">
                    <h4 class="font-bold text-white text-sm truncate">${(S.ct && S.ct.title) ? es(S.ct.title) : 'Pilih Lagu'}</h4>
                    <p class="text-xs text-[#a0a5b0] truncate">${(S.ct && S.ct.artist) ? es(S.ct.artist) : ''}</p>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-3 mb-4">
                <button onclick="toggleAutoNext(); gid('full-more-sheet').remove();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer" style="opacity: ${S.autoNext ? '1' : '0.5'};">
                    <i data-lucide="skip-forward" class="w-5 h-5 ${S.autoNext ? 'text-rose-400' : 'text-white'}"></i>
                    <span class="text-xs font-semibold ${S.autoNext ? 'text-rose-400' : 'text-white/90'}">Auto Next</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();openEqualizer();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="sliders" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">EQ</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();openSleepTimer();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="clock" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">Timer</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();addCurrentToPlaylist();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="list-plus" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">Playlist</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();toggleLyrics();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="mic-2" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">Lirik</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();openPlaybackSpeed();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="gauge" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">Speed</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();openQueue();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="list-music" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">Queue</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();downloadCurrentSong();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="download" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">Download</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();openShareCard();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="share-2" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">Share</span>
                </button>
            </div>

            <button onclick="gid('full-more-sheet').remove()" class="w-full mt-2 py-3 bg-white/10 text-white font-bold rounded-full border border-white/10 active:scale-95 transition cursor-pointer">Tutup</button>
        </div>`;

        document.body.appendChild(sheet);
        lucide.createIcons();
    },
    applyColors(colors) {
        if (!colors || !colors[0]) return;
        var primary = colors[0];

        if (typeof S !== 'undefined') {
            S.currentAccentColor = primary;
        }

        // Full Player Progressbar Accent
        var fullProgress = gid('full-progress');
        if (fullProgress) {
            fullProgress.style.backgroundColor = primary;
        }

        // Play Button Background Accent
        var playBtn = gid('full-play-btn-wrap');
        if (playBtn) {
            playBtn.style.backgroundColor = primary;
        }

        // Soft Radial Ambient Glow
        var bgGlow = gid('full-bg-glow');
        if (bgGlow) {
            bgGlow.style.background = 'radial-gradient(circle at 50% 30%, color-mix(in srgb, ' + primary + ' 25%, transparent), transparent 70%)';
        }
    },
    updateBeats(track) {
        if (!track) return;
        var palette = (typeof MP !== 'undefined' && MP.getTrackColors) ? MP.getTrackColors(track) : ['#ffffff', '#a0a5b0'];
        FullPlayer.applyColors(palette);

        if (track.cover && track.cover.startsWith('http')) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = track.cover;
            img.onload = function() {
                var colors = (typeof MP !== 'undefined' && MP.extractFromImage) ? MP.extractFromImage(img) : null;
                if (colors) {
                    FullPlayer.applyColors(colors);
                }
            };
        }
    }
};