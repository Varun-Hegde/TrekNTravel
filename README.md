# TrekNTravel

### Demo - https://trek-n-travel.herokuapp.com/

**Note**: _The website may take a minute to load sometimes, as the server may be in hibernate state_

**A Fullstack web application where users can post and review various places and chat with other users in realtime**

# Features

- [x] Authenticate users via **_JWT_**
- [x] Google and Facebook login using **_OAuth 2.0_**
- [x] CRU\* users
- [x] CRUD Places
- [x] CRUD Reviews
- [x] GET and display paginated lists of places
- [x] Follow/Unfollow other users
- [x] Like/Dislike places
- [x] Personalized user feed
- [x] Group places by tags
- [x] An optimized search bar
- [x] Admin management
- [x] Reset Password
- [x] **_Realtime Notifications_**
- [x] **_Realtime chat with other users_**
- [x] Prevents Mongo Injection and Cross Site Scripting (XSS) attacks

# Frontend login

```
Use the following:

Email:    omen@gmail.com
Username: omen
Password: omen
```

# Built with

- **Backend**

  - **_NodeJS_** - Platform
  - **_Express_** - Framework
  - **_JavaScript_** - Programming Language
  - **_MongoDB_** - Database
  - **_Mongoose_** - ODM
  - **_Socket.io_** - For realtime chat and notifications
  - **_Passport.js_** - For handling all JWT and OAuth 2.0 related Authentication and Authorization
  - **_Cloudinary_** - Storing place images and user's profile pictures
  - **_Bcrypt_** - Hashing and comparing passwords
  - **_JOI_** - Data Validation
  - **_Multer_** - Image File uploads
  - **_Nodemailer_** - For sending email messages

- **Frontend**
  - **_React JS_** - Library
  - **_Redux_** - State Management
  - **_Javascript_** - Language
  - **_React-Bootstrap_** - For design and Layout
  - **_Material-ui_** - For design and Layout
  - **_Axios_** - For making API calls to backend
  - **_React Router_** - For routing in frontend
  - **_socket.io-client_** - For realtime support

# Installation/Getting Started

- Requirements:

  - MongoDB 4.4.1+
  - Node.js 12.19.0+

- Install:

  ```
  git clone https://github.com/Varun-Hegde/TrekNTravel.git
  ```

- Setup:

  - Navigate to the project folder and:

  - For backend:

    ```
        cd backend/
        npm i
    ```

    Create a .env file and add the following:

        ```
            NODE_ENV = development
            PORT = 5000
            MONGO_URI = YOUR MONGO URI TO CONNECT TO DATABASE
            JWTSecret = YOUR JWT SECRET

            CLOUDINARY_CLOUD_NAME = YOUR CLOUDINARY NAME FOR STORING IMAGES ON CLOUD
            CLOUDINARY_KEY = YOUR CLOUDINARY KEY
            CLOUDINARY_SECRET = YOUR CLOUDINARY SECRET

            MAPBOX_TOKEN = YOUR MAPBOX TOKEN FOR DISPLAYING MAP INFO

            SEND_GRID_API = YOUR SENDGRID API TOKEN FOR SENDING MAILS

            GOOGLE_CLIENT_ID = YOUR GOOGLE CLIENT ID FOR OAuth
            GOOGLE_CLIENT_SECRET = YOUR GOOGLE CLIENT SECRET

            FACEBOOK_CLIENT_ID = YOUR FACEBOOK CLIENT ID FOR OAuth
            FACEBOOK_CLIENT_SECRET =  YOUR FACEBOOK CLIENT SECRET
        ```

  - For frontend:

    ```
    cd frontend/
    npm i
    ```

    Create a .env file and add the following:

    ```
        REACT_APP_FACEBOOK_APP_ID =  YOUR FACEBOOK APP ID FOR OAuth
        REACT_APP_GOOGLE_CLIENT_ID =  YOUR GOOGLE CLIENT ID FOR OAuth
        REACT_APP_MAPBOX_ID = YOUR MAPBOX TOKEN FOR DISPLAYING MAP INFO
    ```

- To start server:

  ```
  cd backend/
  npm start
  ```

  The app will be available on http://localhost:5000

  ```
  cd frontend/
  npm start
  ```

  The app will be available on http://localhost:3000
