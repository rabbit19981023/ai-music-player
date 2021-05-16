const buildMusicPlayer = async function (): Promise<void> {
  type Song = {
    _id: string
    data: {
      song_name: string,
      type: string,
      genre: string,
      singer: string,
      bpm: number,
      tone: string,
      media_url: string,
      youtube_thumbnail: string,
      path: string,
      nlp_psg: [list: string[]],
      keywords: string[],
      status: string
    },
    status: string,
    _v: string
  }

  // Get All Hymns
  const getSongs = async function (): Promise<Song[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('/v1/api/songs' + window.location.search)
        const songs: Song[] = await response.json()

        resolve(songs)
      } catch (err) { reject(err) }
    })
  }

  try {
    const songs: Song[] = await getSongs()

    // Div.song-info
    const buildSongInfo = function (): HTMLDivElement {
      const songInfo: HTMLDivElement = document.createElement('div')
      songInfo.classList.add('song-info')

      songInfo.innerHTML = (`
        <img class="song-img">

        <center>
          <div>
            <center>
              <span class="song-name">查無歌曲</span>
              <span class="split"> - </span>
              <span class="singer">查無歌手</span>
            </center>
          </div>
        </center>

        <hr>
      `)

      return songInfo
    }

    // Div.time-range
    const buildTimeRange = function (): HTMLDivElement {
      const timeRange: HTMLDivElement = document.createElement('div')
      timeRange.classList.add('time-range')

      timeRange.innerHTML = (`
        <span class="current-time">00 : 00</span>
        <input type="range" value="0">
        <span class="song-time">00 : 00</span>
      `)

      return timeRange
    }

    // Div.song-sontrols
    const buildSongControls = function (): HTMLDivElement {
      const songControls: HTMLDivElement = document.createElement('div')
      songControls.classList.add('song-controls')

      songControls.innerHTML = (`
        <center>
          <i class="fas fa-backward pre"></i>
          <i class="fas fa-play play"></i>
          <i class="fas fa-forward next"></i>
        </center>
      `)

      return songControls
    }

    /** Core Music-Player Features **/
    const buildAudio = function () {
      if (songs.length > 0) {
        // Audio Element Init
        const audio: HTMLAudioElement = new Audio()

        // Declare Variables
        const playBtn: HTMLElement = document.querySelector('.play') as HTMLElement
        const preBtn: HTMLElement = document.querySelector('.pre') as HTMLElement
        const nextBtn: HTMLElement = document.querySelector('.next') as HTMLElement
        const songRange: HTMLInputElement = document.querySelector('input[type="range"]') as HTMLInputElement

        const songName: HTMLSpanElement = document.querySelector('.song-name') as HTMLSpanElement
        const singer: HTMLSpanElement = document.querySelector('.singer') as HTMLSpanElement
        const songImg: HTMLImageElement = document.querySelector('.song-img') as HTMLImageElement

        const currentTime: HTMLSpanElement = document.querySelector('.current-time') as HTMLSpanElement
        const songTime: HTMLSpanElement = document.querySelector('.song-time') as HTMLSpanElement

        // Music-Player Init
        let songCount: number = 0
        const currentSong: Song["data"] = songs[songCount].data

        audio.src = 'http://163.18.42.232:8000/play?filename=' + currentSong.path
        songName.textContent = currentSong.song_name
        singer.textContent = currentSong.singer
        songImg.src = currentSong.youtube_thumbnail

        // 'Audio.loadedmetadata' Event Listener
        const buildSongMeta = function () {
          const songDuration: number = audio.duration

          songRange.max = String(songDuration)

          let minutes: number | string = Math.floor(songDuration / 60)
          if (minutes < 10) {
            minutes = '0' + minutes
          }

          let seconds: number | string = Math.floor(songDuration % 60)
          if (seconds < 10) {
            seconds = '0' + seconds
          }

          songTime.textContent = `${minutes} : ${seconds}`
        }
        audio.addEventListener('loadedmetadata', buildSongMeta)

        // 'Range.change' Event Listener
        // 'Range.change' Event Triggered when user change the input[type="range"]
        const changeSongTime = function () {
          audio.currentTime = parseInt(songRange.value)
        }
        songRange.addEventListener('input', changeSongTime)

        // update Range & <minutes>:<seconds> while Playing
        let updateAnimation: number | null = null
        const updateRangeAndTime = function () {
          const songCurrentTime: number = audio.currentTime

          songRange.value = String(songCurrentTime)

          let minutes: number | string = Math.floor(songCurrentTime / 60)
          if (minutes < 10) {
            minutes = '0' + minutes
          }

          let seconds: number | string = Math.floor(songCurrentTime % 60)
          if (seconds < 10) {
            seconds = '0' + seconds
          }

          currentTime.textContent = `${minutes} : ${seconds}`

          updateAnimation = requestAnimationFrame(updateRangeAndTime)
        }

        // PlaySong Function
        let isPlaying: boolean = false
        
        const playSong = function () {
          if (!isPlaying) {
            playBtn.classList.remove('fa-play')
            playBtn.classList.add('fa-pause')

            audio.play()
            requestAnimationFrame(updateRangeAndTime)
            isPlaying = true
            return
          }

          playBtn.classList.remove('fa-pause')
          playBtn.classList.add('fa-play')

          audio.pause()
          cancelAnimationFrame(updateAnimation)
          isPlaying = false
        }
        playBtn.addEventListener('click', playSong)

        // ChangeSong Function
        const changeSong = function (song: Song["data"]) {
          audio.src = 'http://163.18.42.232:8000/play?filename=' + song.path
          songName.textContent = song.song_name
          singer.textContent = song.singer
          songImg.src = song.youtube_thumbnail
        }

        // 'Audio.ended' Event Listener
        const songEnd = function () {
          songCount += 1

          if (songCount > (songs.length - 1)) {
            songCount = 0
          }

          const song: Song["data"] = songs[songCount].data
          changeSong(song)

          audio.play()
        }
        audio.addEventListener('ended', songEnd)

        // 'preBtn.click' Event Listener
        const playPreSong = function () {
          songCount -= 1

          if (songCount < 0) {
            songCount = songs.length - 1
          }

          const song: Song["data"] = songs[songCount].data
          changeSong(song)

          isPlaying = false
          playSong()
        }
        preBtn.addEventListener('click', playPreSong)

        // 'nextBtn.click' Event Listener
        const playNextSong = function () {
          songCount += 1

          if (songCount > (songs.length - 1)) {
            songCount = 0
          }

          const song: Song["data"] = songs[songCount].data
          changeSong(song)

          isPlaying = false
          playSong()
        }
        nextBtn.addEventListener('click', playNextSong)
      }
    }

    const buildSongList = function () {
      
    }

    const songInfo: HTMLDivElement = buildSongInfo()
    const timeRange: HTMLDivElement = buildTimeRange()
    const songControls: HTMLDivElement = buildSongControls()

    const musicPlayer: HTMLDivElement = document.createElement('div')
    musicPlayer.classList.add('music-player')
    musicPlayer.appendChild(songInfo)
    musicPlayer.appendChild(timeRange)
    musicPlayer.appendChild(songControls)

    const container: HTMLDivElement = document.querySelector('.container') as HTMLDivElement
    container.appendChild(musicPlayer)
    
    buildAudio()
  } catch (err) {
    console.log(err)
    window.alert('伺服器錯誤2，請稍後再試！')
  }
}

buildMusicPlayer()
