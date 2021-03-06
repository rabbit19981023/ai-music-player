import Loader from './components/loader.js'

type SongData = {
  song_name: string,
  type: string,
  genre: string,
  singer: string,
  bpm: string,
  tone: string,
  media_url: string,
  path: string,
  nlp_psg: object,
  status: string
}

const buildUpload = function (): void {
  // event handler when upload-btn clicked
  const upload: EventListener = async function (): Promise<void> {
    const form: HTMLFormElement = document.querySelector('form') as HTMLFormElement
    const formData: FormData = new FormData(form)

    try {
      const config = {
        method: 'POST',
        body: formData
      }

      // Active Loader Animation before Upload Music
      const loader: HTMLDivElement = document.querySelector('.loader-wrapper') as HTMLDivElement
      loader.classList.add('active')

      // Upload music to API server
      const response = await fetch('http://163.18.42.232:8000/add_music', config)
      const apiData: SongData = await response.json()

      switch (apiData.status) {
        case 'Done':
          // add song data into MongoDB
          const addSong = async function (song: SongData): Promise<void> {
            const config = {
              method: 'POST',
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
                  window.alert('這首歌已經被上傳過囉！')
                  break
                case 'Server Error':
                  window.alert('伺服器處理錯誤2，請重上傳一次！')
                  break
              }
            } catch (err) { window.alert('無法連線伺服器2，請重上傳一次！') }
          }

          await addSong(apiData)
          // Redirect after addSong return Promise Result
          window.location.href = '/add-music'
          break
        case 'Error':
          window.alert('上傳失敗：請確認表單是否填寫正確！')
          // Redirect
          window.location.href = '/add-music'
          break
      }
    } catch (err) {
      window.alert('無法連線伺服器1，請重上傳一次！')
      // Redirect
      window.location.href = '/add-music'
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

buildUpload()
buildLoader()
