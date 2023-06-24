import axios from 'axios';
import React, { VFC, FC, useCallback } from 'react';
import {
  Header,
  ProfileImg,
  RightMenu,
  WorkspaceWrapper,
  Workspaces,
  Channels,
  Chats,
  WorkspaceName,
  MenuScroll,
} from '@layouts/Workspace/style';
import { Redirect } from 'react-router';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import gravatar from 'gravatar';

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
        // mutate();

        // revalidate : false
        mutate(false, { revalidate: false });
      });
  }, []);

  if (!data) {
    return <Redirect to="/login" />;
  }

  // gravatar
  // - slack 기본 프로필 이미지처럼, 계정에 랜덤으로 프로필 이미지를 생성해주는 라이브러리

  // @types 라이브러리
  // - 해당 라이브러리에서 사용할 수 있는 type을 제공해주는 라이브러리!
  // - 자동으로 type을 유추할 수 있도록 도와주는 라이브러리?
  // - 높은 확률로 해당 라이브러리 제작자와 다름 => types가 다를 수 있기 때문에 사용자가 type을 만들어 적용해야 하는 경우도
  // - npm 웹 페이지에 들어가보면, 라이브러리별로 @types 라이브러리가 있는지 확인할 수 있음
  // 1. redux : 처럼 해당 라이브러리 내에서 type을 제공해주는 라이브러리
  // 2. gravatar : 처럼 @types 라이브러리를 제공
  // 3. 아예 type 라이브러리를 제공하지 않음 => type을 만들어 사용해야 함

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.nickname, { s: '28px', d: 'mp' })} alt={data.email} />
          </span>
        </RightMenu>
      </Header>
      <button onClick={onClickLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>workspace</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menu scroll</MenuScroll>
        </Channels>
        <Chats>chats</Chats>
      </WorkspaceWrapper>
      {children}
    </div>
  );
};

export default Workspace;
