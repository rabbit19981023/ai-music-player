import createTypeSelect from './helpers/typeSelect.js'
import Loader from './components/loader.js'

const buildTypeSelect = function (): void {
  const typeSelect: HTMLElement = document.querySelector('#type') as HTMLElement
  createTypeSelect(typeSelect)
}

const buildUpload = function (): void {
  const upload = async function (): Promise<void> {
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

      // Active Loader Animation before Upload music
      const loader: HTMLElement = document.querySelector('.loader-wrapper') as HTMLElement
      loader.classList.add('active')

      // Upload music to API server
      const response = await fetch('http://163.18.42.232:8000/add_train_data', config)
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
      window.location.href = '/add-train-data'
    } catch (err) {
      window.alert('無法連線伺服器，請重上傳一次！')
      window.location.href = '/add-train-data'
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

buildTypeSelect()
buildUpload()
buildLoader()
