export default class {
  public element: HTMLElement

  constructor (selector: string) {
    this.element = document.createElement('div')
    this.element.classList.add(selector)

    this.build()
  }

  private async build (): Promise<void> {
    const typesWrapper: HTMLElement = document.createElement('div')

    try {
      type ApiData = {
        [i: string]: {
          info: string,
          image: string
        }
      }

      const response = await fetch('http://163.18.42.232:8000/types_img') // nodejs server: '/v1/api/types-with-imgs/all'
      const typesWithImgs: ApiData = await response.json()

      for (let i in typesWithImgs) {
        const data = typesWithImgs[i]

        typesWrapper.innerHTML += (`
          <a href="/v1/api/types?query=${data.info}">
            <div class="card">
              <img class="card-img" src="${data.image}">
              <p class="card-info">${data.info}</p>
            </div>
          </a>
        `)
      }

      this.element.innerHTML = (`
        <h2>詩歌類別 - Hymn Genre</h2>
        <div class="types-wrapper">
          ${typesWrapper.innerHTML}
        </div>
      `)
    } catch (err) {
      this.element.innerHTML = (`
        <h2>詩歌類別 - Hymn Genre</h2>
        <div class="error"></div>
      `)
    }
  }
}
