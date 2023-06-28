import React, { VFC, useCallback, useRef, useEffect, ElementRef } from 'react';
import { Form, SendButton, Toolbox, MentionsTextarea } from '@components/ChatBox/style';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
// ref를 이용하여 input, textarea 등 태그를 직접 css를 바꿔주는 라이브러리!
import autosize from 'autosize';

interface Props {
  chat: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholder: string;
}

// 여기서 DM 매시지 보내기 로직을 작성하면 안 됨!
// - 채널 컴포넌트에서도 이 ChatBox 컴포넌트를 _재사용할_ 것이기 때문
// - props를 이용하여 부모 컴포넌트에서 대신 처리하는 방법이 필요!
const ChatBox: VFC<Props> = ({ chat, onSubmitForm, onChangeChat, placeholder }) => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(
    `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/users/${id}`,
    fetcher,
  );
  const { data: myData } = useSWR(`${process.env.REACT_APP_API_URL}/api/users`, fetcher);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onKeyDownChat = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          onSubmitForm(e);
        }
      }
    },
    [onSubmitForm],
  );
  // useCallback 의존성 배열
  // - 콜백 함수 내에서 사용되는 외부 변수 / 함수는 무조건 넣어주는 것이 좋음

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  if (!userData || !myData) return null;

  // area-hidden="true"
  // - 해당 요소의 내용이 스크린리더에 읽히지 않도록 설정
  // - 일반적으로 대화형이 아닌 요소(e.g. 아이콘, 장식 요소) 또는 스크린리더에 의해 중복되거나 설명이 필요하지 않은 요소에 사용
  // - cf> 이 속성을 사용할 때, 접근성에 영향을 미치지 않는지 신중하게 판단해야 함

  // textarea, input 등 입력 태그 : [ value 속성, onChange 속성 ] 항상 같이 다님
  // - value 속성이 존재하지 않는다면? setChat('')을 통해 값이 바뀌지 않음
  return (
    <Form onSubmit={onSubmitForm}>
      <MentionsTextarea
        value={chat}
        placeholder={placeholder}
        onChange={onChangeChat}
        onKeyDown={onKeyDownChat}
        ref={textareaRef}
      />
      <Toolbox>
        <SendButton onClick={onSubmitForm}>
          <i className="c-icon c-icon--paperplane-filled" area-hidden="true" />
        </SendButton>
      </Toolbox>
    </Form>
  );
};

export default ChatBox;
