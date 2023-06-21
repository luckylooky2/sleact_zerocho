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

// get 요청 뿐만 아니라 다른 모든 요청에 적용할 수 있음
// 다만, 어떤 요청이던 간에 데이터를 fetching하여 swr이 데이터를 저장해주는 기능이다.
// - 어떤 요청인지가 중요한게 아니라, 데이터를 저장한다는 것이 중요한 것!
const fetcherPost = (url: string) => axios.post(url, { withCredentials: true }).then((response) => response.data);

// fetcher는 하나만 사용하지 않고, 여러 개로 다양화해서 사용하자
// - 서버에서 오는 데이터를 response.data 그대로 저장하지 말자는 뜻!
// - 대신, 프런트에서 필요한 형태로 swr에 저장
const fetcherListLength = (url: string) =>
  axios.post(url, { withCredentials: true }).then((response) => response.data.length);

// 같은 API 주소에 다른 fetcher를 적용하고 싶은 경우?
// - API 주소 끝에 #123 과 같은 것 추가 => 서버는 이런 표시를 무시

export default fetcher;
