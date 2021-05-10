const buildUpload = function (): void {
  const upload = async function (): Promise<void> {
    const form: HTMLFormElement = document.querySelector('form') as HTMLFormElement
    const formData: FormData = new FormData(form)

    try {
      type ApiData = {
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

      // Upload music to API server
      const response = await fetch('http://163.18.42.232:8000/add_music', config)
      const apiData: ApiData = await response.json()

      switch (apiData.status) {
        case 'Done':
          // update song data into MongoDB
          const updateSong = async function (song: ApiData): Promise<void> {
            const config = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              },
              mode: 'same-origin',
              body: `song_data=${song}`
            }

            try {
              const response = await fetch('/v1/api/songs', config)
              const result = await response.json()

              switch (result.status) {
                case 'Done':
                  window.alert('上傳成功！')
                case 'Error':
                  window.alert('伺服器處理錯誤，請重上傳一次！')
              }
            } catch (err) {
              window.alert('無法連線伺服器，請重上傳一次！')
            }
          }

          updateSong(apiData)
          break

        case 'Error':
          window.alert('上傳失敗：請確認表單是否填寫錯誤！')
          break
      }

      // Redirect
      window.location.href = '/add-music'
    } catch (err) {
      window.alert('無法連線伺服器，請重上傳一次！')
      window.location.href = '/add-music'
    }
  }

  const uploadBtn: HTMLElement = document.querySelector('#upload') as HTMLElement
  uploadBtn.addEventListener('click', upload)
}

buildUpload()
