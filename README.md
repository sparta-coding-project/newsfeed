# newsfeed

## dotenv
```
DATABASE_URL=
TOKEN_SECRET_KEY=
PORT=

EMAIL_USER=
EMAIL_PASS=

NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=

KAKAO_CLIENT_ID=

STATIC_URL=""
```

## Getting Started

1. `npm i`
2. `node app.js`
3. [localhost:3000](localhost:3000) 접속

## API Structure

- View Renderer
    - `/signup`
    - `/login`
    - `/main`
    - `/view_the_post/:postId`
    - `/write_the_post`
    - `/profile/:userProfile`
- Local Login
    - `/api/signup`
    - `/api/emailValid`
    - `/api/signin`
    - `/api/signout`
- Social Login
    - `/auth/naver`
    - `/auth/kakao`