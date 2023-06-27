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
  AddButton,
  WorkspaceModal,
} from '@layouts/Workspace/style';
import { Redirect, Switch, Route, useParams } from 'react-router';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import gravatar from 'gravatar';
import Menu from '@components/Menu';
import { IUser, IChannel, IWorkspace } from '@typings/db';
import { Label, Button, Input } from '@pages/SignUp/style';
import useInput from '@hooks/useInput';
import Modal from '@components/Modal';
import CreateChannelModal from '@components/CreateChannelModal';
// 토스트처럼 튀어나오는 알림 라이브러리 : 사용자들로 하여금 error를 인지하게 하기 위해
import { toast } from 'react-toastify';
import DirectMessage from '@pages/DirectMessage';
import Channel from '@pages/Channel';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import InviteChannelModal from '@components/InviteChannelModal';

// Workspace layout
// 다른 컴포넌트들을 감싸는 컴포넌트라고 생각하면 될 듯?
// children props : 미래에 <Workspace></Workspace> 안에 들어갈 JSX
// when?
// - **같은 layout 안에 각각 다른 내용을 넣고 싶을 때 유용!**
// - props로 다른 컴포넌트를 넘기는 방법보다 깔끔한 듯

// FC : FunctionComponent => children을 사용하는 컴포넌트 type
// VFC : VoidFunctionComponent => children을 쓰지 않는 컴포넌트 type
const Workspace: FC = ({ children }) => {
  const { workspace } = useParams<{ workspace: string }>();
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
  } = useSWR<IUser | false>(`${process.env.REACT_APP_API_URL}/api/users`, fetcher, {
    revalidateOnMount: true,
  });

  console.log(userData);

  // swr 조건부 요청
  // e.g. userData ? "" : null
  // - userData가 없으면(로그인하지 않았으면) swr이 요청을 보내지 않음
  const { data: channelData } = useSWR<IChannel[]>(
    userData ? `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/channels` : null,
    fetcher,
    {
      revalidateOnMount: true,
    },
  );

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  // input 태그는 따로 컴포넌트화하는 것을 추천!
  // why? 보통 onChange와 같이 쓰이는데, 입력할 때마다 리렌더링 되기 때문에
  // 최대한 적은 JSX를 리렌더링하는 방향으로!
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newURL, onChangeNewURL, setNewURL] = useInput('');

  const onClickLogout = useCallback(() => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/users/logout`, null, {
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
  const onClickProfileMenu = useCallback((e) => {
    // 문제
    // - 같은 함수를 사용하다보니, 이벤트 버블링이 발생하여 span 태그에서도 함수 호출 => 2번 호출
    // 해결
    // 1. 여기서 e.stopPropagation(); => type 변경 필요
    // 2. Menu를 감싸는 <div onClick={stopPropagation} />

    // console.trace('click'); // 호출한 함수를 trace
    e.stopPropagation();
    setShowProfileMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  // 모든 모달 닫기
  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
    setShowInviteChannelModal(false);
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      // React form 태그에서는 항상 preventDefault => SPA, 새로고침되지 않게!
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newURL || !newURL.trim()) return;

      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/workspaces`,
          { workspace: newWorkspace, url: newURL },
          { withCredentials: true }, // 로그인 된 상태임을 알기 위한 조건
        )
        .then((response) => {
          if (userData)
            mutate({ ...userData, Workspaces: [...userData.Workspaces, response.data] }, { revalidate: false });
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewURL('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newURL],
  );

  const toggleWorkspaceMenu = useCallback(() => {
    setShowWorkspaceMenu((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowWorkspaceMenu((prev) => !prev);
    setShowCreateChannelModal(true);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowWorkspaceMenu((prev) => !prev);
    setShowInviteWorkspaceModal(true);
  }, []);

  // SWR의 핵심
  // - 클라이언트 측에서 데이터를 가져오고 캐싱하는 역할
  // - 캐싱은 클라이언트 측에서 이루어지는 메모리 또는 로컬 스토리지에 데이터를 저장하여 중복 요청을 방지하고 응답 속도를 향상시키는 기능
  // Server-side routing과 useSWR
  // - Server-side routing(주소 창 or 새로고침을 이용하여 백엔드에 직접 요청을 보내는 경우)에서는 useSWR의 캐싱 기능을 이용할 수 없음
  // - why? 클라이언트 측에서 요청을 하고 응답을 받아 캐싱하는 방식으로 동작하기 때문
  // - 즉, store에 값이 있던 말던 요청을 무조건 다시 보낸다는 뜻 => userData === undefined가 되는 경우 때문에 로직이 꼬임
  // - /workspace/dm으로 접속 => userData가 처음에는 undefined => login 페이지 redirect => userData fetching 완료 => /workspace/channel로 가는 문제 발생
  // 해결?
  // - isLoading === true 인 경우 : 각각 컴포넌트에서 loading 화면
  // - loading이 된 이후
  // - 1. userData === false 인 경우(로그인 세션 존재하지 않을 때) : login 페이지으로 redirect
  // - 2. userData === { ... } 인 경우(로그인 세션이 존재하여 data fetching) : /workspace/dm 페이지에 남아 있음
  if (!isLoading && !userData) {
    return <Redirect to="/login" />;
  }

  // 1. 아래 userData가 falsy 값이 아님을 알려주는 역할
  // 2. loading이 끝났고, userData === false인 경우에는 화면에 아무것도 띄우지 않음
  if (!userData) return null;

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
                      <img src={gravatar.url(userData?.nickname, { s: '36px', d: 'mp' })} alt={userData.email} />
                      <div>
                        <span id="profile-name">{userData?.nickname}</span>
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
            // 문제
            // - 처음 로그인을 하고 DB에서 data를 불러오는 경우, Workspaces 프로퍼티가 존재하지 않음 : {id: 1, nickname: '아잉눈', email: 'luckylooky2@naver.com'}
            // - userData?.Workspaces === undefined 여서 발생하는 문제
            // 해결
            // ? : Optional Chaining Operator(Javascript 문법)
            // 만약 userData?.Workspaces.map() 이라면, Workspaces === null | undefined 일 경우 런타임 에러가 발생
            // 1. userData?.Workspaces && userData?.Workspaces.map()
            // 2. userData?.Workspaces?.map()
            // **즉, ?는 앞에 조건문을 붙여서 해당 값이 null | undefined 인 경우에 뒤에 코드를 아예 실행시키지 않는다고 생각하면 됨!**
            // - 과정) login 때 받아온 정보 => Workspaces가 없으면 => re-fetching => userData 최신화?
            userData?.Workspaces?.map((v) => {
              return (
                <Link key={v.id} to={`/workspace/${v.url}/channel/일반`}>
                  <WorkspaceButton>{v.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                </Link>
              );
            })
          )}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceMenu}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceMenu} onCloseModal={toggleWorkspaceMenu} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onClickLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            {channelData?.map((v) => (
              <div>{v.name}</div>
            ))}
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 URL</span>
            <Input id="workspace" value={newURL} onChange={onChangeNewURL} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </div>
  );
};

// to-do : CreateWorkspaceModal 분리하기

export default Workspace;
