export default async function (selectNode: HTMLElement) {
  try {
    interface ApiData {
      [i: string]: string
    }

    const response = await fetch('/v1/api/types/all')
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
