export default class {
  public element: HTMLElement

  constructor (selector: string) {
    this.element = document.createElement('div')
    this.element.classList.add(selector)

    this.build()
  }

  private build () {
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

    const advanceBtn = advanceBtnDiv.querySelector('.advance-btn')
    const displayForm = function () {
      advanceForm.classList.add('toggle')
    }
    advanceBtn.onclick = displayForm

    const advanceForm = document.createElement('div')
    advanceForm.classList.add('advance-form')
    advanceForm.innerHTML = (`
      <div>
        <label for="song-numbers">歌曲數量：</label>
        <input type="number" id="song-numbers" name="song_numbers" class="form-control" value="4" min="2" max="20">
      </div>

      <div>
        <label for="type">類別：</label>
        <select id="type" name="type" class="form-select"></select>
      </div>

      <div>
        <label for="keywords">關鍵字：</label>
        <input type="text" id="keywords">
      </div>

      <div>
        <span>速度：</span>
        <input type="number" name="min_speed" value="80" min="40" max="160">
        <span> ~ </span>
        <input type="number" name="max_speed" value="100" min="60" max="200">
      </div>

      <div>
        <label for="tone">調性：</label>
        <select id="tone" name="tone" class="form-select"></select>
      </div>
    `)
    this.element.appendChild(advanceForm)
  }
}