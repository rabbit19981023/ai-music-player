import Generator from './components/generator.js'
import TypesAll from './components/typesAll.js'

const container: HTMLElement = document.querySelector('.container') || document.createElement('div')

const generator = new Generator('generator').element
const typesAll = new TypesAll('types-all').element

container.appendChild(generator)
container.appendChild(typesAll)
