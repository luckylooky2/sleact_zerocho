## 1. npm init

- package.json 생성 명령어
- name : npm에 이미 있는 패키지(특히, 프로젝트에서 설치한 패키지) 이름과 겹치면 설치할 떄 오류가 발생할 수 있음
- entry point : 진입점 파일
- keyword : npm에 검색할 때, 검색 잘 되도록 하는 키워드

## 2. 패키지 설치

- **npm i react react-dom**
- **npm i -D typescript @types/react @types/react-dom @types/webpack @types/node @types/webpack-dev-server**
  - typescript 모듈
  - 기본적으로 type 추론을 하기 때문에, 굳이 type을 쓰지 않아도 되는 곳에는 쓰지 않아도 됨!
  - e.g. const Login : FC = () => {}
- **npm i -D eslint**
  - 코드 검사 도구 : unused variable, typo 등을 잡아주는 역할
  - .eslintrc 파일 생성
- **npm i -D prettier eslint-plugin-prettier eslint-config-prettier**
  - 코드 자동 정렬 도구, prettier와 eslint를 연결해주는 모듈(prettier에 어긋나는 경우 알림)
  - 협업할 때, 하나의 기준이 될 수 있기 때문에 많이 사용
  - .prettierrc 파일 생성 => printWidth(글자 수), tabWidth(tab space 개수), singleQuote(string quote), trailingComma(마지막에 ,), semi(마지막에 ;)
- **npm i -D webpack @babel/core babel-loader @babel/preset-env @babel/preset-react @babel/preset-typescript style-loader css-loader**
  - js로 변환해줄 webpack, babel 설치
  - @babel/preset-env(최신문법 변환) @babel/preset-react(리액트 jsx 변환), @babel/preset-typescript(타입스크립트 변환)
  - css로 변환해줄 style-loader, css-loader 설치
  - _babel이 index.html까지 직접 만들어주진 않음 => 직접 만들기_
    - tsx 파일에서 모든 것을 다 처리하려고 하는데, 사실 index.html이 담당하는 기능이 많음 => js 실행 이전의 모든 것들이 포함
    - 1.  성능 최적화 => js 파일이 매우 커짐(SSR, code splitting 이라는 해결책도 있지만)
      - 2.  SEO
      - 3.  js 실행 이전의 핵심 css 처리
- **npm i -D webpack-dev-server webpack-cli**
  - hot reloading을 위한 서버 설치
  - 프록시 역할도 할 수 있기 때문에 CORS 에러를 해결할 수도 있음
- **npm i -D @pmmmwh/react-refresh-webpack-plugin react-refresh fork-ts-checker-webpack-plugin**
  - @pmmmwh/react-refresh-webpack-plugin : hot reloading
  - fork-ts-checker-webpack-plugin : ts 검사를 할 때 블로킹(직렬) 방식 대신, ts 검사와 webpack 실행을 동시에 할 수 있게 해줌(fork, 병렬)

## 3. npm install

- node_modules : 실제 패키지 소스 코드가 위치
- package-lock.json
  - 하나의 패키지는 여러 하위 패키지들을 사용(의존)하고 있는 경우가 많음
  - => node_modules에 설치한 패키지보다 디렉토리가 많은 이유
  - 즉, 서로 다른 패키지에서 같은 패키지를 사용(의존)할 수 있는데, 이 때 서로 사용하는 패키지의 버전이 다를 수 있음
  - package.json만으로는 정확하게 의존하고 있는 패키지를 알 수 없음
  - 의존하고 있는 패키지의 정보들을 정확하게 알 수 있는 파일
- ERESOLVE 같은 에러가 발생한다면?
  - npm install --force로 실행

## 4. tsconfig.json

- typescript 설정하는 파일 : tsconfig-schema.json 참조
- ts도 결국 js로 변환됨(2가지 방법)
  - 1.  ts -> js
  - 2.  ts -> js -> (babel) -> js
    - why? babel은 html, css, image 등 모든 것을 js로 변환할 수 있기 때문에 많이 함
- 아래는 기본 설정
- **"esModuleInterop": true**
  - import _ as React from "react"; 처럼 일반적으로 node 모듈들은 _ as를 붙여줘야 함
  - true 설정 시, import React from "react";로 사용 가능
- **"sourceMap": true**
  - 오류 발생 시, 원래 오류 난 위치를 편하게 찾을 수 있게 함
- **"lib": ["ES2020", "DOM"]**
  - 라이브러리
  - 프런트 개발할 때는, 위 2개를 포함하면 됨
- **"jsx": "react"**
  - jsx가 React에만 쓰이는 것이 아니기 때문에, 명확히 함
- **"module": "esnext"**
  - 최신 모듈(import, export)을 사용하겠다는 뜻
  - 아니라면, CommonJS, AMD, SystemJS, UMD 등을 사용할 수 있음
- **"moduleResolution": "Node"**
  - import, export도 node가 해석할 수 있게 하겠다
- **"target": "es5"**
  - ES2020으로 작성해도 es5로 변환하겠다는 의미
- **"strict": true**
  - type check을 엄격하게 함
  - true를 사용하지 않으면, ts를 사용하는 의미가 없다 => anyscript
  - _반드시 사용할 것..._
- **"resolveJsonModule": true**
  - import json 하는 것을 허락
- **"baseUrl": "."**
- **"path": {}**
  - import ../../Button.jsx => import @src/Button.jsx처럼 절대 경로로 표현 가능
- ts-node 설정 : webpack은 ts 파일을 읽지 못하기 때문에

## 5. webpack.config.ts

- ts -> js -> (babel) -> js
- const config : webpack.Configuration = {};
  - **name**
  - **mode**: "development", "production"
  - **devtool**: "hidden-source-map"(development), "inline-source-map" or "eval"(production)
  - 여기까지 대부분의 서비스가 같음
  - **resolve** : {
    extension: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias : { "@hooks" : path.resolve(\_\_dirname, "hooks") }
    }
    - extension : babel이 처리할 확장자
    - alias
      - 실제로 webpack이 js로 바꿔줄 때 참고하는 설정(실제로 변환하는 설정!)
      - tsconfig.json 파일은 ts 검사기가 참고하는 설정
  - **entry** : 입력(다중 입력 가능 => 다중 출력)
    - { app: "./client", app2: "./client , app3: "./client" }
    - 프로퍼티는 output의 [name]과 연결
  - **module** : 입력 -> module의 rules를 적용하여 js 파일로 합침
    - rules : []
      - test : /\.tsx?$/, /\.css?$/(style-loader, css-loader => css도 js로 변환해줌)
      - loader : "babel-loader" 사용(최신 문법을 예전 브라우저에서도 호환되는 문법으로 변환)
      - options : "@babel/preset-env"(브라우저 특정), "@babel/preset-react", "@babel/preset-typescript"
  - **plugins** : js 파일로 합치는 중 부가적인 효과를 줌
    - new ForkTsCheckerWebpackPlugin() : typescript에 필요
    - new webpack.EnvironmentPlugin() : react에서 *NODE_ENV*라는 변수를 사용할 수 있게 만들어줌(원래는 node runtime에서만 사용 가능)
  - **output** : module의 rules를 적용 -> 출력
    - 생성할 js 파일들의 경로를 지정 : 보통 "./dist"
  - **devServer** : 프런트 개발 서버 설정
    - "historyApiFallback" : true
      - 개발 서버에서는 브라우저에서 /login으로 요청했을 떄, 404 응답을 index.html로 보내라는 설정이 되어 있지 않음
      - 그렇기 때문에 Cannot GET /login과 같은 404 애러가 발생(server-side routing) => hot reloading에 방해가 됨
      - index.html만 받아오면, react-router가 자체 history API를 이용하여 path에 따라 컴포넌트를 리렌더링

## 6. build

- 1. **npx webpack**
  - webpack.config.ts 설정 파일에 따라서 /dist/app.js을 생성
  - _webpack은 ts 파일을 읽지 못함 => tsconfig.json에 추가 설정이 필요!_
  - 개발 모드(development)으로 build를 하기 때문에, js 파일 용량이 조금 클 수 있음
- 2. npm run build
  - webpack.config.ts 설정 파일에 따라서 /dist/app.js을 생성
  - **cross-env NODE_ENV=production webpack**
  - 배포 모드(production)으로 build를 하기 때문에, 배포에 최적화된 용량과 모듈만 설치하여 빌드
  - cross-env? NODE_ENV=production를 활성화하기 위해 Windows 환경에서 사용(Linux, Mac에서는 불필요)
- 3. npm run dev
  - /dist/app.js를 생성하지 않고 개발 모드(developmen)로 개발 서버를 띄움
  - **webpack serve --env development**
- **npm outdated** 명령어를 통해 구 버전의 모듈을 최신 버전으로 업데이트!
  - 모든 것을 할 필요는 없고 주로 _ts-node, webpack-dev-server_ 최신 버전으로 업데이트
  - **npm i ts-node@10 webpack-dev-server@4 --force**

## 7. docker 설정

- 추가 bridge 네트워크(sleact) 설정
- 1. **mysql(database)**

  - mysql을 설치할 때 필요한 root 비밀번호를 환경 변수로 추가 : MYSQL_ROOT_PASSWORD=chanhyle
  - mysql utf-8 설정을 위한 my.cnf 복사
  - expose 3306

- 2. **backend**

  - depends_on : mysql이 실행된 후, backend 컨테이너 실행
  - expose 3095
  - hot reloading을 설정할 필요가 없기 때문에(이미 개발 완료), Dockerfile에서 npm install
  - 스키마 생성 => npm run dev & => npm run stop => 더미 데이터 넣기 => npm run dev

- 3. **frontend**

  - ports : 3090:3090
  - hot reloading을 설정
    - 컨테이너가 생성된 이후(setup.sh) npm install
    - 로컬 볼륨 바운드 마운트 : $PWD/frontend:/app/frontend

## 8. .env 설정

- 1. backend

  - COOKIE_SECRET=sleactcookie
  - MYSQL_PASSWORD=

- 2. frontend
