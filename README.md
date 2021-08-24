# AI-Music-Player

This is a music website, which is one of my school-project.

## Features

1. 上傳詩歌，由另一個專案(Python Django)負責訓練AI模型

2. 上傳詩歌，由另一個專案(Python Django)的AI模型負責自動分類(曲風、節拍、調性、關鍵字等)

3. 上傳詩歌，由另一個專案(Python Django)負責儲存音檔，並提供音樂串流

4. 取得AI模型判斷後的資料，存入此專案的資料庫

5. 依據指定條件(歌曲數量、曲風、調性、節拍、關鍵字等)，產生播放清單(隨機播放順序)、音樂播放器

## Demo

[實際網站](http://hymn-music-player.herokuapp.com/)

## Technologies

- Architecture: MVC-like, RESTful-API

- Language: Node.js, TypeScript

- Frontend: Vanilla HTML/CSS/JavaScript, Bootstrap

- Backend: Express.js

- Database: MongoDB Atlas(host on cloud)

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
