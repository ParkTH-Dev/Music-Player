class MusicPlayer {
  constructor() {
    this.currentTrack = 0;
    this.isPlaying = false;
    this.isShuffled = false;
    this.isRepeating = false;
    this.volume = 0.5;

    this.initializeElements();
    this.initializeEventListeners();
    this.loadPlaylist();
    this.loadAndPlayTrack();
  }

  initializeElements() {
    this.vinylRecord = document.querySelector(".vinyl-record");
    this.tonearm = document.querySelector(".tonearm");
    this.playButton = document.querySelector(".btn-play");
    this.prevButton = document.querySelector(".btn-prev");
    this.nextButton = document.querySelector(".btn-next");
    this.shuffleButton = document.querySelector(".btn-shuffle");
    this.repeatButton = document.querySelector(".btn-repeat");
    this.volumeKnob = document.querySelector(".volume-knob");
    this.timeDisplay = document.querySelector(".time-display");
    this.trackName = document.querySelector(".track-name");
    this.artistName = document.querySelector(".artist-name");
    this.eqBars = document.querySelectorAll(".eq-bar");
  }

  initializeEventListeners() {
    this.playButton.addEventListener("click", () => this.togglePlay());
    this.prevButton.addEventListener("click", () => this.playPrevious());
    this.nextButton.addEventListener("click", () => this.playNext());
    this.shuffleButton.addEventListener("click", () => this.toggleShuffle());
    this.repeatButton.addEventListener("click", () => this.toggleRepeat());
    this.volumeKnob.addEventListener(
      "mousedown",
      this.initVolumeControl.bind(this)
    );

    // 오디오 이벤트
    this.audio = new Audio();
    this.audio.addEventListener("timeupdate", () => this.updateTime());
    this.audio.addEventListener("ended", () => this.handleTrackEnd());
  }

  loadPlaylist() {
    this.playlist = [
      {
        title: "Blizzards",
        artist: "Winter Collection",
        file: "music/Blizzards.mp3",
        albumArt: "img/member1.jpg",
      },
      {
        title: "Calm",
        artist: "Meditation Series",
        file: "music/Calm.mp3",
        albumArt: "img/member2.jpg",
      },
      {
        title: "Dusty Road",
        artist: "Travel Beats",
        file: "music/Dusty_Road.mp3",
        albumArt: "img/member3.jpg",
      },
      {
        title: "Escape",
        artist: "Adventure Sounds",
        file: "music/Escape.mp3",
        albumArt: "img/member4.jpg",
      },
      {
        title: "Payday",
        artist: "Urban Rhythm",
        file: "music/Payday.mp3",
        albumArt: "img/member5.jpg",
      },
      {
        title: "Retreat",
        artist: "Nature Sounds",
        file: "music/Retreat.mp3",
        albumArt: "img/member6.jpg",
      },
      {
        title: "Seasonal",
        artist: "Four Seasons",
        file: "music/Seasonal.mp3",
        albumArt: "img/member7.jpg",
      },
      {
        title: "Vespers",
        artist: "Evening Melodies",
        file: "music/Vespers.mp3",
        albumArt: "img/member8.jpg",
      },
    ];
    this.updateTrackInfo();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (!this.audio.src) {
      this.loadAndPlayTrack();
    }
    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.vinylRecord.classList.add("playing");
        this.tonearm.classList.add("playing");
        this.playButton.innerHTML = '<i class="fas fa-pause"></i>';
        this.startEqualizer();
      })
      .catch((error) => {
        console.error("재생 오류:", error);
        this.pause();
      });
  }

  pause() {
    this.isPlaying = false;
    this.vinylRecord.classList.remove("playing");
    this.tonearm.classList.remove("playing");
    this.playButton.innerHTML = '<i class="fas fa-play"></i>';
    this.audio.pause();
    this.stopEqualizer();
  }

  playNext() {
    this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
    this.loadAndPlayTrack();
  }

  playPrevious() {
    this.currentTrack =
      (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
    this.loadAndPlayTrack();
  }

  loadAndPlayTrack() {
    const track = this.playlist[this.currentTrack];
    this.audio.src = track.file;
    this.updateTrackInfo();

    if (this.isPlaying) {
      this.audio.play().catch((error) => {
        console.error("재생 오류:", error);
        this.pause();
      });
    }
  }

  updateTrackInfo() {
    const track = this.playlist[this.currentTrack];
    this.trackName.textContent = track.title;
    this.artistName.textContent = track.artist;

    const vinylRecord = document.querySelector(".vinyl-record");
    if (vinylRecord) {
      const img = new Image();
      img.onload = () => {
        vinylRecord.style.backgroundImage = `url('${track.albumArt}')`;
      };
      img.src = track.albumArt;
    }
  }

  initVolumeControl(e) {
    const knobRect = this.volumeKnob.getBoundingClientRect();
    const knobCenter = {
      x: knobRect.left + knobRect.width / 2,
      y: knobRect.top + knobRect.height / 2,
    };

    const handleMove = (e) => {
      const angle = Math.atan2(
        e.clientY - knobCenter.y,
        e.clientX - knobCenter.x
      );
      const rotation = angle * (180 / Math.PI) + 90;
      const volume = (rotation + 180) / 360;
      this.setVolume(Math.max(0, Math.min(1, volume)));
    };

    const handleUp = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  }

  setVolume(value) {
    this.volume = value;
    this.audio.volume = value;
    this.volumeKnob.style.transform = `rotate(${value * 360 - 180}deg)`;
  }

  startEqualizer() {
    this.equalizerInterval = setInterval(() => {
      this.eqBars.forEach((bar) => {
        const height = Math.random() * 30 + 20;
        bar.style.height = `${height}px`;
      });
    }, 100);
  }

  stopEqualizer() {
    clearInterval(this.equalizerInterval);
    this.eqBars.forEach((bar) => {
      bar.style.height = "20px";
    });
  }

  updateTime() {
    const minutes = Math.floor(this.audio.currentTime / 60);
    const seconds = Math.floor(this.audio.currentTime % 60);
    this.timeDisplay.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  handleTrackEnd() {
    if (this.isRepeating) {
      this.audio.play();
    } else {
      this.playNext();
    }
  }

  toggleShuffle() {
    this.isShuffled = !this.isShuffled;
    this.shuffleButton.classList.toggle("active");
  }

  toggleRepeat() {
    this.isRepeating = !this.isRepeating;
    this.repeatButton.classList.toggle("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const player = new MusicPlayer();
});
