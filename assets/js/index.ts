import Generator from './components/generator.js'
import TypesWithImgs from './components/typesWithImgs.js'

const container: HTMLElement = document.querySelector('.container') || document.createElement('div')

const generator: HTMLElement = new Generator('generator').element
const typesWithImgs: HTMLElement = new TypesWithImgs('types-all').element

container.appendChild(generator)
container.appendChild(typesWithImgs)
