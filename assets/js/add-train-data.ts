import createTypeSelect from './helpers/typeSelect.js'
import Loader from './components/loader.js'

const buildTypeSelect = function (): void {
  const typeSelect: HTMLSelectElement = document.querySelector('#type') as HTMLSelectElement
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
      const loader: HTMLDivElement = document.querySelector('.loader-wrapper') as HTMLDivElement
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

  const uploadBtn: HTMLButtonElement = document.querySelector('#upload') as HTMLButtonElement
  uploadBtn.addEventListener('click', upload)
}

const buildLoader = function (): void {
  const loader: HTMLDivElement = new Loader('loader-wrapper').element

  const container: HTMLDivElement = document.querySelector('.container') as HTMLDivElement
  container.appendChild(loader)
}

buildTypeSelect()
buildUpload()
buildLoader()
