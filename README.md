# 👨‍👩‍👦‍👦 ez-ask 👨‍👩‍👦‍👦
---

고민거리나 궁금증을 해결하기 위한 익명 질문 플랫폼

## 📖 Description
---

평소 주변 친구들에게 말하기 어려운 고민거리나 궁금증을 질문하고 답해보세요.

서로 누구인지 모르기 때문에 다양한 분야의 주제를 털어놓고 얘기할 수 있습니다.

## 🐤 Demo
---

(추가 예정)

## ⭐주요 기능
---

### 회원 가입 및 로그인

- OAuth(Google OAuth 2.0) 활용한 소셜 로그인
- 토큰 기반 인증 방식(JWT 사용)

### 질문하기

### 답변하기

### 좋아요 및 북마크

## 🔧 Stack
---

* Language: TypeScript
* Library & Framework: NestJS
* Database: MySQL
* ORM: TypeORM
* Deploy: AWS(EC2, RDS, ELB, Route53)

## 📂 Project Structure
---

```
src
├── questions
│   └── application
│       └── questins.service.ts
│   └── domain
│       └── repository
│       └── content.ts
│       └── title.ts
│       └── questin.ts
│   └── infrastructure
│       └── entity(data model)
│       └── mapper
│       └── typeorm-questions.repository.ts
│       └── test-questions.repository.ts
│   └── presentation
│       ├── dto
│       └── questions.controller.ts
├── auth
├── bookmarks
├── comments
├── likes
├── users
   ...
```

## 🔨 Server Architecture
---

![img](https://velog.velcdn.com/images/calm0_0/post/0dddd40d-6d34-49ab-80c1-aebe110f337e/image.PNG)


## ETC

* DDD, 계층형 아키텍처 
* 단위 테스트 및 e2e 테스트 작성
* 커밋 컨벤션
* Git branch 전략
