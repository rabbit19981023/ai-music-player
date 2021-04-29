export default class {
  public element: HTMLElement

  constructor (selector: string) {
    this.element = document.createElement('div')
    this.element.classList.add(selector)

    this.build()
  }

  private async build () {
    const autoNumbers = document.createElement('div')
    autoNumbers.classList.add('auto-numbers')
    autoNumbers.innerHTML = (`
      <form action="/auto-generate" method="POST" class="auto-form">
        <label for="auto-numbers">歌曲數量：</label>
        <input id="auto-numbers" type="number" name="auto_numbers" class="form-control" value="4" min="2" max="20">

        <button type="submit" class="btn btn-primary">自動產生</button>
      </form>
    `)
    this.element.appendChild(autoNumbers)

    const advanceBtnDiv = document.createElement('div')
    advanceBtnDiv.innerHTML = (`
      <button type="button" class="btn btn-primary advance-btn">進階產生</button>
    `)
    this.element.appendChild(advanceBtnDiv)

    const advanceBtn = this.element.querySelector('.advance-btn') || { addEventListener: function () {} }
    const displayForm = function () {
      advanceForm.classList.add('toggle')
    }
    advanceBtn.addEventListener('click', displayForm)

    const advanceForm = document.createElement('div')
    advanceForm.classList.add('advance-form')
    advanceForm.innerHTML = (`
      <div>
        <label for="song-numbers">歌曲數量：</label>
        <input type="number" id="song-numbers" name="song_numbers" class="form-control" value="4" min="2" max="20">
      </div>

      <div>
        <label for="type">類別：</label>
        <select id="type" name="type" class="form-select">
          <option value="">請選擇類別</option>
        </select>
      </div>

      <div>
        <label for="keywords">關鍵字：</label>
        <input type="text" id="keywords" name="keywords" size="10" max="20">
      </div>

      <div>
        <span>速度：</span>
        <input type="number" name="min_speed" value="80" min="40" max="160">
        <span> ~ </span>
        <input type="number" name="max_speed" value="100" min="60" max="200">
      </div>

      <div>
        <label for="tone">調性：</label>
        <select id="tone" name="tone" class="form-select">
          <option value="">請選擇調性</option>
        </select>
      </div>
    `)
    this.element.appendChild(advanceForm)

    try {
      const response = await fetch('/v1/api/types/all')
      const allTypes = await response.json()

      const typeSelect = this.element.querySelector('#type') || { innerHTML: '' }
      for (let i in allTypes) {
        const type: string = allTypes[i]

        typeSelect.innerHTML += (`
          <option value="${i}">${type}</option>
        `)
      }
    } catch (err) { }
  }
}