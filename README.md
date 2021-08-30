# AI-Music-Player

This is a AI-driven music website, which is one of my school-project.

## Demo

[實際網站](http://hymn-music-player.herokuapp.com/)

- 主頁:

    <img src="./github/demo_images/home.jpg" width="800px">

- 設定條件:

    <img src="./github/demo_images/condition.jpg" width="800px">

- 詩歌播放器:

    <img src="./github/demo_images/music-player.jpg" width="800px">

- 播放清單:

    <img src="./github/demo_images/songs-list.jpg" width="800px">

- 上傳訓練樣本:

    <img src="./github/demo_images/upload-train.jpg" width="800px">

- AI模型自動分類:

    <img src="./github/demo_images/upload-music.jpg" width="800px">

- 更新正確的歌曲參數(AI自動重新訓練):

    <img src="./github/demo_images/change-music-data.jpg" width="800px">

## Technologies

- Architecture: MVC-like, RESTful-API

- Language: Node.js, TypeScript

- Frontend: Vanilla HTML/CSS/JavaScript, Bootstrap

- Backend: Express.js

- Database: MongoDB Atlas(host on cloud)

## Features

1. 上傳音檔，訓練AI模型

2. 上傳音檔，給AI自動判斷( 曲風、節拍、調性、關鍵字等 )

3. 提供音樂串流

4. 取得AI判斷後的結果，存入資料庫

5. 依據指定的條件( 歌曲數量、曲風、調性、節拍、關鍵字 )篩選出歌曲

6. 產生播放清單( 隨機播放順序 )

7. 整個網站都用原生 HTML/CSS/JavaScript + Bootstrap 純手刻

## Usage

1. setting environment variables in `.env` file:

    ```.env
    PORT=<port>
    MONGODB_URI=<your-mongodb-uri>
    ```

2. install all dependencies version-locked:

    ```bash
    $ npm ci
    ```

3. build the project (compile all `.ts` files into `.js` files):

    ```bash
    $ npm run build
    ```

4. install all dependencies version-locked which are only needed in runtime:

    ```bash
    $ npm ci --production
    ```

5. run the web server:

    ```bash
    $ npm run start
    ```

6. just check the website in your browser: `http://localhost:<port>`
