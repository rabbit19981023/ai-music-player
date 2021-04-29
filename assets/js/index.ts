import Generator from './components/generator.js'
import TypesWithImgs from './components/typesWithImgs.js'
import Tones from './components/tones.js'

const container: HTMLElement = document.querySelector('.container') || document.createElement('div')

const generator: HTMLElement = new Generator('generator').element
const typesWithImgs: HTMLElement = new TypesWithImgs('types-all').element
const tones: HTMLElement = new Tones('tones-all').element

container.appendChild(generator)
container.appendChild(typesWithImgs)
container.appendChild(tones)
