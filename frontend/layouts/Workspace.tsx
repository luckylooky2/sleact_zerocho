import axios from 'axios';
import React, { VFC, FC, useCallback } from 'react';
import { Redirect } from 'react-router';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';

// Workspace layout
// 다른 컴포넌트들을 감싸는 컴포넌트라고 생각하면 될 듯?
// children props : 미래에 <Workspace></Workspace> 안에 들어갈 JSX

// FC : FunctionComponent => children을 사용하는 컴포넌트 type
// VFC : VoidFunctionComponent => children을 쓰지 않는 컴포넌트 type
const Workspace: FC = ({ children }) => {
  // 캐시가 전역 스토리지처럼 동작하기 때문에 이런 식으로 막 가져다가 써도 됨
  // 캐시는 브라우저의 메모리에 저장됨
  // SWR은 기본적으로 간단한 인메모리 캐시를 제공하며, 브라우저 탭이나 세션이 유지되는 동안 캐시는 유효
  const { data, isLoading, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
    revalidateOnMount: true,
  });

  const onClickLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        // 로그아웃한 결과를 최신화하여 data를 fetching
        // 실행하면 => useSWR() 실행 => data, error 값이 바뀜 => 자동으로 컴포넌트 리렌더링
        mutate();
      });
  }, []);

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <button onClick={onClickLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
