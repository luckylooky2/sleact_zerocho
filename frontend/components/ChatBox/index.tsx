import React, { FC, useCallback, useRef, useEffect, RefObject, forwardRef, useState } from 'react';
import { Form, SendButton, Toolbox, MentionsTextarea, ChatArea, EachMention } from '@components/ChatBox/style';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
// react-mentions
// - 입력 창에서 @로 mention을 가능하게 하는 기능
// <MentionsInput />
// - inputRef : ref를 전달할 props 이름
// <Mention />
// - 반드시 MentionsInput가 부모 컴포넌트가 되어야 함
// - appendSpaceOnAdd : 입력을 완료했을 때, 마지막에 space 1개를 추가
// - trigger="@" : mention 기능을 시작할 trigger
// - allowSuggestionsAboveCursor : input box보다 위에 suggestion을 위치
import { Mention, SuggestionDataItem } from 'react-mentions';
import { IUser } from '@typings/db';
import gravatar from 'gravatar';

interface Props {
  chat: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholder: string;
}

// 여기서 DM 매시지 보내기 로직을 작성하면 안 됨!
// - 채널 컴포넌트에서도 이 ChatBox 컴포넌트를 _재사용할_ 것이기 때문
// - props를 이용하여 부모 컴포넌트에서 대신 처리하는 방법이 필요!
const ChatBox = forwardRef<HTMLTextAreaElement, Props>(({ chat, onSubmitForm, onChangeChat, placeholder }, ref) => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const [isMaxHeight, setIsMaxHeight] = useState(false);
  const { data: memberData } = useSWR<IUser[]>(
    `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/members`,
    fetcher,
  );
  const { data: userData } = useSWR<IUser | false>(`${process.env.REACT_APP_API_URL}/api/users`, fetcher);

  // https://velog.io/@corinthionia/JS-keydown%EC%97%90%EC%84%9C-%ED%95%9C%EA%B8%80-%EC%9E%85%EB%A0%A5-%EC%8B%9C-%EB%A7%88%EC%A7%80%EB%A7%89-%EC%9D%8C%EC%A0%88%EC%9D%B4-%EC%A4%91%EB%B3%B5-%EC%9E%85%EB%A0%A5%EB%90%98%EB%8A%94-%EA%B2%BD%EC%9A%B0-%ED%95%A8%EC%88%98%EA%B0%80-%EB%91%90-%EB%B2%88-%EC%8B%A4%ED%96%89%EB%90%98%EB%8A%94-%EA%B2%BD%EC%9A%B0
  const onKeyDownChat = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        if (e.nativeEvent.isComposing === false && !e.shiftKey) {
          e.preventDefault();
          onSubmitForm(e);
        }
      }
    },
    [onSubmitForm],
  );
  // useCallback 의존성 배열
  // - 콜백 함수 내에서 사용되는 외부 변수 / 함수는 무조건 넣어주는 것이 좋음

  // renderSuggestion?: ((suggestion: SuggestionDataItem, search: string, highlightedDisplay: React.ReactNode, index: number, focused: boolean) => React.ReactNode) | undefined;
  // - params : suggestion, search, highlightedDisplay, index, focused
  // - return : React.ReactNode

  // mention의 결과 : @[아잉눈](1)
  // - 다른 형식으로 바꿔주고 싶음 => 일정한 형식으로 되어 있으므로 regexify-string 라이브러리를 이용하여 일괄적으로 변환
  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focused: boolean,
    ): React.ReactNode => {
      if (!memberData) return;

      return (
        // focus props
        <EachMention focus={focused}>
          <img
            src={gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })}
            alt={memberData[index].nickname}
          />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [memberData],
  );

  // https://stackoverflow.com/questions/65876809/property-current-does-not-exist-on-type-instance-htmldivelement-null
  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      parseInt(ref.current.style.height, 10) >= 500 ? setIsMaxHeight(true) : setIsMaxHeight(false);
    }
  }, [chat]);

  if (!memberData || !userData) return null;

  // area-hidden="true"
  // - 해당 요소의 내용이 스크린리더에 읽히지 않도록 설정
  // - 일반적으로 대화형이 아닌 요소(e.g. 아이콘, 장식 요소) 또는 스크린리더에 의해 중복되거나 설명이 필요하지 않은 요소에 사용
  // - cf> 이 속성을 사용할 때, 접근성에 영향을 미치지 않는지 신중하게 판단해야 함

  // textarea, input 등 입력 태그 : [ value 속성, onChange 속성 ] 항상 같이 다님
  // - value 속성이 존재하지 않는다면? setChat('')을 통해 값이 바뀌지 않음
  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          placeholder={placeholder}
          onChange={onChangeChat}
          onKeyDown={onKeyDownChat}
          inputRef={ref}
          style={isMaxHeight ? { overflowY: 'auto' } : {}}
          forceSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={memberData?.map((v) => ({ id: v.id, display: v.nickname })) || []}
            renderSuggestion={renderSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            onClick={onSubmitForm}
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" area-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
});

export default ChatBox;

// 문제
// 1. 메시지를 전송하고 나서 setChat('') 후에도 textarea height가 그대로 유지
// - onSubmitForm 함수가 부모 컴포넌트로부터 props로 받았기 때문에
// - textRef를 부모 컴포넌트로 뺴고, forwardRef를 이용하여 props로 넘김
// - onSubmitForm에서 메시지 전송 후, textareaRef.current.style.height = '40px'로 원상 복구
// 2. autosize가 무작정 길어지는 현상
// - <MentionsTextarea /> max-height: 500px; 추가
// 3. overflow 속성이 없어 아래로 무한정 튀어나가는 문제
// - <MentionsTextarea /> overflow : auto 추가
// 4. <Mention />이 textarea 뒤에 위치해 가려지는 문제
// - 이유는 잘 모르겠지만, overflow 속성이 존재하면 안 됨
// - height : 0 ~ 500px일 때 => overflow 속성을 없애기
// - styled component의 props 기능을 이용하여 특정 조건에서 overflow 속성을 주기
// - 특정 조건은 useRef와 useState(isMaxHeight)를 이용하여 관리
