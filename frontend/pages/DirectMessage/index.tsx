import React, { VFC } from 'react';
import Workspace from '@layouts/Workspace';
import { Container, Header } from '@pages/DirectMessage/style';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import ChatBox from '@components/ChatBox';

// http 요청을 보냈는데 JSON이 아니라 html이 오는 경우?
// - 1. 404 : 없는 리소스에 요청한 경우
// - 2. 304 : 성공했는데 html로 오는 경우여도 없는 리소스일 가능성이 높음

const DirectMessage: VFC = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(
    `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/users/${id}`,
    fetcher,
  );
  const { data: myData } = useSWR(`${process.env.REACT_APP_API_URL}/api/users`, fetcher);

  if (!userData || !myData) return null;

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData?.nickname, { s: '36px', d: 'retro' })} alt={userData.email} />
        <span>{userData.nickname}</span>
      </Header>
      {/* <ChatList /> */}
      <ChatBox chat="" />
    </Container>
  );
};

export default DirectMessage;
