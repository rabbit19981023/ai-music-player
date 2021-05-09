export default class {
  public element: HTMLElement

  constructor (selector: string) {
    this.element = document.createElement('div')
    this.element.classList.add(selector)

    this.build()
  }

  private async build () {
    const tonesWrapper: HTMLElement = document.createElement('div')

    try {
      type ApiData = {
        [i: string]: {
          info: string,
          image: string
        }
      }

      const response = await fetch('/v1/api/tones/all')
      const tones: ApiData = await response.json()

      for (let i in tones) {
        const data = tones[i]

        tonesWrapper.innerHTML += (`
          <a href="/v1/api/tones?query=${data.info}">
            <div class="card">
              <img class="card-img tone-img" src="${data.image}">
              <p class="card-info">${data.info}</p>
            </div>
          </a>
        `)
      }

      this.element.innerHTML = (`
        <h2>調號 - Key</h2>
        <div class="tones-wrapper">
          ${tonesWrapper.innerHTML}
        </div>
      `)
    } catch (err) {
      this.element.innerHTML = (`
        <h2>調號 - Key</h2>
        <div class="error"></div>
      `)
    }
  }
}
