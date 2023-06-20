import React, { useState, useCallback } from 'react';
import { Header, Form, Label, Input, Button, Error, Success, LinkContainer } from '@pages/SignUp/style';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import useInput from '@hooks/useInput';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

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

  // useSWR(데이터를 가져올 API 주소, fetcher)
  // - useSWR 자체는 아무런 역할도 하지 않음. 단순히 API 주소를 fetcher로 넘기는 역할?
  // - fetcher 함수에서 API 주소를 어떻게 처리할지 정의해야 함
  // - data : API 주소에서 가져온 data
  // - isLoading : data가 존재하지 않는 경우, loading 상태 => loading 상태를 알 수 있음
  // - error : fetcher 함수에서 에러가 발생한 경우, 정보를 저장

  // SWR
  // - 요청을 보내서 받아온 데이터(특히, server state)를 저장하는 역할
  // - 통상적으로 GET 요청으로 받아오는 정보를 저장(POST 요청이 불가능한 것은 아님)
  // - 굳이 POST로 하려고 하지 말고, GET 요쳥을 한 번 더 보내자!(서버에 정상적으로 로그인이 되어 있다면 제대로 된 데이터가 오기 때문)

  // data fetching options
  // 내부적인 규칙에 따라 요청을 자동으로 보내어 data를 최신화 => 높은 확률로 최신화된 data를 볼 수 있음
  // - 물론 내부적인 규칙을 변경할 수도 있음
  // 1. **내가 원할 때, SWR을 호출하기**
  // - Bound Mutate : 현재 키를 기반으로 mutate()를 호출할 때, data을 fetching
  // 2. **SWR이 주기적으로 호출되는 것을 막기**
  // - 기본적으로는 활성화(자동 호출 x)
  // - { refreshInterval: 1000 } : 1000 밀리초마다 주기적으로 호출
  // 3. **조건부로 특정 시점부터 SWR를 실행하기(컴포넌트 마운트 될 때가 default)**
  // - 조건부로 하려면 useState로 조건을 만들어주어야 함
  // - const [cond, setCond] = useState(); const { data } = useSWR(cond ? 'http://localhost~' : null, fetcher)
  // 4. **기본적으로 컴포넌트가 마운트될 때, 리렌더링 되면서 data를 업데이트**
  // - { revalidateOnMount: false } => 컴포넌트가 마운트될 때, 리렌더링을 막을 수 있음
  // 5. **주기적으로 호출은 되지만, 캐시에서만 불러오는 기간을 설정하기**
  // - 이 시간 범위내에 동일 키를 사용하는 *요청* 중복 제거(밀리초)
  // - 요청 자체를 안 보내고 캐시에서 바로 가져오는 것?
  // - { dedupingInterval: 2000 }

  // GraphQL과 함께 사용하기
  // - useSWR을 사용할 필요가 없음, Apollo가 비슷한 역할을 하기 때문

  // data : false / isLoading : false
  // Q. 처음엔 data === false인가?
  // - 데이터가 로드되지 않았다면 undefined
  // - cookie가 없어서 error가 발생하는 것인가?
  // - 반환된 값은 data로 전달되며, 만약 throws라면 error로 잡힙니다. => error가 아님
  // - 백엔드에서 400 응답한 것이 아니라 특정한 경우 false라는 값으로 200 응답한 것
  // - 어떤 경우인지는 아직 잘 모름...

  // Q. 왜 새로고침을 하면, 해당 API로부터 응답을 받지도 않았는데, data에 값이 있는가?
  // - 즉, 왜 false가 아닌가?
  // - 서버 데이터를 캐싱하기 때문, 컴포넌트 내에서 캐싱하는 것이 아님
  // - **이런 류의 라이브러리를 사용하는 가장 큰 이유?**
  // - SWRConfig의 provider 옵션으로 이 동작을 커스터마이징 할 수도 있음

  const { data, isLoading, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
    refreshInterval: 500,
  });

  // data : undefined / isLoading : true
  // data : false / isLoading : false
  // Q. 왜 두 번 호출되는가?
  // - **컴포넌트가 마운트**되었을 때 자동 갱신 활성화되는 옵션 때문에(default) => revalidateOnMount
  // - 처음에 data는 undefined이기 때문에, 이 옵션이 true 이어야 함
  // - useSWR() => console.log() => 컴포넌트 마운트 => 리렌더링(옵션) => useSWR() => console.log()
  // cf> mutate()를 호출하기 전, 리렌더링에 민감한 로직이 있는지 확인!
  console.log('data :', data, '/ isLoading :', isLoading);

  const onSubmitLogin = useCallback(
    (e) => {
      e.preventDefault();
      // 1. loading
      // setState()를 호출하기 때문에 어쨌든 컴포넌트가 리렌더링되는 효과도 있음
      setLogInError(false);
      // 백엔드는 여기서 데이터를 받기 때문에 로그인 여부를 알 수 있음
      // 그럼 프런트는 로그인 여부를 어떻게 알 수 있나?
      // ***로그인에 성공하면 응답으로 로그인 정보를 보내줌 => 보통 Redux에 저장***
      // - 로그인 정보는 전역적으로 필요한 정보, 컴포넌트를 넘나들면서 로그인 정보를 알고 있어야 함 => Redux가 필요
      // - 이 프로젝트에서는 Redux를 사용하지 않음, 대안은? Context API? SWR or React query?
      // - SWR을 사용하여 어떻게 전역적으로 상태를 관리하는가?
      axios
        .post('http://localhost:3095/api/users/login', { email, password }, { withCredentials: true })
        .then((response) => {
          // mutate()를 호출하지 않으면, data가 최신화되지 않음(data : false)
          // mutate()를 호출하면, 리렌더링 되면서 data가 최신화(data : {id: 1, nickname: 'chanhyle', email: 'luckylooky2@naver.com', Workspaces: Array(1)})
          // **즉, mutate()를 호출함으로써 내가 원할 때 data를 최신화할 수 있음***
          // cf> mutate()를 호출하기 전, 리렌더링에 민감한 로직이 있는지 확인!
          mutate();
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
