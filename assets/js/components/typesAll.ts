export default class {
  public element: HTMLElement

  constructor (selector: string) {
    this.element = document.createElement('div')
    this.element.classList.add(selector)

    this.build()
  }

  private async build () {
    const typesWrapper = document.createElement('div')
    typesWrapper.classList.add('.types-wrapper')

    try {
      const response = await fetch('/v1/api/types/all')
      const types: JSON = await response.json()

      for (let i in types) {
        const type: string = types[i]

        typesWrapper.innerHTML += (`
          <div class="card">
            <img class="card-img" src="https://picsum.photos/150?blur=2">
            <p class="card-info">${type}</p>
          </div>
        `)
      }

      this.element.innerHTML = (`
        <h2>詩歌類別</h2>
        <div class="types-wrapper">
          ${typesWrapper.innerHTML}
        </div>
      `)
    } catch (err) {
      this.element.innerHTML = (`
        <h2>詩歌類別</h2>
        <div class="error"></div>
      `)
    }
  }
}