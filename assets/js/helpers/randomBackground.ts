const randomBackground = function (): void {
  const getRandomImg = function (): string {
    const images: string[] = [
      'https://cdn.pixabay.com/photo/2017/12/17/21/44/coffee-3025022_960_720.jpg',
      'https://cdn.pixabay.com/photo/2015/11/19/21/14/glasses-1052023_960_720.jpg',
      'https://cdn.pixabay.com/photo/2015/11/19/21/11/book-1052014_960_720.jpg',
      'https://cdn.pixabay.com/photo/2015/11/19/21/10/glasses-1052010_960_720.jpg',
      'https://cdn.pixabay.com/photo/2014/08/16/18/17/book-419589_960_720.jpg',
      'https://cdn.pixabay.com/photo/2016/01/19/14/50/desk-1148994_960_720.jpg',
      'https://cdn.pixabay.com/photo/2016/06/01/06/26/open-book-1428428_960_720.jpg',
      'https://cdn.pixabay.com/photo/2015/12/04/09/13/leaves-1076307_960_720.jpg',
      'https://cdn.pixabay.com/photo/2017/08/06/22/01/books-2596809_960_720.jpg',
      'https://cdn.pixabay.com/photo/2014/09/05/18/32/old-books-436498_960_720.jpg',
      'https://cdn.pixabay.com/photo/2016/09/10/17/18/book-1659717_960_720.jpg',
      'https://cdn.pixabay.com/photo/2018/10/04/14/22/donut-3723751_960_720.jpg',
      'https://cdn.pixabay.com/photo/2018/01/04/19/43/paper-3061485_960_720.jpg',
      'https://cdn.pixabay.com/photo/2016/02/19/11/53/book-1210027_960_720.jpg',
      'https://cdn.pixabay.com/photo/2015/03/26/09/43/living-room-690174_960_720.jpg',
      'https://cdn.pixabay.com/photo/2017/03/02/05/14/bible-2110439_960_720.jpg',
      'https://cdn.pixabay.com/photo/2018/03/19/18/20/tea-time-3240766_960_720.jpg',
      'https://cdn.pixabay.com/photo/2015/10/12/15/09/person-984236_960_720.jpg'
    ]

    const randomIndex: number = Math.floor(Math.random() * images.length)
    return images[randomIndex]
  }

  const bg: HTMLDivElement = document.querySelector('.bg-img') as HTMLDivElement
  const randomImg: string = getRandomImg()
  bg.style.backgroundImage = `url("${randomImg}")`
}

randomBackground()
