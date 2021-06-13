const buildMusicPlayer = async function (): Promise<void> {
  type SongDoc = {
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

  // Get Hymns with Condition Filter
  const getSongs = async function (): Promise<SongDoc[]> {
    return new Promise(async (resolve, reject) => {
      const filter: string = window.location.search
      try {
        const response = await fetch('/v1/api/songs' + filter)
        const songs: SongDoc[] = await response.json()

        resolve(songs)
      } catch (err) { reject(err) }
    })
  }

  try {
    const songs: SongDoc[] = await getSongs()

    // Div.song-info
    const buildSongInfo = function (): HTMLDivElement {
      const songInfo: HTMLDivElement = document.createElement('div')
      songInfo.classList.add('song-info')

      songInfo.innerHTML = (`
        <center>
          <img class="song-img">
        </center>

        <span class="song-name">查無歌曲</span>
        <span class="singer">查無歌手</span>

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
        <i class="fas fa-backward pre"></i>
        <i class="fas fa-play play"></i>
        <i class="fas fa-forward next"></i>
      `)

      return songControls
    }

    const buildListToggle = function (): HTMLDivElement {
      const toggle: HTMLDivElement = document.createElement('div') as HTMLDivElement
      toggle.classList.add('song-list-toggle')

      toggle.innerHTML = (`
        <i class="fas fa-chevron-circle-left btn-toggle"></i>
      `)

      const toggleList: EventListener = function () {
        const toggleBtn: HTMLElement = document.querySelector('.btn-toggle') as HTMLElement
        const songList: HTMLDivElement = document.querySelector('.song-list') as HTMLDivElement

        toggleBtn.classList.toggle('fa-chevron-circle-right')
        songList.classList.toggle('song-list-active')
      }
      toggle.addEventListener('click', toggleList)

      return toggle
    }

    const buildSongList = function () {
      const songList: HTMLDivElement = document.createElement('div') as HTMLDivElement
      songList.classList.add('song-list')
      songList.innerHTML = (`
        <div class="toggle-fixed"></div>
      `)

      let songCount: number = 0
      for (let i in songs) {
        const song: SongDoc["data"] = songs[i].data

        songList.innerHTML += (`
          <div id="count-${songCount}" class="each-song">
            <div class="each-song-name">${song.song_name}</div>
            <div class="each-song-singer">${song.singer}</div>
            <i class="far fa-play-circle each-song-play"></i>
          </div>
        `)

        songCount += 1
      }

      return songList
    }

    /** Core Music-Player Features **/
    const buildAudio = function (): void {
      if (songs.length > 0) {
        // Audio Element Init
        const audio: HTMLAudioElement = new Audio()

        // Declare Variables
        // Music-player Vars
        const playBtn: HTMLElement = document.querySelector('.play') as HTMLElement
        const preBtn: HTMLElement = document.querySelector('.pre') as HTMLElement
        const nextBtn: HTMLElement = document.querySelector('.next') as HTMLElement

        const songRange: HTMLInputElement = document.querySelector('input[type="range"]') as HTMLInputElement

        const songName: HTMLSpanElement = document.querySelector('.song-name') as HTMLSpanElement
        const singer: HTMLSpanElement = document.querySelector('.singer') as HTMLSpanElement
        const songImg: HTMLImageElement = document.querySelector('.song-img') as HTMLImageElement

        const currentTime: HTMLSpanElement = document.querySelector('.current-time') as HTMLSpanElement
        const songTime: HTMLSpanElement = document.querySelector('.song-time') as HTMLSpanElement

        // Song-List Vars
        const songList: HTMLDivElement = document.querySelector('.song-list') as HTMLDivElement
        const songsInList: NodeListOf<HTMLDivElement> = songList.querySelectorAll('.each-song') as NodeListOf<HTMLDivElement>
        const songListPlayBtns: HTMLElement[] = Array.from(songsInList, song => song.querySelector('.each-song-play') as HTMLElement)

        // Music-Player Init
        let songCount: number = 0
        const currentSong: SongDoc["data"] = songs[songCount].data

        audio.src = 'http://163.18.42.232:8000/play?filename=' + currentSong.path
        songName.textContent = currentSong.song_name
        singer.textContent = currentSong.singer
        songImg.src = currentSong.youtube_thumbnail
        document.title = `${currentSong.song_name} | ${currentSong.singer} - AI音祢而在`

        // 'Audio.loaded-metadata' Event Listener
        const buildSongMeta: EventListener = function () {
          // set range.max to song-duration
          const songDuration: number = audio.duration
          songRange.max = String(songDuration)

          // get song-full-time from meta-data
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

        // 'Input[type="range"].input' Event Listener
        const changeSongTime: EventListener = function () {
          audio.currentTime = parseInt(songRange.value)
        }
        songRange.addEventListener('input', changeSongTime)

        // 'Audio.time-update' Event Listener
        const updateRangeAndTime: EventListener = function () {
          // set range.value to song-current-time
          const songCurrentTime: number = audio.currentTime
          songRange.value = String(songCurrentTime)

          // set played-width-color css property
          songRange.style.setProperty('--played-width', `${(parseInt(songRange.value) / parseInt(songRange.max)) * 100}%`)

          // set song-current-time
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
        audio.addEventListener('timeupdate', updateRangeAndTime)

        // PlaySong Function
        let isPlaying: boolean = false
        const playSong = function () {
          if (isPlaying) {
            /** Pause Song Playing **/
            // Music Player Interface
            playBtn.classList.remove('fa-pause')
            playBtn.classList.add('fa-play')

            // Songs List Interface
            Array.from(songListPlayBtns, playBtn => {
              playBtn.classList.remove('fa-pause-circle')
              playBtn.classList.add('fa-play-circle')
            })
            Array.from(songsInList, song => {
              song.style.backgroundColor = '#ead0d1'
            })

            // Pause Song
            audio.pause()
            isPlaying = false
            return
          }

          /** Song Playing **/
          // Music Player Interface
          playBtn.classList.remove('fa-play')
          playBtn.classList.add('fa-pause')

          // Songs List Interface
          // All btn-play in songList show 'paused'
          Array.from(songListPlayBtns, playBtn => {
            playBtn.classList.remove('fa-pause-circle')
            playBtn.classList.add('fa-play-circle')
          })
          // All div.each-song in songList set background-color to #ead0d1
          Array.from(songsInList, song => {
            song.style.backgroundColor = '#ead0d1'
          })
          const currentSongInList: HTMLDivElement = songList.querySelector(`#count-${songCount}`) as HTMLDivElement
          const currentPlayBtn: HTMLElement = currentSongInList.querySelector('.each-song-play') as HTMLElement
          currentPlayBtn.classList.remove('fa-play-circle')
          currentPlayBtn.classList.add('fa-pause-circle')
          currentSongInList.style.backgroundColor = '#65656580'

          // Play Song
          audio.play()
          isPlaying = true
        }
        playBtn.addEventListener('click', playSong)

        const playCurrentSong: EventListener = function (event) {
          const currentPlayBtn: HTMLElement = event.target as HTMLElement
          // Play Different Song
          if (currentPlayBtn.classList.contains('fa-play-circle')) {
            songCount = parseInt((currentPlayBtn.parentElement as HTMLDivElement).id.split('-')[1])

            const song: SongDoc["data"] = songs[songCount].data
            changeSong(song)

            isPlaying = false
            playSong()
            return
          }

          // Pause Same Song
          playSong()
        }
        Array.from(songListPlayBtns, playBtn => {
          playBtn.addEventListener('click', playCurrentSong)
        })

        // ChangeSong Function
        const changeSong = function (song: SongDoc["data"]) {
          audio.src = 'http://163.18.42.232:8000/play?filename=' + song.path
          songName.textContent = song.song_name
          singer.textContent = song.singer
          songImg.src = song.youtube_thumbnail
          document.title = `${song.song_name} | ${song.singer} - AI音祢而在`
        }

        // 'Audio.ended' Event Listener
        const songEnd: EventListener = function () {
          songCount += 1

          // back to first-song while out-of-index
          if (songCount > (songs.length - 1)) {
            songCount = 0
          }

          const song: SongDoc["data"] = songs[songCount].data
          changeSong(song)
          
          isPlaying = false
          playSong()
        }
        audio.addEventListener('ended', songEnd)

        // 'preBtn.click' Event Listener
        const playPreSong: EventListener = function () {
          songCount -= 1

          // jump to last-song while index=-1
          if (songCount < 0) {
            songCount = songs.length - 1
          }

          const song: SongDoc["data"] = songs[songCount].data
          changeSong(song)

          isPlaying = false
          playSong()
        }
        preBtn.addEventListener('click', playPreSong)

        // 'nextBtn.click' Event Listener
        const playNextSong: EventListener = function () {
          songCount += 1

          // back to first-song while out-of-index
          if (songCount > (songs.length - 1)) {
            songCount = 0
          }

          const song: SongDoc["data"] = songs[songCount].data
          changeSong(song)

          isPlaying = false
          playSong()
        }
        nextBtn.addEventListener('click', playNextSong)
      }
    }

    const songInfo: HTMLDivElement = buildSongInfo()
    const timeRange: HTMLDivElement = buildTimeRange()
    const songControls: HTMLDivElement = buildSongControls()
    const listToggle: HTMLDivElement = buildListToggle()
    const songList: HTMLDivElement = buildSongList()

    const musicPlayer: HTMLDivElement = document.createElement('div')
    musicPlayer.classList.add('music-player')
    musicPlayer.appendChild(songInfo)
    musicPlayer.appendChild(timeRange)
    musicPlayer.appendChild(songControls)
    musicPlayer.appendChild(listToggle)
    musicPlayer.appendChild(songList)

    const container: HTMLDivElement = document.querySelector('.container') as HTMLDivElement
    container.appendChild(musicPlayer)

    buildAudio()
  } catch (err) { window.alert('伺服器錯誤2，請稍後再試！'); console.log(err) }
}

buildMusicPlayer()
