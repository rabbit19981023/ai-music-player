import Loader from './components/loader.js'
import createTypeSelect from './helpers/typeSelect.js'

type Song = {
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
  try {
    const response = await fetch('/v1/api/songs')
    const songs: Song[] = await response.json()

    const songList: HTMLDataListElement = document.querySelector('#songs') as HTMLDataListElement
    for (let i in songs) {
      const song: Song["data"] = songs[i].data

      songList.innerHTML += (`
        <option value="${song.song_name}">
      `)
    }
  } catch (err) { }
}

const buildTypeSelect = function (): void {
  const typeSelect: HTMLSelectElement = document.querySelector('#song-type') as HTMLSelectElement
  createTypeSelect(typeSelect)
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

      const response = await fetch('', config)
      const apiData: Song["data"] = await response.json()

      switch (apiData.status) {
        case 'Done':
          // update song data into MongoDB
          const updateSong = async function (song: Song["data"]): Promise<void> {
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
          window.location.href = '/change-music-type'
          break
        case 'Error':
          window.alert('上傳失敗：請確認表單是否填寫正確！')
          // Redirect
          window.location.href = '/change-music-type'
          break
      }
    } catch (err) {
      window.alert('無法連線伺服器1，請重上傳一次！')
      // Redirect
      window.location.href = '/change-music-type'
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
buildUpload()
buildLoader()
