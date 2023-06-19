import React, { useState, useCallback } from 'react';
import { Header, Form, Label, Input, Button, Error, Success, LinkContainer } from '@pages/SignUp/style';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import useInput from '@hooks/useInput';

// 로그아웃하는 방법(세션)
// 세션을 사용하는 경우, 로그아웃의 원리는 메모리에 설정된 쿠키를 지우는 것!
// 1. 백엔드 서버를 restart
// - localhost로 백엔드 서버를 돌릴 떄에는, 로그인한 사용자 정보를 메모리에 저장하고 있음 => 서버를 restart하면 로그인 정보가 사라짐
// 2. 세션 쿠키 삭제
// - 백엔드 서버를 restart할 수 없는 상황
// - Application - Storage - Cookies - http://localhost:3090 - connect.sid(express.js) 삭제
// - cf> Java : JSESSIONID

const Login = () => {
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail, setEmail] = useInput('');
  const [password, onChangePassword, setPassword] = useInput('');

  const onSubmitLogin = useCallback(
    (e) => {
      e.preventDefault();
      // 1. loading
      setLogInError(false);
      axios
        .post('http://localhost:3095/api/users/login', { email, password }, { withCredentials: true })
        .then((response) => {
          // revalidate();
        })
        .catch((error) => {
          setLogInError(error.response.data.statusCode === 401);
        })
        .finally(() => {});
    },
    [email, password],
  );

  return (
    <div id="container">
      <Header>
        <img src="https://a.slack-edge.com/cebaa/img/ico/favicon.ico" alt="slack_favicon" />
        Sleact
      </Header>
      <Form onSubmit={onSubmitLogin}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {/* {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>} */}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default Login;
