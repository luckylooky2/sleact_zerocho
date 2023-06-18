import React, { useState, useCallback } from 'react';
import { Header, Form, Label, Input, Button, Error, Success, LinkContainer } from '@pages/SignUp/style';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const onSubmitSignUp = useCallback(() => {}, []);
  const onChangeEmail = useCallback(() => {}, []);
  const onChangeNickname = useCallback(() => {}, []);
  const onChangePassword = useCallback(() => {}, []);
  const onChangePasswordCheck = useCallback(() => {}, []);

  return (
    <div id="container">
      <header>Sleact</header>
      <form onSubmit={onSubmitSignUp}>
        <label id="email-label">
          <span>이메일 주소</span>
          <div>
            <input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </label>
        <label id="nickname-label">
          <span>닉네임</span>
          <div>
            <input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </label>
        <label id="password-label">
          <span>비밀번호</span>
          <div>
            <input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </label>
        <label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <input
              type="text"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
        </label>
        <button type="submit">회원가입</button>
      </form>
      <div>
        이미 회원이신가요?&nbsp;
        <a href="/login">로그인 하러가기</a>
      </div>
    </div>
  );
};

export default SignUp;
