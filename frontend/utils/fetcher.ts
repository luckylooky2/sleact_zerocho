import axios from 'axios';

// 결과적으로 return 하는 response.data가 useSWR의 리턴 값으로 return 됨

// 또 하나의 문제
// withCredentials : 프런트 서버 주소와 백 서버 주소가 다른 경우, cookie 전달이 불가능(브라우저 기본 옵션?)
// **로그인은 브라우저에 저장된 cookie를 프런트에서 백으로 보내서 확인하는 과정!**
// 해결 : axios 요청 config 매개 변수 자리에 { withCredentials: true }를 설정

// 로그인은 어느 사이트나 다 cookie에 저장
// why? cookie가 안전하기 때문
// 토큰으로 로그인하는 것도 cookie에 저장하는 경우가 있음
const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((response) => response.data);

export default fetcher;
