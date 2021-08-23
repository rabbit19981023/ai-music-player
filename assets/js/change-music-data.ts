import Loader from './components/loader.js'
import createTypeSelect from './helpers/typeSelect.js'

type SongDoc = {
  _id: string
  data: {
    song_name: string,
    type: string,
    genre: string,
    singer: string,
    bpm: string,
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

const buildSongList = async function (): Promise<void> {
  let response: Response, songs: SongDoc[]

  try {
    response = await fetch('/v1/api/songs?order=true')
    songs = await response.json()

    const dataList: HTMLDataListElement = document.querySelector('#songs') as HTMLDataListElement
    for (let i in songs) {
      const song: SongDoc["data"] = songs[i].data

      dataList.innerHTML += (`
        <option value="${song.song_name}">
      `)
    }
  } catch (err) { }

  const updateData = async function (): Promise<void> {
    try {
      const songList: string[] = []
      for (let i in songs) {
        songList.push(songs[i].data.song_name)
      }

      const songName: HTMLInputElement = document.querySelector('#song-name') as HTMLInputElement
      const songType: HTMLSelectElement = document.querySelector('#song-type') as HTMLSelectElement
      const songTone: HTMLSelectElement = document.querySelector('#song-tone') as HTMLSelectElement
      const songBpm: HTMLInputElement = document.querySelector('#song-bpm') as HTMLInputElement

      const updateData: EventListener = function () {
        try {
          const index = songList.indexOf(songName.value)
          const song: SongDoc["data"] = songs[index].data

          songType.value = song.type
          songTone.value = song.tone
          songBpm.value = song.bpm
        } catch (err) { }
      }
      songName.addEventListener('input', updateData)
    } catch (err) { }
  }

  updateData()
}

const buildTypeSelect = function (): void {
  const typeSelect: HTMLSelectElement = document.querySelector('#song-type') as HTMLSelectElement
  createTypeSelect(typeSelect)
}

const buildToneSelect = function (): void {
  const toneSelect: HTMLSelectElement = document.querySelector('#song-tone') as HTMLSelectElement
  
  const tones: string[] = [
    'C,major',
    'C#,major',
    'D,major',
    'D#,major',
    'E,major',
    'F,major',
    'F#,major',
    'G,major',
    'G#,major',
    'A,major',
    'A#,major',
    'B,major',
    'C,minor',
    'C#,minor',
    'D,minor',
    'D#,minor',
    'E,minor',
    'F,minor',
    'F#,minor',
    'G,minor',
    'G#,minor',
    'A,minor',
    'A#,minor',
    'B,minor',
  ]

  for (let i in tones) {
    const tone: string = tones[i]

    toneSelect.innerHTML += (`
      <option value="${tone}">${tone}</option>
    `)
  }
}

const buildUpload = function (): void {
  const upload: EventListener = async function (): Promise<void> {
    const form: HTMLFormElement = document.querySelector('form') as HTMLFormElement
    const formData: FormData = new FormData(form)

    try {
      const config = {
        method: 'POST',
        body: formData
      }

      // Active Loader Animation before sending HttpRequest
      const loader: HTMLDivElement = document.querySelector('.loader-wrapper') as HTMLDivElement
      loader.classList.add('active')

      const response = await fetch('', config) ////////////////////// 等佑昇給API網址
      const apiData: SongDoc["data"] = await response.json()

      switch (apiData.status) {
        case 'Done':
          // update song data into MongoDB
          const updateSong = async function (song: SongDoc["data"]): Promise<void> {
            const config = {
              method: 'PATCH', // update specific song's data_field (data_field: type)
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              },
              mode: 'same-origin' as RequestMode,
              body: `song_data=${ JSON.stringify(song) }`
            }

            try {
              const response = await fetch('/v1/api/songs', config)
              const result = await response.json()

              switch (result.status) {
                case 'Done':
                  window.alert('上傳成功！')
                  break
                case 'Error':
                  window.alert(`上傳失敗：在資料庫裡找不到 ${song.song_name} 這首歌！`)
                  break
                case 'Server Error':
                  window.alert('伺服器處理錯誤2，請重上傳一次！')
                  break
              }
            } catch (err) { window.alert('無法連線伺服器2，請重上傳一次！') }
          }

          await updateSong(apiData)
          // Redirect
          window.location.href = '/change-music-data'
          break
        case 'Error':
          window.alert('上傳失敗：請確認表單是否填寫正確！')
          // Redirect
          window.location.href = '/change-music-data'
          break
      }
    } catch (err) {
      window.alert('無法連線伺服器1，請重上傳一次！')
      // Redirect
      window.location.href = '/change-music-data'
    }
  }

  const uploadBtn: HTMLButtonElement = document.querySelector('#upload') as HTMLButtonElement
  uploadBtn.addEventListener('click', upload)
}

const buildLoader = function (): void {
  const loader: HTMLDivElement = new Loader('loader-wrapper').element

  const container: HTMLDivElement = document.querySelector('.container') as HTMLDivElement
  container.appendChild(loader)
}

buildSongList()
buildTypeSelect()
buildToneSelect()
buildUpload()
buildLoader()
