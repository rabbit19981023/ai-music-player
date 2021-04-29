const getAllTypes = async function () {
  try {
    const response = await fetch('/v1/api/types/all')
    const types = await response.json()

    const typeSelect = document.querySelector('#type') || { innerHTML: '' }
    for (let i in types) {
      const type: string = types[i]

      typeSelect.innerHTML += (`
        <option value="${i}">${type}</option>
      `)
    }
  } catch (err) { }
}

getAllTypes()
