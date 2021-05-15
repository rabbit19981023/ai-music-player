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
      path: string,
      nlp_psg: [list: string[]],
      keywords: string[],
      status: string
    },
    status: string,
    _v: string
  }

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

    const buildSongInfo = function (): HTMLDivElement {
      const songInfo: HTMLDivElement = document.createElement('div')
      songInfo.classList.add('song-info')

      songInfo.innerHTML = (`
        <span class="song-name">查無歌曲</span>
        <span class="split"> - </span>
        <span class="singer">查無歌手</span>
      `)

      return songInfo
    }

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

    const buildSongControls = function (): HTMLDivElement {
      const songControls: HTMLDivElement = document.createElement('div')
      songControls.classList.add('song-controls')

      songControls.innerHTML = (`
        <i class="fas fa-backward pre"></i>
        <i class="fas fa-play play"></i>
        <i class="fas fa-forward next"></i>
      `)

      return songControls
    }

    const buildAudio = function () {
      if (songs.length > 0) {
        const audio: HTMLAudioElement = new Audio()

        const playBtn: HTMLElement = document.querySelector('.play') as HTMLElement
        const preBtn: HTMLElement = document.querySelector('.pre') as HTMLElement
        const nextBtn: HTMLElement = document.querySelector('.next') as HTMLElement
        const songRange: HTMLInputElement = document.querySelector('input[type="range"]') as HTMLInputElement

        const songName: HTMLSpanElement = document.querySelector('.song-name') as HTMLSpanElement
        const singer: HTMLSpanElement = document.querySelector('.singer') as HTMLSpanElement

        const currentTime: HTMLSpanElement = document.querySelector('.current-time') as HTMLSpanElement
        const songTime: HTMLSpanElement = document.querySelector('.song-time') as HTMLSpanElement

        let songCount: number = 0
        const currentSong: Song["data"] = songs[songCount].data

        audio.src = 'http://163.18.42.232:8000/play?filename=' + currentSong.path
        songName.textContent = currentSong.song_name
        singer.textContent = currentSong.singer

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

        // 'change' Event will be emit when user change the input[type="range"]
        const changeSongTime = function () {
          audio.currentTime = parseInt(songRange.value)
        }
        songRange.addEventListener('change', changeSongTime)

        const changeRange = function () {
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
        }
        audio.addEventListener('timeupdate', changeRange)

        let isPlaying = false
        const playSong = function () {
          if (!isPlaying) {
            playBtn.classList.remove('fa-play')
            playBtn.classList.add('fa-pause')

            audio.play()
            isPlaying = true
            return
          }

          playBtn.classList.remove('fa-pause')
          playBtn.classList.add('fa-play')

          audio.pause()
          isPlaying = false
        }
        playBtn.addEventListener('click', playSong)

        const songEnd = function () {
          songCount += 1

          if (songCount > (songs.length - 1)) {
            songCount = 0
          }

          const song: Song["data"] = songs[songCount].data

          audio.src = 'http://163.18.42.232:8000/play?filename=' + song.path
          songName.textContent = song.song_name
          singer.textContent = song.singer

          audio.play()
        }
        audio.addEventListener('ended', songEnd)

        const playPreSong = function () {
          songCount -= 1

          if (songCount < 0) {
            songCount = songs.length - 1
          }

          const song: Song["data"] = songs[songCount].data

          audio.src = 'http://163.18.42.232:8000/play?filename=' + song.path
          songName.textContent = song.song_name
          singer.textContent = song.singer

          audio.play()
        }
        preBtn.addEventListener('click', playPreSong)

        const playNextSong = function () {
          songCount += 1

          if (songCount > (songs.length - 1)) {
            songCount = 0
          }

          const song: Song["data"] = songs[songCount].data

          audio.src = 'http://163.18.42.232:8000/play?filename=' + song.path
          songName.textContent = song.song_name
          singer.textContent = song.singer

          audio.play()
        }
        nextBtn.addEventListener('click', playNextSong)
      }
    }

    const songInfo: HTMLDivElement = buildSongInfo()
    const timeRange: HTMLDivElement = buildTimeRange()
    const songControls: HTMLDivElement = buildSongControls()

    const container: HTMLDivElement = document.querySelector('.container') as HTMLDivElement
    container.appendChild(songInfo)
    container.appendChild(timeRange)
    container.appendChild(songControls)

    buildAudio()
  } catch (err) {
    console.log(err)
    window.alert('伺服器錯誤2，請稍後再試！')
  }
}

buildMusicPlayer()
