// 안 써도 되는가? ts에서 에러가 나기 때문에 일단 써줘야 함
import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router';

// code splitting : 어떠한 페이지에서라도 할 수 있음
const Login = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Channel = loadable(() => import('@pages/Channel')); // workspace layout을 감싼 channel 컴포넌트
const DirectMessage = loadable(() => import('@pages/DirectMessage')); // workspace layout을 감싼 channel 컴포넌트

// 중첩 라우팅
// - 현재 방법? 각각 페이지에 Workspace 컴포넌트를 children props로 적용하여, 각각 라우팅
// - 다른 방법? Workspace 컴포넌트 안에서 각각의 페이지를 라우팅(중첩 라우팅) 하는 방법도 가능
// - 선택 기준 : path="" 값이 /workspace/channel, /workspace/dm처럼 일관적이라면 중첩 라우팅을 사용할 수 있음
// - 아니라면, children props를 적용하는 방식이 적절

// Route : 컴포넌트를 화면에 표시하는 기능
// Redirect : 다른 페이지로 redirect 시키는 기능(react-router v5) => useNavigate(react-router v6)

// <Route /> 밖의 부분은 해당 컴포넌트의 레이아웃
const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/channel" component={Channel} />
      <Route path="/workspace/dm" component={DirectMessage} />
    </Switch>
  );
};

export default App;
