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
        <span class="song-time"></span>
      `)

      return timeRange
    }

    const buildSongControls = function (): HTMLDivElement {
      const songControls: HTMLDivElement = document.createElement('div')
      songControls.classList.add('song-controls')

      songControls.innerHTML = (`
        <i class="fas fa-backward pre"></i>
        <i class="fas fa-pause play"></i>
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

        const firstSong: Song["data"] = songs[0].data
        const currentSong: Song["data"] = firstSong

        const buildSongMeta = function () {
          songRange.max = String(audio.duration)

          let minutes: number | string = Math.floor(audio.duration / 60)
          if (minutes < 10) {
            minutes = '0' + minutes
          }

          let seconds: number | string = Math.floor(audio.duration % 60)
          if (seconds < 10) {
            seconds = '0' + seconds
          }
          songTime.textContent = minutes + ' : ' + seconds
        }

        audio.src = 'http://163.18.42.232:8000/play?filename=' + currentSong.path
        audio.addEventListener('loadedmetadata', buildSongMeta)

        songName.textContent = currentSong.song_name
        singer.textContent = currentSong.singer
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
