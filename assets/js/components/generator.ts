import createTypeSelect from '../helpers/typeSelect.js'

export default class {
  public element: HTMLDivElement

  constructor (selector: string) {
    this.element = document.createElement('div')
    this.element.classList.add(selector)

    this.build()
  }

  private async build (): Promise<void> {
    const autoNumbers: HTMLDivElement = document.createElement('div')
    autoNumbers.classList.add('auto-numbers')
    autoNumbers.innerHTML = (`
      <form action="/music-player" method="GET" class="auto-form">
        <label for="auto-numbers" class="auto-label">歌曲數量：</label>
        <input type="number" name="song_numbers" id="auto-numbers" class="form-control auto-numbers" value="4" min="2" max="20">

        <button type="submit" class="btn btn-auto">自動產生</button>
      </form>
    `)
    this.element.appendChild(autoNumbers)

    const advanceBtnDiv: HTMLDivElement = document.createElement('div')
    advanceBtnDiv.innerHTML = (`
      <button type="button" class="btn btn-advance">進階產生</button>
    `)
    this.element.appendChild(advanceBtnDiv)

    const formWrapper: HTMLDivElement = document.createElement('div')
    formWrapper.innerHTML = (`
      <form action="/music-player" method="GET" class="advance-form">
        <span class="close-btn"></span>

        <div>
          <label for="song-numbers" class="advance-label">歌曲數量：</label>
          <input type="number" name="song_numbers" id="song-numbers" class="form-control" value="4" min="2" max="20">
        </div>

        <div>
          <label for="type" class="advance-label">類別：</label>
          <select name="type" id="type" class="form-select">
            <option value="">請選擇類別</option>
          </select>
        </div>

        <div>
          <label for="keywords" class="advance-label">關鍵字：</label>
          <input type="text" name="keywords" id="keywords" class="form-control" size="15" max="20">
        </div>

        <div class="speed-wrapper">
          <span class="advance-label">速度：</span>
          <input type="number" name="min_speed" class="form-control" value="80" min="40" max="160">
          <span> ~ </span>
          <input type="number" name="max_speed" class="form-control" value="100" min="60" max="200">
        </div>

        <div>
          <label for="tone" class="advance-label">調性：</label>
          <select name="tone" id="tone" class="form-select">
            <option value="">請選擇調性</option>
          </select>
        </div>

        <center>
          <button type="submit" class="btn btn-submit">產生歌單</button>
        </center>
      </form>
    `)
    this.element.appendChild(formWrapper)

    const advanceBtn: HTMLButtonElement = this.element.querySelector('.btn-advance') as HTMLButtonElement
    const advanceForm: HTMLFormElement = this.element.querySelector('.advance-form') as HTMLFormElement
    const displayForm = function (): void {
      advanceForm.classList.add('toggle')
    }
    advanceBtn.addEventListener('click', displayForm)

    const closeBtn: HTMLSpanElement = this.element.querySelector('.close-btn') as HTMLSpanElement
    const closeForm = function (): void {
      advanceForm.classList.remove('toggle')
    }
    closeBtn.addEventListener('click', closeForm)
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeForm()
      }
    })

    const typeSelect: HTMLSelectElement = this.element.querySelector('#type') as HTMLSelectElement
    createTypeSelect(typeSelect)

    try {
      type ApiData = {
        [i: string]: {
          info: string,
          image: string
        }
      }

      const response = await fetch('/v1/api/tones/all')
      const allTones: ApiData = await response.json()

      const toneSelector: HTMLSelectElement = this.element.querySelector('#tone') as HTMLSelectElement
      for (let i in allTones) {
        const tone: string = allTones[i].info

        toneSelector.innerHTML += (`
          <option value="${i}">${tone}</option>
        `)
      }
    } catch (err) { }
  }
}
