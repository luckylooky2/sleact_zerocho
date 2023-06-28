import React, { useCallback, useRef, VFC } from 'react';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/style';
// react-custom-scrollbars
// 진짜 화면의 스크롤은 없어지고, 가상 커스텀 스크롤을 만들어주는 라이브러리
// scroll bar : div 역할 => 가로로 배치되는 것을 처리
import { Scrollbars } from 'react-custom-scrollbars';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';

// chatData는 없을 수도 있음
// optional chaning : undefined와 null을 걸러줌
// chatData && ~의 느낌
interface Props {
  chatData?: IDM[];
}
// chat : 공통 컴포넌트이고, swr로부터 가져오는 데이터가 다르기 때문에 props로 결정
const ChatList: VFC<Props> = ({ chatData }) => {
  // 과거 채팅 불러오기 구현을 위해
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {/* {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats?.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })} */}
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
