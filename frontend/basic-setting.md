## 1. 디렉토리 세팅

- 프로젝트 내 디렉토리 구조는 사람, 회사마다 다 다르기 떄문에 정답은 없음
- sleact 프로젝트
  - pages : React가 SPA인데도 페이지가 있을 수 밖에 없음(복잡한 프로젝트의 경우), 각 페이지의 진입점 컴포넌트
    - 하위 페이지 디렉토리 : index.tsx, style.tsx
  - components : 공통 되거나, 작은 컴포넌트들
  - layouts : 페이지들 간의 공통 레이아웃
- atomic 방식
  - atom 모듈, 셀
- class component 방식
  - components
  - container
- 절대 경로 import
  - webpack.config.ts : resolve : alias 설정
  - tsconfig.json : baseUrl, paths 설정

## 2. 라우터 세팅

- **npm i react-router react-router-dom**
- **npm i -D @types/react-router @types/react-router-dom**

## 3. 상태 관리 툴 세팅

- redux, jotai, zustand, recoil ...
- _주기적으로 새로운 라이브러리로 업데이트 하는 노력이 필요_ => 아니면 고인물이 될 수 있음(부정적 의미)

## 4. code splitting

- **npm i @loadable/component**
- **npm i @types/loadable\_\_component**
- SPA임에도 불구하고 페이지가 많아지는 경우, 하나의 js 파일로 다 해결하려는 경우 문제가 발생
- js 파일 크기에 비례하여 다운로드 하는 시간이 길어짐 => 사용자 입장에서 로딩 속도가 느림
  - 3초 룰 : _3초 안에 로딩이 안 되면, 사용자들은 떠난다..._
- 따라서, 필요한 페이지들만 불러오면 이런 문제를 해결할 수 있음
- "code splitting"
  - 필요없는 컴포넌트는 처음에 불러오지 않도록 하는 방법
  - 필요한 컴포넌트는 그때 그때 불러오도록 하는 방법
- 어떤 컴포넌트를 분리할 것인가?
  - 1. 가장 쉬운 기준은... _페이지_ 별로!
    - e.g. 로그인 페이지에 있는데, 굳이 회원가입 페이지를 불러올 필요는 없음
  - 2. SSR이 필요 없는 경우, SSR이 되지 않도록 분리
    - e.g. 텍스트 에디터를 굳이 서버에서 렌더링할 필요는 없음
- React에서도 code splitting, SSR가 지원되는 컴포넌트(Suspense?)를 개발하겠다고 했는데... 아직 소식이 없음

## 5. css

- React에서 css를 처리하는 방법은 많음
- 1. **inline style**

  - 장점 : 가장 간편함, 단점 : 가독성이 떨어져 유지 보수가 힘듦
  - e.g.
    - <div style={{ color : "white" }} />

- 2. **css 파일 import**

  - css 파일에 css 속성을 정의하고 import하여 사용
  - e.g.
    - import "styles.css";
    - <div className="flex-container">

- 3. **css in js : styled component, emotion**

  - **npm i @emotion/react @emotion/styled**
  - js 파일 안에서 css를 사용하는 방법 => css 파일을 만들지 않고, 모든 것을 js로 하는 방법
    - 컴포넌트에 미리 css를 입혀놓는다!는 의미
  - emotion과 styled component는 거의 비슷, emotion 설정이 더 쉽고 / SSR이 조금 더 쉬움
    - 사용량은 styled component가 더 많음
    - styled component의 불편한 점을 개선한 것이 emotion
  - **npm i @emotion/babel-plugin**
  - config.module.rules[0].options.env.development.plugins에 ['@emotion', { sourceMap: true }] 추가
    - @emotion 하나면 [] 배열 없이 가능하지만, 설정이 필요한 경우 [] 배열로 감싸주는 것이 필요
    - components as selectors : _& ${CustomButton} {}_ 처럼 만든 컴포넌트도 직접 선택하여 css를 지정 가능
      - ${} 이름들이 결국 className으로 바뀌기 때문에 => babel-plugin이 미리 알 수 있음 => 그래서 변수 지정이 가능!
    - Minification(압축), Dead Code Elimination(안 쓰는 코드 제거), Source Maps 등 기능...
    - https://www.npmjs.com/package/@emotion/babel-plugin
  - 공식 css에 없는 sass 문법(e.g. 자식 선택자)도 사용할 수 있다는 장점도 있음
    - _& > span {}_ => 자식 선택자(styled component를 되도록 적게 생성하자 : 변수명 짓기가 어려움)
    - _&:focus_ => 내가 focus 된 상태일 때
  - cf> var은 공식 css 문법!
  - Q. css in js를 사용하면 퍼블리셔, 디자이너와 협업이 어렵지 않은가?
    - React 자체가 다른 직군과 협업하기가 불편 => 그냥 css를 사용하나 css in js를 사용하나 불편한 건 매한가지
  - e.g.
    - import styled from '@emotion/styled';
    - const Header = styled.header``;
