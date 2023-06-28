import { IDM } from '@typings/db';
import React, { VFC } from 'react';
import { ChatWrapper } from '@components/Chat/style';
import gravatar from 'gravatar';
// dayjs
// - immutable : 복사를 하는 경우, 참조 관계가 유지되지 않음
// - 가벼움
// - moment와 API와 비슷
// - vs. date-fns : Lodash 스타일
// - vs. Luxon : moment의 새로운 라이브러리
import dayjs from 'dayjs';

interface Props {
  data: IDM;
}

const Chat: VFC<Props> = ({ data }) => {
  const user = data.Sender;

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{data.content}</p>
      </div>
    </ChatWrapper>
  );
};

export default Chat;
