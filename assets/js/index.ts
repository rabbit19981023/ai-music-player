import Generator from './components/generator.js'
import TypesWithImgs from './components/typesWithImgs.js'
import Tones from './components/tones.js'

const container: HTMLDivElement = document.querySelector('.container') || document.createElement('div')

const generator: HTMLDivElement = new Generator('generator').element
const typesWithImgs: HTMLDivElement = new TypesWithImgs('types-all').element
const tones: HTMLDivElement = new Tones('tones-all').element

container.appendChild(generator)
container.appendChild(typesWithImgs)
container.appendChild(tones)
