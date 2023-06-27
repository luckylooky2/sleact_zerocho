## presentational and container 디자인 패턴

- 리액트의 컴포넌트는 상태, DOM, 이벤트 등을 모두 관리할 수 있음
- 자유롭게 컴포넌트를 활용할 수 있다는 의미이지만 컴포넌트 간의 의존도가 높아지는 것을 경계하지 않는다면,
- 추후 어플리케이션이 비대해졌을 때 코드의 재사용이 불가능해 짐
- 추가적으로 **레이어를 적절히 나눠 의존도를 낮춰주어야 할 필요를 느꼈고**
- hook의 개념이 존재하지 않았던 이전에, 로직과 view를 분리하기 위한 방법으로 등장한 것이 Presentational and Container 패턴!

### presentational component

- 오직 뷰만을 담당하는 컴포넌트(다른 app에서도 이 component를 사용할 수 있어야 함) : DOM 엘리먼트, 스타일
- 리덕스의 스토어에는 직접적인 접근 권한이 없으며 오직 props 로만 데이터를 가져올수 있음
- stateless(상태를 가질 수 있지만 UI에 관련된 상태만 가질 수 있음)
- 함수형 컴포넌트로 작성되며, state 를 갖고있어야하거나, 최적화를 위해 LifeCycle 이 필요해질때 클래스형 컴포넌트로 작성

### container component

- 내부에 DOM 엘리먼트가 직접적으로 사용되는 경우는 없음
- stateful(상태를 가지고 있음), 리덕스에 직접적으로 접근 할 수 있음
- 어떠한 동작을 할 것인가에 대해 책임을 짐(로직)
- 절대로 DOM 마크업 구조나 스타일을 가져서는 안 됨
- 장점
- 그저 받아온 정보를 화면에 표현할 뿐이므로, 의존도가 낮아 다양한 container 컴포넌트와 조합하여 재사용할 수 있음
- 기능과 UI가 명확히 분리되므로, 구조에 대한 이해가 쉬워짐
  => **Hook이 탄생하며 로직과 표현의 분리가 가능해졌기에 해결 가능**
- presentational 컴포넌트는 layout 컴포넌트로 활용하여 마크업 작업이 편함

- container는 markup없이 데이터만 다루고, presenter에게 prop으로 내립니다.

```Javascript
// CommentListContainer.js
import React from "react";
import CommentList from "./CommentList";

class CommentListContainer extends React.Component {
  constructor() {
    super();
    this.state = { comments: [] }
  }

  componentDidMount() {
    fetch("/my-comments.json")
      .then(res => res.json())
      .then(comments => this.setState({ comments }))
  }

  render() {
    return <CommentList comments={this.state.comments} />;
  }
}

```

```Javascript
// CommentList.js
import React from "react";

const Commentlist = comments => (
  <ul>
    {comments.map(({ body, author }) =>
      <li>{body}-{author}</li>
    )}
  </ul>
)
```

### Reference

- https://kyounghwan01.github.io/blog/React/container-presenter-dessign-pattern/#gist-%E1%84%8B%E1%85%A8%E1%84%8C%E1%85%A6
- https://gist.github.com/chantastic/fc9e3853464dffdb1e3c
- https://redux.vlpt.us/1-2-presentational-and-container-components.html
- https://tecoble.techcourse.co.kr/post/2021-04-26-presentational-and-container/
-
