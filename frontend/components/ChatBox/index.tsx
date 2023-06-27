import React, { VFC, useCallback } from 'react';
import { Form, SendButton, Toolbox, MentionsTextarea } from '@components/ChatBox/style';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';

interface Props {
  chat: string;
}

// 여기서 DM 매시지 보내기 로직을 작성하면 안 됨!
// - 채널 컴포넌트에서도 이 ChatBox 컴포넌트를 _재사용할_ 것이기 때문
// - props를 이용하여 부모 컴포넌트에서 대신 처리하는 방법이 필요!
const ChatBox: VFC<Props> = ({ chat }) => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(
    `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/users/${id}`,
    fetcher,
  );
  const { data: myData } = useSWR(`${process.env.REACT_APP_API_URL}/api/users`, fetcher);

  if (!userData || !myData) return null;

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
  }, []);

  // area-hidden="true"
  // - 해당 요소의 내용이 스크린리더에 읽히지 않도록 설정
  // - 일반적으로 대화형이 아닌 요소(e.g. 아이콘, 장식 요소) 또는 스크린리더에 의해 중복되거나 설명이 필요하지 않은 요소에 사용
  // - cf> 이 속성을 사용할 때, 접근성에 영향을 미치지 않는지 신중하게 판단해야 함

  // Form 컴포넌트 : 크기를 정해주는 스타일 컴포넌트
  return (
    <Form onSubmit={onSubmitForm}>
      <MentionsTextarea>
        <textarea placeholder={`${userData.nickname}에 메시지 보내기`} />
      </MentionsTextarea>
      <Toolbox>
        <SendButton>
          <i className="c-icon c-icon--paperplane-filled" area-hidden="true" />
        </SendButton>
      </Toolbox>
    </Form>
  );
};

export default ChatBox;
