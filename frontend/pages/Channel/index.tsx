import React, { useCallback } from 'react';
import Workspace from '@layouts/Workspace';
import { Container, Header } from '@pages/Channel/style';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import useInput from '@hooks/useInput';
import ChatBox from '@components/ChatBox';

// children props : Workspace 컴포넌트 안에 있는 JSX
// 굳이 props로 명시하지 않아도 됨!
const Channel = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(
    `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/users/${id}`,
    fetcher,
  );
  const { data: myData } = useSWR(`${process.env.REACT_APP_API_URL}/api/users`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    setChat('');
  }, []);

  if (!userData || !myData) return null;

  return (
    <Container>
      <Header>채널</Header>
      <ChatBox
        chat={chat}
        onSubmitForm={onSubmitForm}
        onChangeChat={onChangeChat}
        placeholder={`${userData.nickname}에 메시지 보내기`}
      />
    </Container>
  );
};

export default Channel;
