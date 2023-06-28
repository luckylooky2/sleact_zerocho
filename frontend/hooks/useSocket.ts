import axios from 'axios';
import { useCallback } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

// socket-io는 React와 그렇게 잘 어울리지 않음
// - 컴포넌트에 socket을 종속시킨 경우, 다른 컴포넌트로 이동 시 socket 연결이 해제될 수 있음
// - 이 문제를 방지하기 위해, 공통된 컴포넌트에 소켓을 설정(e.g. App.tsx, Workspace.tsx)
// - 가장 상위 컴포넌트에 위치하게 되므로
// - 1. HOC를 통해 props로 socket을 넘기는 방법
// - 2. hooks을 통해 socket을 설정하는 방법
// - 만약, 부모 컴포넌트에 socket을 생성할 수 있다면 생성
// - 아니라면, hook에 생성

// socket 계층
// namespace - workspace
// room - channel
// - 계층을 잘 살펴서 보내야 함, 아니면 원하지 않은 결과(모두에게 전송)가 나타날 수도

// 동시에 여러 workspace에 접속할 수 있기 때문에
// type : 빈 객체나 배열([], {})인 경우에는 type을 적어줘야 함
const sockets: { [key: string]: Socket } = {};

// socket.emit() type 에러
// - return type을 적어주면 해결
const useSocket = (workspace?: string): [Socket | undefined, () => void] => {
  // 스코프 문제
  // workspace가 undefined일 때를 막아주는 코드가 아래 있고, disconnect 선언이 위에 있어야 하는 상황

  // 문제점?
  // - workspace가 undefined일 경우 런타임 오류 발생
  // - Type 'undefined' cannot be used as an index type.
  //   const disconnect = sockets[workspace].disconnect;

  //   if (!workspace) {
  //     return [undefined, disconnect];
  //   }

  // 해결 : useCallback()을 사용하여 함수로 바꿔줌
  // - 일단 먼저 생성해놓고, workspace가 초기화될 때 다시 생성?
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      // disconnect 했다면, socket 객체에서 삭제
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) return [undefined, disconnect];

  // 소켓이 이미 존재한다면, 생성하지 않음
  if (!sockets[workspace]) {
    // io(url)
    // - url : defaults tp window.location.host
    // - pathname에 따라 새로운 namespace socket이 반환
    // - 하나의 클라이언트와 하나의 서버는 각각 namespace에 대해서 multiplexing 방식으로 동작
    sockets[workspace] = io(`${process.env.REACT_APP_API_URL}/ws-${workspace}`, {
      transports: ['websocket'],
    });
  }

  // polling error(CORS)
  // - socket.io는 먼저 요청을 http 방식으로 보내고, 나중에 웹 소켓 방식으로 전환
  // - why? IE 같은 경우 웹 소켓이 존재하지 않기 때문에, http 요청으로 먼저 연결
  // - 웹 소켓이 있는 것이 확인되었다면 웹 소켓으로 전환
  // - 처음부터 polling 하지 말고, 웹 소켓만 써라 => { transports: ['websocket'] } 옵션

  // workspace에서 이동하는 경우
  // - 기존 workspace의 socket 연결을 끊어야 하기 때문에 disconnect()
  // - 만약, 끊지 않는다면 두 workspace의 메시지를 같이 받게 됨
  // - 어떤 문제가 발생 가능? 접속 중이 아닌데 접속 중으로 오해? / 메시지가 workspace를 구분하지 않고 오게 됨?

  return [sockets[workspace], disconnect];
};

export default useSocket;
