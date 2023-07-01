import React, { useCallback, VFC, useRef, useEffect, useState, RefObject } from 'react';
import Workspace from '@layouts/Workspace';
import { Container, Header } from '@pages/DirectMessage/style';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import fetcher from '@utils/fetcher';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import axios from 'axios';
import ChatList from '@components/ChatList';
import { toast } from 'react-toastify';
import { IDM } from '@typings/db';
// ref를 이용하여 input, textarea 등 태그를 직접 css를 바꿔주는 라이브러리!
import autosize from 'autosize';
import makeSection from '@utils/makeSection';
import { Scrollbars } from 'react-custom-scrollbars';

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
  // useSWRInfinite
  // - 1. 첫 번째 인자 : 함수화, params(index : 계속 증가하면서 새로운 페이지를 가져오는 역할)
  // - 2. setSize : setState와 비슷한 역할! 페이지 수(state)를 바꿔주는 역할, type : (size: number | ((_size: number) => number)) => Promise<IDM[][] | undefined>
  // - 3. return data type이 2차원 배열(페이지마다 배열 추가) : 새로 불러오는 페이지를 push_front()
  // - 4. 아래 두 변수를 선언해주면 좋음
  // - 1) const isEmpty = chatData?.[0]?.length === 0;
  // - 데이터를 가져왔는데, 비어있는 경우
  // - 2) const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20);
  // - 데이터를 가져오려는 양보다 적게 데이터를 가져오는 경우(isEmpty === true ? isReachingEnd === true)
  // - e.g.
  // - 40 = 20 + 20 + 0 (isEmpty : true, isReachingEnd : true)
  // - 45 = 20 + 20 + 5 (isEmpty : false, isReachingEnd : true)
  const {
    data: chatData,
    mutate: mutateChatData,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index: number) =>
      `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const [chat, onChangeChat, setChat] = useInput('');

  const isEmpty = chatData?.[0]?.length === 0;
  // undefined가 될 수 있기 때문에 뒤에 || false 추가
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // https://velog.io/@cnsrn1874/%EB%B2%88%EC%97%AD-callback-refs-%EC%82%AC%EC%9A%A9%EC%9C%BC%EB%A1%9C-useEffect-%EB%B0%A9%EC%A7%80%ED%95%98%EA%B8%B0
  // Callback ref를 이용하여, 렌더링 이후에 DOM 노드에 실행시킬 작업을 콜백 함수로 만드는 방법
  // - 어느 정도 문제는 해결되었지만, 현재 컴포넌트에서 사용할 ref object를 생성하지 못함
  // - 일단 사용할 수는 없는 듯
  // const scrollbarRef = useRef<Scrollbars>(null);
  // callback 함수에서 나중에 state로 설정!
  const [scrollbarRefCopy, setScrollbarRefCopy] = useState<Scrollbars>();
  // 이 방식은 callback 함수에서 복사할 수 없음. why?
  // let scrollbarRef: any;

  const scrollbarRefCallback = useCallback(
    (node) => {
      if (node !== null) {
        setScrollbarRefCopy(node);
        // 이 방식은 callback 함수에서 복사할 수 없음. why?
        // scrollbarRef = node;
        if (chatData?.length === 1) {
          node.scrollToBottom();
        }
      }
    },
    [chatData],
  );

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, [chat]);

  // 여기서 ref가 연결된 이후에 다시 렌더링시키지 못하기 때문에
  // - 직접적인 해결방법은 아니지만, 비슷한 state를 넣는 방법?
  // -
  // useEffect(() => {
  //   console.log('useEffect : ', chatData, chatData?.length);
  //   if (chatData?.length === 1) {
  //     scrollbarRef.current?.scrollToBottom();
  //     console.log(scrollbarRef.current?.getClientHeight());
  //   }
  // }, [chatData]);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        // optimistic UI
        // UI에 추가 => 요청 => revalidate
        const savedChat = chat;
        mutateChatData(
          (prevChatData) => {
            // prevChatData?.[0] : 가장 최신 데이터
            // unshift() : 중에서도 가장 최신 데이터
            prevChatData?.[0].unshift({
              id: (chatData[0][0]?.id || 0) + 1,
              content: savedChat,
              SenderId: myData.id,
              Sender: myData,
              ReceiverId: userData.id,
              Receiver: userData,
              createdAt: new Date(),
            });
            return prevChatData;
          },
          // optimistic UI할 때는 shouldRevalidate should be false
          { revalidate: false },
        ).then(() => {
          setChat('');
          if (textareaRef.current) {
            textareaRef.current.style.height = '40px';
          }
          scrollbarRefCopy?.scrollToBottom();
        });
        axios
          .post(
            `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/dms/${id}/chats`,
            { content: savedChat },
            { withCredentials: true },
          )
          .then((response) => {
            mutateChatData();
          })
          .catch((error) => {
            console.dir(error);
            toast.error(error.response?.data, { position: 'bottom-center' });
          });
      }
    },
    [chat, chatData, myData, userData, workspace, id],
  );

  // Array.reverse() : mutable(기존 배열이 바뀌는 불상사) => [...chatData].reverse()
  // Array<Array>.flat() : 2차원 배열을 1차원 배열로 immutable하게 바꿔주는 메서드
  const chatSections = makeSection(
    chatData
      ? chatData
          .flat()
          // .reverse()
          .sort((a, b) => a.id - b.id) // id 오름차순 정렬
      : [],
  );

  if (!userData || !myData) return null;

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData?.nickname, { s: '36px', d: 'retro' })} alt={userData.email} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList
        ref={scrollbarRefCallback}
        refCopy={scrollbarRefCopy}
        chatSections={chatSections}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox
        ref={textareaRef}
        chat={chat}
        onSubmitForm={onSubmitForm}
        onChangeChat={onChangeChat}
        placeholder={`${userData.nickname}에 메시지 보내기`}
      />
    </Container>
  );
};

export default DirectMessage;
