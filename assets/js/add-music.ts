const buildUpload = function () {
  const upload = async function () {
    const form: HTMLFormElement = document.querySelector('form') as HTMLFormElement
    const formData: FormData = new FormData(form)

    try {
      type ApiData = {
        status: string
      }

      const config = {
        method: 'POST',
        body: formData
      }

      // Upload music to server
      const response = await fetch('http://163.18.42.232:8000/add_music', config)
      const result: ApiData = await response.json()

      switch (result.status) {
        case 'Done':
          window.alert('上傳成功！')
          break

        case 'Error':
          window.alert('上傳失敗：請確認表單是否填寫錯誤！')
          break
      }

      // Redirect
      return window.location.href = '/add-music'
    } catch (err) { }
  }

  const uploadBtn: HTMLElement = document.querySelector('#upload') as HTMLElement
  uploadBtn.addEventListener('click', upload)
}

buildUpload()
