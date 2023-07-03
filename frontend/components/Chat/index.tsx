import { IChat, IDM } from '@typings/db';
import React, { VFC, memo, useMemo } from 'react';
import { ChatWrapper } from '@components/Chat/style';
import gravatar from 'gravatar';
import { Link, useParams } from 'react-router-dom';
// regexify-string
// - 정규표현식에 관한 API를 제공해주는 라이브러리
import regexifyString from 'regexify-string';
// dayjs
// - immutable : 복사를 하는 경우, 참조 관계가 유지되지 않음
// - 가벼움
// - moment와 API와 비슷
// - vs. date-fns : Lodash 스타일
// - vs. Luxon : moment의 새로운 라이브러리
import dayjs from 'dayjs';

interface Props {
  data: IDM | IChat;
}

const Chat: VFC<Props> = ({ data }) => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  // 타입 가드
  // 1. in (js 문법) : 객체 안에 property가 존재하는지?
  // - Sender : dm에만 들어있는 속성
  // 2. if (typeof a === 'string') a.slice()... : if문으로 감싸주면, type을 알아서 추론
  const user = 'Sender' in data ? data.Sender : data.User;

  // \d : 숫자
  // * : 0개 이상
  // + : 1개 이상
  // ? : 0개나 1개

  // useMemo : regex가 의외로 성능이 안 좋기 때문에, caching(memoization)을 해주면 좋음
  const result = useMemo(() => {
    return regexifyString({
      input: data.content,
      pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
      decorator(match, index) {
        const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
        if (arr) {
          return (
            <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
              @{arr[1]}
            </Link>
          );
        }
        // \n을 줄바꿈 태그로 바꾸는 코드
        return <br key={index} />;
      },
    });
  }, [data.content]); // input(data.content)이 바뀔 때, result를 다시 계산

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.nickname, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

export default memo(Chat);
