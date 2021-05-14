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

  const getSongs = async function (): Promise<Song[] | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('/v1/api/songs' + window.location.search)
        const songs: Song[] = await response.json()

        resolve(songs)
      } catch (err) { reject(null) }
    })
  }
  try {
    const container: HTMLElement = document.querySelector('.container') as HTMLElement
    const songs: Song[] | null = await getSongs()

    const buildSongInfo = function (): HTMLElement {
      const songInfo: HTMLElement = document.createElement('div')
      songInfo.classList.add('song-info')

      let firstSong: Song["data"] | { song_name: '查無歌曲', singer: '查無歌手' }

      if (songs === null) {
        firstSong = {
          song_name: '查無歌曲',
          singer: '查無歌手'
        }
      } else {
        firstSong = songs[0].data
      }

      songInfo.innerHTML = (`
        <span class="song-name">${firstSong.song_name}</span>
        <span class="split"> - </span>
        <span class="singer">${firstSong.singer}</span>
      `)

      return songInfo
    }

    const buildTimeRange = function (): HTMLElement {
      const timeRange: HTMLElement = document.createElement('div')
      timeRange.classList.add('time-range')

      timeRange.innerHTML = (`
        <span class="current-time">00:00</span>
        <input type="range">
        <span class="song-time">00:00</span>
      `)

      return timeRange
    }

    const buildSongControls = function (): HTMLElement {
      const songControls: HTMLElement = document.createElement('div')
      songControls.classList.add('song-controls')

      songControls.innerHTML = (`
        <i class="fas fa-backward"></i>
        <i class="fas fa-pause"></i>
        <i class="fas fa-forward"></i>
      `)

      return songControls
    }

    const songInfo: HTMLElement = buildSongInfo()
    const timeRange: HTMLElement = buildTimeRange()
    const songControls: HTMLElement = buildSongControls()

    container.appendChild(songInfo)
    container.appendChild(timeRange)
    container.appendChild(songControls)
  } catch (err) {
    window.alert('伺服器錯誤2，請稍後再試！')
  }
}

buildMusicPlayer()
