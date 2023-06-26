import React, { useState, useCallback } from 'react';
import { Header, Form, Label, Input, Button, Error, Success, LinkContainer } from '@pages/SignUp/style';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import useInput from '@hooks/useInput';
// Global Mutate : 여기 있는 mutate는 key를 이용하여 범용적으로 사용할 수 있음
// e.g. mutate('http://localhost:3095/api/users', false)
import useSWR, { mutate } from 'swr';
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
  const [logInError, setLogInError] = useState('');
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
  // - 해당 시간 동안 어떠한 컴포넌트에서 useSWR로 아무리 많이 요청을 보내도, 요청 자체를 안 보내고 캐시에서 바로 가져오는 것
  // - 이런 이유로 다른 컴포넌트에서 dedupingInterval을 막 쓴다고 해도 괜찮음
  // - 데이터가 최신으로 유지되어야 하는 경우, 짧게 설정
  // - { dedupingInterval: 2000 }
  // https://velog.io/@soryeongk/SWRBasic

  // GraphQL과 함께 사용하기
  // - useSWR을 사용할 필요가 없음, Apollo가 비슷한 역할을 하기 때문

  // revalidate vs mutate
  // swr은 데이터를 저장해줘서 편하긴 한데, **요청을 많이 보내는 것을 막아야 함** => mutate()를 자주 사용하자
  // revalidate : 서버로 요청을 다시 보내서, 데이터를 _가져오는_ 것
  // - 이미 axios.response로 받아온 데이터를 버리고 => useSWR(즉, GET 요청)을 통해 => data를 갱신
  // mutate : 서버로 요청을 다시 보내지 않고, 데이터를 _수정_하는 것
  // - 버전 업데이트로 revalidate는 제거, mutate가 기본적으로 revalidate처럼 동작
  // - option : { revalidate : false }
  // - default => 서버 요청 없이 data를 바꾸고, 나중에 바뀐 data가 유효한지 서버 요청으로 점검 => 이 점검을 하지 않을 수 있음
  // - 즉, axios.response로 받아온 데이터로 data를 갱신
  // e.g. mutate(response.data, { revalidate : false })

  // 공통적으로 revalidate라는 뜻은 : 현재 data에 대한 유효성을 점검하기 위해 서버에 재요청 / 컴포넌트 리렌더링하는 것!

  // mutate가 중요한 이유? Optimistic UI가 가능해짐
  // - Optimistic UI : 요청이 성공할 것을 가정하여, UI를 성공한 상태로 먼저 바꾸어 놓고 요청을 나중에 하는 방법
  // - e.g. mutate(data, { revalidate: false }); axios.get().then(() => mutate()) ;
  // - Pessimistic UI : 요청이 실패할 것을 가정하여, 요청의 결과에 따라 상태를 바꾸는 방법
  // - e.g. axios.get().then(() => mutate());
  // - 성공할 확률이 매우 높은 요청은 Optimistic UI를 적용하는 것이 사용자 반응성을 개선하는데 오히려 효과가 좋음(실패할 확률이 그만큼 낮기 때문에)
  // - e.g. 인스타그램 좋아요 버튼 : 버튼을 누르면 mutate()로 먼저 좋아요를 설정하고, 이후 요청하는 방법
  // - if 성공) 결과적으로는 같으니 문제 없음
  // - if 실패) 실패 메시지를 띄우고, 설정된 좋아요를 취소하거나 새로고침을 통해 원래대로 복구

  // swr은 비동기 요청에 제한되지 않는다.
  // - localStorage로부터 데이터를 가져올 수도 있음!
  // - 즉, 전역 스토리지 역할을 할 수 있기 때문에, redux를 대체할 가능성이 있음
  // - e.g. const { data } = useSWR('hello', (key) => { localStorage.setItem('data', key); return localStorage.getItem('data'); });

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
    revalidateOnMount: true,
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
      setLogInError('');
      // 백엔드는 여기서 데이터를 받기 때문에 로그인 여부를 알 수 있음
      // 그럼 프런트는 로그인 여부를 어떻게 알 수 있나?
      // ***로그인에 성공하면 응답으로 로그인 정보를 보내줌 => 보통 Redux에 저장***
      // - 로그인 정보는 전역적으로 필요한 정보, 컴포넌트를 넘나들면서 로그인 정보를 알고 있어야 함 => Redux가 필요
      // - 이 프로젝트에서는 Redux를 사용하지 않음, 대안은? Context API? SWR or React query?
      // - SWR을 사용하여 어떻게 전역적으로 상태를 관리하는가?
      axios
        .post('http://localhost:3095/api/users/login', { email, password }, { withCredentials: true })
        .then((response) => {
          // Bound Mutate
          // mutate()를 호출하지 않으면, data가 최신화되지 않음(data : false)
          // mutate()를 호출하면, 리렌더링 되면서 data가 최신화(data : {id: 1, nickname: 'chanhyle', email: 'luckylooky2@naver.com', Workspaces: Array(1)})
          // **즉, mutate()를 호출함으로써 내가 원할 때 data를 최신화할 수 있음***
          // cf> mutate()를 호출하기 전, 리렌더링에 민감한 로직이 있는지 확인!
          // 강의) mutate()를 실행하면 => 먼저 data, error 값이 바뀜 => 자동으로 컴포넌트 리렌더링
          // 이미 axios.response로 받아온 데이터를 버리고 => useSWR(즉, GET 요청)을 통해 => data를 갱신
          // mutate();

          // shouldRevalidate : false
          // 새로운 GET 요청 없이 data를 갱신 => Optimistic UI
          // cf> 호출하였는데, GET /api/users 요청이 실행된 이유는 Workspace에서 GET 요청을 했기 때문!
          mutate(response.data, { revalidate: false });
        })
        .catch((error) => {
          setLogInError(error.response.data);
        })
        .finally(() => {});
    },
    [email, password],
  );

  // redirect 될 때, 깜빡 거리는 것은 loading 화면으로 해결하자!
  // isLoading으로는 안 되나..?
  // cf> if (data) 로 설정하면, data === false인 경우에 의도와 다른 결과가 출력
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  // 로그인 성공 후(mutate)에는 리렌더링이 되며 자동으로 channel로 redirect
  // ***return 구문은 항상 hooks(useCallback, useMemo ...)보다 아래 있어야 함*** => return 바로 위에 있다고 생각하면 될 듯
  // Invalid hook call Error 발생
  // - when? return 아래 / 반복문, 조건문 안에 hooks가 존재할 때
  if (data) {
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }

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
          {logInError && <Error>{logInError}</Error>}
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
