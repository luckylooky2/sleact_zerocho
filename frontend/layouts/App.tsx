// 안 써도 되는가? ts에서 에러가 나기 때문에 일단 써줘야 함
import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router';

// code splitting
const Login = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));

// Route : 컴포넌트를 화면에 표시하는 기능
// Redirect : 다른 페이지로 redirect 시키는 기능

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
    </Switch>
  );
};

export default App;