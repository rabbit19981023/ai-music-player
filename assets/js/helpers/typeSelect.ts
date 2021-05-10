export default async function (selectNode: HTMLElement): Promise<void> {
  try {
    type ApiData = {
      [i: string]: string
    }

    const response = await fetch('http://163.18.42.232:8000/get_types') // nodejs server: '/v1/api/types/all'
    const types: ApiData = await response.json()

    const typeSelect: HTMLElement = selectNode
    for (let i in types) {
      const type: string = types[i]

      typeSelect.innerHTML += (`
        <option value="${i}">${type}</option>
      `)
    }
  } catch (err) { }
}
