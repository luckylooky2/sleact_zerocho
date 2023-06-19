import React, { useState, useCallback } from 'react';
import { Header, Form, Label, Input, Button, Error, Success, LinkContainer } from '@pages/SignUp/style';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { Link } from 'react-router-dom';

// redux를 사용하는 이유
// - 1. 전체(전역)적인 상태를 관리
// - 2. 비동기 로직과 컴포넌트를 분리
// - 비동기 요청이 있을 때, thunk, saga와 같은 middleware로 요청을 보냄
// - 즉, 비동기 코드가 컴포넌트에 남아있지 않음
// - 장점) 코드 가독성 향상, 재사용성(비동기 코드를 외부에서 재사용)
// - 성능 최적화 : 비동기 코드를 분리하면 필요한 경우에만 실행하고 결과를 처리할 수 있습니다.
// - 예를 들어, 컴포넌트가 처음 마운트될 때 비동기 데이터를 가져오는 경우, 컴포넌트가 다시 렌더링될 때마다 데이터를 다시 가져오는 것이 아니라 필요한 경우에만 비동기 함수를 호출하여 성능을 최적화할 수 있습니다.
// - 단점) 코드가 너무 길어짐

// 이 프로젝트에서는 컴포넌트에서 비동기 코드를 딱히 분리할 이유가 없음
// - 컴포넌트 하나에서만 유일하게 쓰이는 비동기 코드인 경우
// - 해당 컴포넌트 내에서만 쓰이는 비동기 코드는 redux로 넘기지 않고 해당 컴포넌트 안에서 해결!

const SignUp = () => {
  // 아래 코드(hook)들이 비슷하게 사용될 가능성이 있음 => custom hook을 만들 수 있는지 생각해보자
  // _중복 코드가 아닐 수 있으므로, 처음에는 중복 제거/최적화/리팩토링를 코드를 대부분 완성한 뒤에 할 것!_
  // useInput custom hook
  // const [email, setEmail] = useState('');
  // const [nickname, setNickname] = useState('');
  const [email, onChangeEmail, setEmail] = useInput('');
  const [nickname, onChangeNickname, setNickname] = useInput('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  // error
  const [missmatchError, setMissmatchError] = useState(false);
  const [nicknameError, setNicknameError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // const onChangeEmail = useCallback((e) => {
  //   setEmail(e.target.value);
  // }, []);
  // const onChangeNickname = useCallback((e) => {
  //   setNickname(e.target.value);
  // }, []);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMissmatchError(!!passwordCheck && e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMissmatchError(!!password && e.target.value !== password);
    },
    [password],
  );

  const onSubmitSignUp = useCallback(
    (e) => {
      e.preventDefault(); // SPA이기 때문에
      if (!nickname) return setNicknameError(true);
      else setNicknameError(false);
      if (!missmatchError && nickname) {
        // 비동기 요청 3단계 : loading => success => failure
        // 1. loading
        // 비동기 요청에서 setState를 하는 코드가 있을 경우에는, 비동기 요청 하기 전에 초기화를 해주는 것이 좋음!
        // why? **요청을 연달아 보낼 때, 이전 state가 다음 요청에 영향을 줄 가능성이 있기 때문**
        setSignUpError('');
        setSignUpSuccess(false);
        // 현재는 CORS 백엔드 설정을 해놓았기 때문에 CORS 에러가 발생하지 않음
        // CORS : 프런트 서버에서 가져온 리소스가, 프런트 서버가 아닌 다른 origin으로 요청을 보낸 경우 브라우저에서 이 요청을 강제로 막는 기능
        // 해결
        // 1. 백엔드 서버 설정 : cors origin: true => OPTIONS 요청 같이 보냄(cross origin)
        // 2. 프런트 서버 프록시 설정 : 일단 프런트 서버로 요청을 보내고(CORS 해결), 프런트 서버에서 백 서버로 요청을 보내는 방법
        // - OPTIONS 요청을 보내지 않음(same origin)
        // - 단, 이 방법은 프런트, 백 둘 다 localhost일 때만 가능(42Partner)
        // - 프런트는 localhost인데 백은 실제 서버라고 하면 proxy 방법은 사용하지 못함
        axios
          // { email : email, nickname : nickname, password : password }가 아니라 { email, nickname, password }?
          // 객체의 속성을 명확하게 식별하고 가독성을 높이기 위해 가능한한 키를 명시적으로 지정하는 것이 좋음
          .post('http://localhost:3095/api/users', { email, nickname, password }) // url, data
          // 2. success
          .then((response) => {
            setSignUpSuccess(true);
          }) // 요청에 성공했을 때 로직
          // 3. failure
          .catch((error) => {
            setSignUpError(error.response.data);
          }) // 요청에 실패했을 때 로직
          .finally(() => {}); // 요청에 성공하든 실패하든 이후에 처리할 로직
      }
    },
    [email, nickname, password, passwordCheck, missmatchError], // 넣는 기준? 매개 변수(x), 함수 내에서 사용한 외부 변수(o)
  );

  return (
    <div id="container">
      <Header>
        <img src="https://a.slack-edge.com/cebaa/img/ico/favicon.ico" alt="slack_favicon" />
        Sleact
      </Header>
      <Form onSubmit={onSubmitSignUp}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {missmatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {nicknameError && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입 되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
