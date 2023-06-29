import React, { useCallback, VFC, useRef, useEffect } from 'react';
import Workspace from '@layouts/Workspace';
import { Container, Header } from '@pages/DirectMessage/style';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import axios from 'axios';
import ChatList from '@components/ChatList';
import { toast } from 'react-toastify';
import { IDM } from '@typings/db';
// ref를 이용하여 input, textarea 등 태그를 직접 css를 바꿔주는 라이브러리!
import autosize from 'autosize';

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
  const { data: chatData, mutate: mutateChatData } = useSWR<IDM[]>(
    `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/dms/${id}/chats?perPage=100&page=1`,
    fetcher,
  );
  const [chat, onChangeChat, setChat] = useInput('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, [chat]);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(
            `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/dms/${id}/chats`,
            { content: chat },
            { withCredentials: true },
          )
          .then((response) => {
            setChat('');
            if (textareaRef.current) {
              textareaRef.current.style.height = '40px';
            }
          })
          .catch((error) => {
            console.dir(error);
            toast.error('');
          });
      }
    },
    [chat],
  );

  if (!userData || !myData) return null;

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData?.nickname, { s: '36px', d: 'retro' })} alt={userData.email} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatData={chatData} />
      <ChatBox
        textareaRef={textareaRef}
        chat={chat}
        onSubmitForm={onSubmitForm}
        onChangeChat={onChangeChat}
        placeholder={`${userData.nickname}에 메시지 보내기`}
      />
    </Container>
  );
};

export default DirectMessage;
