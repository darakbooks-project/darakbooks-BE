
# 다락책방(DarakBooks) Backend API



[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


  <p align="center">The backend API Github Repository for <a href="https://frontend-book-platform.vercel.app/">DarakBooks(다락책방). </a> 
DarakBooks is an application that allows you to record books and find book clubs.<br>
DarabkBooks is an online platform designed for book lovers. Our service allows users to search for books, manage their reading records, and receive personalized book recommendations.<br>
We leverage the power of ChatGPT to provide tailored book recommendations based on users' requests. Additionally, we facilitate both online and offline book clubs and reading communities.

  <br/>

DarakBook Website - [https://frontend-book-platform.vercel.app/](https://frontend-book-platform.vercel.app/)<br>
DarakBook Notion - [notion](https://necessary-base-8db.notion.site/Team-Project-Template-b0350ed686c84ee58931b4715efc7a6f?pvs=4) <br>

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

### To make the most of our platform, follow these steps:
1. Sign up for an Darak Books account on our website.
2. Explore the book search feature to find books of interest. Use filters and search parameters to refine your search results.
3. Manage your reading records by adding books to your reading list, recording progress, and making personal notes.
4. Benefit from our personalized bookshelf recommendations, which appear based on your reading history and preferences.
5. Engage with ChatGPT to receive real-time book recommendations and have interactive conversations about books.
6. Join online book clubs, participate in discussions, and connect with fellow book lovers. Attend offline book club meetups and events in your area.

### Feature
1. Book Search: Users can easily search for books using kakao search api. They can explore various genres, authors, and book details to find their next reading adventure.
2. Reading Record Management: Our platform enables users to track their reading progress, record personal notes, and manage their reading lists. Users can conveniently add, remove, and delve into their reading records, creating a personalized reading history.
3. Personalized Bookshelf Recommendations: By analyzing users' reading preferences and book records, our recommendation system generates tailored bookshelf recommendations. Users receive suggestions for books that align with their interests and reading habits, helping them discover new titles and expand their literary horizons.
4. ChatGPT-powered Book Recommendations: Users can engage in interactive conversations with ChatGPT, our AI-powered chatbot. ChatGPT understands users' book preferences and provides real-time book recommendations based on their queries. Users can have dynamic and engaging conversations about books and receive instant suggestions.
5. Online and Offline Book Clubs: DarakBooks fosters a vibrant community of book enthusiasts. Users can join online book clubs, participate in discussions, and connect with like-minded readers. We also facilitate offline book club meetups and events, bringing book lovers together to share their passion for literature.

## ⚒️ Backend Development Stack
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![](https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)
![Python](https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white)


## Used API
- [Korean National Library Librarian Recommendation API  (국립중앙도서관 사서추천 API)](https://www.nl.go.kr/NL/contents/N31101030900.do) 
- [OpenAI Chat GPT API](https://platform.openai.com/docs/introduction)
- [LangChainJS](https://js.langchain.com/docs/)
- [KakaoLogin](https://developers.kakao.com/docs/latest/ko/kakaologin/common)

## Related References 

- To generate recommendations(books) based on given documents/datasets we used the [DocQA available on LangchainJS](https://js.langchain.com/docs/modules/chains/index_related_chains/document_qa) 

- For further finetuning your model with specific data, you can also refer to [ChatGPT OpenAI's Finetuning feature](https://platform.openai.com/docs/guides/fine-tuning)

- To generate recommendation(bookshelf) based on given documents or datasets, we utilized popular Python libraries, including scikit-learn and NumPy.
  
## 🖊 Main Services
1. ✅ Account Login
> - JWT, OAuth 2.0-based Kakao Account Login
> - Login, Logout, Reissue
> - Use Redis, Cookie memory

2. ✅ BookGroups 
> - CRUD (Create,Read,Update,Delete) Operations on groups</br>
> - Add, Remove, View, Delete users in group
> - View all Groups, View Groups user is part of, View specific group
> - View top n groups with most members
> - Pagination groups

3. ✅ GPT Recommendations
> - Get GPT Book Recommendations 

4. ✅ My Bookshelf
> - Add/Delete a book in my Bookshelf
> - Bookshelf Recommendations using Python's NumPy and cosine_similarity from scikit-learn
> - Get Bookshelf of Specific User

5. ✅ My Page
> - View my profile, view other user's profile
> - User photo(S3)

6. ✅ Record
> - CRUD Operations on Book Records
> - Add, Remove, View, Delete record for a book
> - View all Records, View Records for a Book, View Records for a Specific User, View specific record
> - Infinite Scroll of Records
> - Record Photo(s3)

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
  > [Jiyoung Park (박지영:Lead Developer)](https://github.com/jyjyjy17): Login, Book Records API, Bookshelves API  
  > [Seonghee Lee(이승희)](https://github.com/shljessie) : BookClub API, GPT API <br/>
- DarakBook Website - [https://frontend-book-platform.vercel.app/](https://frontend-book-platform.vercel.app/)

