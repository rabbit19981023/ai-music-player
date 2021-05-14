const container: HTMLElement = document.querySelector('.container') as HTMLElement

type Song = {
  _id: string
  data: {
    song_name: string,
    type: string,
    genre: string,
    singer: string,
    bpm: number,
    tone: string,
    media_url: string,
    path: string,
    nlp_psg: [list: string[]],
    keywords: string[],
    status: string
  },
  status: string,
  _v: string
}

const getSongs = async function () {
  try {
    const response = await fetch('/v1/api/songs' + window.location.search)
    const songs: Song[] = await response.json()

    songs.forEach(song => {
      const div: HTMLElement = document.createElement('div')
      div.innerHTML = (`
        <audio src="http://163.18.42.232:8000/play?filename=${song.data.path}" controls></audio>
      `)
      
      container.appendChild(div)
    })
  } catch (err) { }
}

getSongs()
