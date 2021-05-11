export default class {
  public element: HTMLElement

  constructor (selector: string) {
    this.element = document.createElement('div')
    this.element.classList.add(selector)

    this.build()
  }

  private build () {
    this.element.innerHTML += (`
      <div class="loader"></div>
    `)
  }
}
