import React, { useCallback, VFC, useRef, useEffect, useState, RefObject, useMemo } from 'react';
import Workspace from '@layouts/Workspace';
import { Container, Header } from '@pages/Channel/style';
import { useParams } from 'react-router';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import fetcher from '@utils/fetcher';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import axios from 'axios';
import ChatList from '@components/ChatList';
import { toast } from 'react-toastify';
import { IChannel, IChat, IUser } from '@typings/db';
import autosize from 'autosize';
import makeSection from '@utils/makeSection';
import { Scrollbars } from 'react-custom-scrollbars';
import useSocket from '@hooks/useSocket';
import combineOldNewChats from '@utils/combineOldNewChats';
import InviteChannelModal from '@components/InviteChannelModal';
import { DragOver } from '@pages/Channel/style';

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [newChatData, setNewChatData] = useState<IChat[]>([]);

  const { data: myData } = useSWR(`${process.env.REACT_APP_API_URL}/api/users`, fetcher);
  const {
    data: chatData,
    mutate: mutateChatData,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index: number) =>
      `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${
        index + 1
      }`,
    fetcher,
    { revalidateOnFocus: false },
  );
  const { data: channelData } = useSWR<IChannel>(
    `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/channels/${channel}`,
    fetcher,
    { revalidateOnFocus: false },
  );
  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
    { revalidateOnFocus: false },
  );
  const [socket] = useSocket(workspace);
  const [chat, onChangeChat, setChat] = useInput('');
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [scrollbarRefCopy, setScrollbarRefCopy] = useState<Scrollbars>();

  const scrollbarRefCallback = useCallback(
    (node) => {
      if (node !== null) {
        setScrollbarRefCopy(node);
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

  useEffect(() => {
    setNewChatData([]);
  }, [channel, chatData]);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData && channelData) {
        const savedChat = chat;
        mutateChatData(
          (prevChatData) => {
            setNewChatData((prevNewChatData) => [
              {
                id: (prevNewChatData.length !== 0 ? prevNewChatData[0]?.id : chatData[0][0]?.id || 0) + 1,
                content: savedChat,
                UserId: myData.id,
                User: myData,
                ChannelId: channelData.id,
                Channel: channelData,
                createdAt: new Date(),
              },
              ...prevNewChatData,
            ]);
            return prevChatData;
          },
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
            `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/channels/${channel}/chats`,
            { content: savedChat },
            { withCredentials: true },
          )
          .then((response) => {
            // mutateChatData();
          })
          .catch((error) => {
            console.dir(error);
            toast.error(error.response?.data, { position: 'bottom-center' });
          });
      }
    },
    [chat, chatData, myData, channelData, workspace, channel],
  );

  const chatSections = useMemo(
    () =>
      makeSection(
        chatData
          ? combineOldNewChats(chatData, newChatData)
              .flat()
              .sort((a, b) => a.id - b.id)
          : [],
      ),
    [chatData, newChatData],
  );

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  const onMessage = useCallback(
    (data: IChat) => {
      // image chat은 optimistic UI가 적용되어 있지 않기 때문에
      if (data.Channel.name === channel && (data.content.startsWith('uploads/') || myData?.id !== data.UserId)) {
        mutateChatData(
          (prevChatData) => {
            console.log(data);
            setNewChatData((prevNewChatData) => [data, ...prevNewChatData]);
            return prevChatData;
          },
          { revalidate: false },
        ).then(() => {
          if (scrollbarRefCopy) {
            if (
              scrollbarRefCopy.getScrollHeight() <
              scrollbarRefCopy.getClientHeight() + scrollbarRefCopy.getScrollTop() + 150
            ) {
              console.log('scrollToBottom!', scrollbarRefCopy.getValues());
              scrollbarRefCopy.scrollToBottom();
            }
          }
        });
      }
    },
    [channel, myData],
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      console.log(e);
      // 서버로 _파일_을 보낼 떄는, JSON이 아니라 FormData를 많이 사용
      const formData = new FormData();
      // 브라우저마다 dataTransfer.items, files에 있는지 다름
      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === 'file') {
            const file = e.dataTransfer.items[i].getAsFile();
            console.log('... file[' + i + '].name = ' + file.name);
            // 하나의 formData에 여러 image file을 저장
            formData.append('image', file);
          } else return;
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
          formData.append('image', e.dataTransfer.files[i]);
        }
      }
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/channels/${channel}/images`, formData)
        .then(() => {
          setDragOver(false);
          mutateChatData();
        });
    },
    [workspace, channel],
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind !== 'file') return;
      }
    }
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  useEffect(() => {
    socket?.on('message', onMessage);

    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, onMessage]);

  if (!myData) return null;

  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
      <Header>
        <span>#{channel}</span>
        <div className="header-right">
          <span>{channelMembersData?.length}</span>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
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
        placeholder={`#${channel}에 메시지 보내기`}
      />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
      {dragOver && <DragOver onDragLeave={onDragLeave}>드래그 앤 드롭하여 업로드!</DragOver>}
    </Container>
  );
};

export default Channel;
