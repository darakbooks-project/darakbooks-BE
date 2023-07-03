
# 다락책방(DarakBooks) Backend API



[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


  <p align="center">The backend API Github Repository for <a href="https://frontend-book-platform.vercel.app/">DarakBooks(다락책방). </a> DarakBooks is an application that allows you to record books and find book clubs. 


  <br/>

DarakBook Website - [https://frontend-book-platform.vercel.app/](https://frontend-book-platform.vercel.app/)

## 📖 Swagger Documentation
 <a href="https://mafiawithbooks.site/docs"> 다락책방 Swagger API (한국어)</a><br/>
  <a href="https://mafiawithbooks.site/docs">DarakBooks Swagger API documentation (English)</a>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
</p>


## Description

This is the github repository for [Nest](https://github.com/nestjs/nest) framework TypeScript API for DarakBooks.


## ⚒️ Backend Development Stack
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![](https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)
## 🖊 Main Services
1. ✅ Account Login
> - Login (Kakao), Logout, Jwt Token Authorization 

2. ✅ BookGroups 
> - CRUD (Create,Read,Update,Delete) Operations on groups</br>
> - Add, Remove, View, Delete users in group
> - View all Groups, View Groups user is part of, View specific group
> - View top n groups with most members
> - Pagination groups


3. ✅ GPT Recommendations
> - Get GPT Book Recommendations 

4. ✅ My Bookshelf
> - CRUD Operations on books in my Bookshelf
> - Bookshelf Recommendations
> - Get Bookshelf of Specific User

5. ✅ My Page
> - View my profile, view other user's profile
> - User photo

6. ✅ Record
> - CRUD Operations on Book Records

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 📌 Team

- Backend Developers 
  > [Seonghee Lee(이승희)](https://github.com/shljessie)<br/>
  > [Jiyoung Park (박지영)](https://github.com/jyjyjy17)
- DarakBook Website - [https://frontend-book-platform.vercel.app/](https://frontend-book-platform.vercel.app/)

