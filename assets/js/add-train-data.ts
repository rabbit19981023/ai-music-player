import createTypeSelect from './components/helpers/typeSelect.js'

const typeSelect: HTMLElement = document.querySelector('#type') as HTMLElement
createTypeSelect(typeSelect)

const createUploadEvent = function () {
  const form: HTMLFormElement = document.querySelector('form') as HTMLFormElement
  const formData: FormData = new FormData(form)

  const uploadBtn: HTMLElement = document.querySelector('#upload') as HTMLElement

  const upload = async function () {
    try {
      const config = {
        method: 'POST',
        body: formData
      }

      const response = await fetch('http://163.18.42.232:8000/add_train_data', config)
      const result = await response.json()

      switch (result.Status) {
        case 'Done':
          window.alert('上傳成功！')

        case 'Error':
          window.alert('上傳失敗：請確認表單是否填寫錯誤！')
      }
    } catch (err) { }
  }

  uploadBtn.addEventListener('click', upload)
}

createUploadEvent()
