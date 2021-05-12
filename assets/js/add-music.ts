import Loader from './components/loader.js'

const buildUpload = function (): void {
  // event handler when upload-btn clicked
  const upload = async function (): Promise<void> {
    const form: HTMLFormElement = document.querySelector('form') as HTMLFormElement
    const formData: FormData = new FormData(form)

    try {
      type Song = {
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

      const config = {
        method: 'POST',
        body: formData
      }

      // Active Loader Animation before Upload music
      const loader: HTMLElement = document.querySelector('.loader-wrapper') as HTMLElement
      loader.classList.add('active')

      // Upload music to API server
      const response = await fetch('http://163.18.42.232:8000/add_music', config)
      const apiData: Song = await response.json()

      switch (apiData.status) {
        case 'Done':
          // add song data into MongoDB
          const addSong = async function (song: Song): Promise<void> {
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
          window.alert('上傳失敗：請確認表單是否填寫錯誤！')

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

  const uploadBtn: HTMLElement = document.querySelector('#upload') as HTMLElement
  uploadBtn.addEventListener('click', upload)
}

const buildLoader = function (): void {
  const loader: HTMLElement = new Loader('loader-wrapper').element

  const container: HTMLElement = document.querySelector('.container') as HTMLElement
  container.appendChild(loader)
}

buildUpload()
buildLoader()
