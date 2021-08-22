/**
 * 1. Render songs --> OK
 * 2. Scroll top  -> OK
 * 3. play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat and ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const headerName = $('.header-name');
const cd = $('.cd');
const audio = $('#audio');
const btnPlay = $('.btn-main');
const playlist = $('.playlist');
const btnPrev = $('.btn-prev');
const btnRepeat = $('.btn-repeat');
const btnNext = $('.btn-next');
const btnRandom = $('.btn-random');
const progress = $('#progress');

const app = {
  songs: [
    {
      name: 'Speechless',
      singer: 'NaomiScott',
      path: './songs/Speechless-NaomiScott.mp3',
      image: './images/Speechless.jpg',
    },
    {
      name: 'Arms',
      singer: 'Christina Perri',
      path: './songs/Arms - Christina Perri.mp3',
      image: './images/arms.jpg',
    },
    {
      name: 'Hạ Còn Vương Nắng',
      singer: 'DatKaa',
      path: './songs/Ha Con Vuong Nang - DatKaa.mp3',
      image: './images/ha-con-vuong-nang.jpg',
    },
    {
      name: 'My Love',
      singer: 'Weslife',
      path: './songs/My Love - Westlife.mp3',
      image: './images/my-love.jpg',
    },
    {
      name: 'Start Sky',
      singer: 'Two Steps From Hell',
      path: './songs/Star Sky - Two Steps From Hell.mp3',
      image: './images/start-sky.jpg',
    },
    {
      name: 'Reality',
      singer: 'Lost Frequencies',
      path: './songs/Reality - Lost Frequencies_ Janieck Devy.mp3',
      image: './images/reality.jpg',
    },
    {
      name: 'Fight Song',
      singer: 'Rachel Platten',
      path: './songs/Fight Song - Rachel Platten.mp3',
      image: './images/fight-song.jpg',
    },
    {
      name: 'Beautifull In White',
      singer: 'WestLife',
      path: './songs/Beautiful In White - WestLife.mp3',
      image: './images/beautifull-in-white.jpg',
    },
    {
      name: 'I Do',
      singer: '911',
      path: './songs/I Do - 911.mp3',
      image: './images/i-do.jpg',
    },
    {
      name: 'Unstoppable',
      singer: 'Sia',
      path: './songs/Unstoppable - Sia.mp3',
      image: './images/unstoppable.jpg',
    },
    {
      name: 'Like My Father',
      singer: 'Jax',
      path: './songs/Like My Father - Jax.mp3',
      image: './images/like-my-father.jpg',
    },
  ],
  indexCurrentSong: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,

  // Trả ra bài hát hiện tại
  getCurrentSong: function () {
    return this.songs[this.indexCurrentSong];
  },

  // Load bài hát hiện tại
  loadCurrentSong: function () {
    headerName.innerHTML = this.getCurrentSong().name;
    // cd.attributes.src.value
    audio.src = this.getCurrentSong().path;
    cd.attributes.src.textContent = this.getCurrentSong().image;
  },

  // Khi người dùng ấn next bài hát
  nextSong: function () {
    if (this.indexCurrentSong++ >= this.songs.length - 1)
      this.indexCurrentSong = 0;
    this.loadCurrentSong();
    this.activeSong(this.indexCurrentSong);
  },

  // Khi người dùng ấn random song
  randomSong: function () {
    let random;
    do {
      random = Math.round(Math.random() * (this.songs.length - 1));
    } while (random == this.indexCurrentSong);
    this.indexCurrentSong = random;
    this.loadCurrentSong();
    this.activeSong(this.indexCurrentSong);
  },

  // Khi người dùng ấn lùi bài hát
  prevSong: function () {
    if (this.indexCurrentSong === 0)
      this.indexCurrentSong = this.songs.length - 1;
    else this.indexCurrentSong--;
    this.loadCurrentSong();
    this.activeSong(this.indexCurrentSong);
  },

  // active bài hát hiện tại
  activeSong: function (indexSong) {
    const listSong = $$('.song');
    listSong.forEach(function (songItem, index) {
      songItem.classList.remove('active');
      if (index === indexSong) songItem.classList.add('active');
    });
  },
  setScroll: function (block) {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: block,
      });
    }, 400);
  },
  // Scroll active into view: Chuyển bào hát đến mắt nhìn
  scrollToActiveSong: function () {
    if (this.indexCurrentSong < 6) this.setScroll('end');
    else this.setScroll('center');
  },
  // Xư lí các sự kiện
  handleEvent: function () {
    const _this = this;
    // Xử lí phóng to thu nhỏ cd
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop || window.scrollY;
      const newCdWidth = cdWidth - scrollTop;
      if (newCdWidth > 0) cd.style.width = newCdWidth + 'px';
      else cd.style.width = 0;
      cd.style.height = cd.style.width;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    // Cd quay
    const cdThumb = cd.animate([{ transform: 'rotate(360deg)' }], {
      duration: 10000,
      iterations: Infinity,
    });

    // Xử lí khi người dùng bấm chuột vào button play
    btnPlay.onclick = function () {
      if (_this.isPlaying) audio.pause();
      else audio.play();
    };
    audio.onplay = function () {
      _this.isPlaying = true;
      btnPlay.classList.add('playing');
      cdThumb.play();
    };
    audio.onpause = function () {
      _this.isPlaying = false;
      btnPlay.classList.remove('playing');
      cdThumb.pause();
    };

    // Progress chạy tự động
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.round(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    // Khi người dùng tua
    progress.onchange = function () {
      audio.currentTime = audio.duration * (progress.value / 100);
    };
    // Khi người dùng next bài hát
    btnNext.onclick = function () {
      if (_this.isRandom) _this.randomSong();
      else _this.nextSong();
      audio.play();
      _this.scrollToActiveSong();
    };
    // Khi người dùng next bài hát
    btnPrev.onclick = function () {
      if (_this.isRandom) _this.randomSong();
      else _this.prevSong();
      audio.play();
      _this.scrollToActiveSong();
    };
    // Khi người dùng repeat bài hát
    btnRepeat.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      btnRepeat.classList.toggle('active', _this.isRepeat);
      btnRandom.classList.remove('active');
      audio.loop = _this.isRepeat;
    };
    // Khi người dùng nhấn random
    btnRandom.onclick = function () {
      _this.isRandom = !_this.isRandom;
      btnRandom.classList.toggle('active', _this.isRandom);
      btnRepeat.classList.remove('active');
    };
    // Xử lí khi bài hát kết thúc
    audio.onended = function () {
      if (_this.isRandom) _this.randomSong();
      else _this.nextSong();
      audio.play();
    };
    // Xử lí khi click vào song và nút option
    playlist.onclick = function (event) {
      // Xử lí khi nhấn vào song node;
      const songNode = event.target.closest('.song:not(.active)');
      if (songNode || event.target.closest('.btn-option')) {
        if (songNode) {
          _this.indexCurrentSong = Number(songNode.dataset.id);
          console.log(_this.indexCurrentSong);
          _this.loadCurrentSong();
          _this.activeSong(_this.indexCurrentSong);
          audio.play();
          _this.scrollToActiveSong();
        }
      }
    };
    // Xử lí khi active khi chuyển bài hát
    this.activeSong(_this.indexCurrentSong);
  },

  renderSong: function () {
    let i = 0;
    const htmls = this.songs.map((song) => {
      return ` <div class="song" data-id="${i++}">
          <img src="${song.image}" alt="" class="thumb" />
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <button class="btn btn-option">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>`;
    });
    playlist.innerHTML = htmls.join('');
  },
  start: function () {
    // Render ra danh sach bai hat
    this.renderSong();
    // Xu li su kiem
    this.handleEvent();
    // Load bai hat hien tai
    this.loadCurrentSong();
    // Khi người dùng next song
  },
};

app.start();
