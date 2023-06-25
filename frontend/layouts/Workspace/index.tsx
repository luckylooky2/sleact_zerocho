import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { VFC, FC, useCallback, useState } from 'react';
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
  ProfileModal,
  LogOutButton,
  WorkspaceButton,
} from '@layouts/Workspace/style';
import { Redirect } from 'react-router';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import gravatar from 'gravatar';
import Menu from '@components/Menu';

// Workspace layout
// 다른 컴포넌트들을 감싸는 컴포넌트라고 생각하면 될 듯?
// children props : 미래에 <Workspace></Workspace> 안에 들어갈 JSX

// FC : FunctionComponent => children을 사용하는 컴포넌트 type
// VFC : VoidFunctionComponent => children을 쓰지 않는 컴포넌트 type
const Workspace: FC = ({ children }) => {
  // 캐시가 전역 스토리지처럼 동작하기 때문에 이런 식으로 막 가져다가 써도 됨
  // 캐시는 브라우저의 메모리에 저장됨
  // SWR은 기본적으로 간단한 인메모리 캐시를 제공하며, 브라우저 탭이나 세션이 유지되는 동안 캐시는 유효
  const {
    // destructuring alias
    // - import { Redirect as R } from "react-router" 도 가능
    data: userData,
    isLoading,
    error,
    mutate,
  } = useSWR('http://localhost:3095/api/users', fetcher, {
    revalidateOnMount: true,
  });

  console.log(userData);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  // toggle 함수 : 기능을 껐다 켜는 함수
  const onClickProfileMenu = useCallback(() => {
    setShowProfileMenu((prev) => !prev);
  }, []);

  // SWR의 핵심
  // - 클라이언트 측에서 데이터를 가져오고 캐싱하는 역할
  // - 캐싱은 클라이언트 측에서 이루어지는 메모리 또는 로컬 스토리지에 데이터를 저장하여 중복 요청을 방지하고 응답 속도를 향상시키는 기능
  // Server-side routing과 useSWR
  // - Server-side routing(주소 창 or 새로고침을 이용하여 백엔드에 직접 요청을 보내는 경우)에서는 useSWR의 캐싱 기능을 이용할 수 없음
  // - why? 클라이언트 측에서 요청을 하고 응답을 받아 캐싱하는 방식으로 동작하기 때문
  // - 즉, store에 값이 있던 말던 요청을 무조건 다시 보낸다는 뜻 => data === undefined가 되는 경우 때문에 로직이 꼬임
  // - /workspace/dm으로 접속 => data가 처음에는 undefined => login 페이지 redirect => data fetching 완료 => /workspace/channel로 가는 문제 발생
  // 해결?
  // - isLoading === true 인 경우 : 각각 컴포넌트에서 loading 화면
  // - loading이 된 이후
  // - 1. data === false 인 경우(로그인 세션 존재하지 않을 때) : login 페이지으로 redirect
  // - 2. data === { ... } 인 경우(로그인 세션이 존재하여 data fetching) : /workspace/dm 페이지에 남아 있음

  if (!isLoading && !userData) {
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
          <span onClick={onClickProfileMenu}>
            {isLoading ? (
              <div>로딩 중...</div>
            ) : (
              <>
                <ProfileImg src={gravatar.url(userData.nickname, { s: '28px', d: 'mp' })} alt={userData.email} />
                {showProfileMenu ? (
                  <Menu style={{ right: 0, top: 38 }} show={showProfileMenu} onCloseModal={onClickProfileMenu}>
                    <ProfileModal>
                      <img src={gravatar.url(userData.nickname, { s: '36px', d: 'mp' })} alt={userData.email} />
                      <div>
                        <span id="profile-name">{userData.nickname}</span>
                        <span id="profile-active">active</span>
                      </div>
                    </ProfileModal>
                    <LogOutButton onClick={onClickLogout}>로그아웃</LogOutButton>
                  </Menu>
                ) : null}
              </>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {isLoading ? (
            <div>로딩 중...</div>
          ) : (
            userData.Workspaces.map((v) => {
              return (
                <Link key={v.id} to={`/workspace/${v.id}/channel/일반`}>
                  <WorkspaceButton>{v.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                </Link>
              );
            })
          )}
        </Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menu scroll</MenuScroll>
        </Channels>
        <Chats>{children}</Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
