# AI-Music-Player

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
