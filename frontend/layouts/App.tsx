// 안 써도 되는가? ts에서 에러가 나기 때문에 일단 써줘야 함
import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router';

// code splitting
const Login = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Channel = loadable(() => import('@pages/Channel')); // workspace layout을 감싼 channel 컴포넌트
const DirectMessage = loadable(() => import('@pages/DirectMessage')); // workspace layout을 감싼 channel 컴포넌트

// Route : 컴포넌트를 화면에 표시하는 기능
// Redirect : 다른 페이지로 redirect 시키는 기능(react-router v5) => useNavigate(react-router v6)
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
