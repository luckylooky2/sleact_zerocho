import { IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { VFC, useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { CollapseButton } from '@components/DMList/style';
import { NavLink } from 'react-router-dom';
import useSocket from '@hooks/useSocket';
import gravatar from 'gravatar';

// userData : 왜 swr로 가져오지 않고, props로 가져오나?
// - 어떤 컴포넌트더라도 useSWR을 사용한다고 다시 요청하지 않기 떄문에, useSWR을 사용해도 상관 없음
// interface Props {
//   userData?: IUser;
// }

// redux useSelector()처럼 요즘은 hooks를 이용할 수 있기 떄문에, **데이터를 넘겨주기 위한 용도**로 props를 사용하지 않음
// - hooks를 통해서 데이터를 바로 받아올 수 있는데(useSelector, useSWR ...)
// - 뭐하러 container에서 state를 받아서 props로 다시 넘겨주는 복잡한 과정을..?
// - 즉, presentational and container 패턴을 사용하지 않아도 됨
// - 그에 따라, 부모 컴포넌트와의 연결고리가 많이 끊어진 추세(리렌더링 관련하여 덜 신경을 쓸 수 있는 효과, 최적화)
// - High order component(HOC, 고차 컴포넌트, 다른 컴포넌트를 감싸는 컴포넌트)도 마찬가지로 줄어든 추세
// - ***HOC의 역할? 감싼 컴포넌트에 props를 넣어주는 역할!***
// - 이젠 props 없이도 원하는 데이터를 가져올 수 있기 때문에, HOC의 역할도 줄어듦
// props의 다른 용도? 기본적으로 다른 값으로 같은 컴포넌트를 만들기 위함

const DMList: VFC = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser>(`${process.env.REACT_APP_API_URL}/api/users`, fetcher, {
    revalidateOnMount: true,
  });
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  // const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<{ [key: string]: number }>({});
  const [onlineList, setOnlineList] = useState<number[]>([]);
  // hooks로 관리되는 것이기 떄문에, 필요한 때에 불러서 사용할 수 있음
  const [socket] = useSocket(workspace);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  const resetCount = useCallback(
    (id) => () => {
      setCountList((list) => {
        return {
          ...list,
          [id]: 0,
        };
      });
    },
    [],
  );

  const onMessage = useCallback(() => {}, [workspace]);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    socket?.on('dm', onMessage);
    console.log('socket on dm', socket?.hasListeners('dm'), socket);
    return () => {
      // on 과 off는 반드시 짝을 이루자!
      // 그렇지 않으면, on 이벤트가 중첩될 수 있기 때문에 예상과 다른 결과가 나올 수 있음
      socket?.off('dm', onMessage);
      console.log('socket off dm', socket?.hasListeners('dm'));
      socket?.off('onlineList');
    };
  }, [socket]);

  // slack은 className에 따라 image를 바뀌게 조절
  // 마찬가지로 isOnline에 따라 className을 컨트롤
  // count : 나중에 DM이 올 때, 몇 개 왔는지 표시

  // Link vs. NavLink
  // - Link : <a> 태그처럼 href path로 이동시키는 역할
  // - NavLink : Link 태그 + **activeClassName"을 사용할 수 있음
  // - 지금 라우팅 === href의 주소라면, activeClassName CSS가 활성화

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return (
              <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
                <div style={{ position: 'relative', width: '35px', height: '30px' }}>
                  <img
                    style={{ position: 'absolute', top: '0', left: '0' }}
                    src={gravatar.url(member.nickname, { s: '25px', d: 'retro' })}
                    alt={member.email}
                  />
                  <i
                    style={{ position: 'absolute', bottom: '0', right: '-4' }}
                    className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                      isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                    }`}
                    aria-hidden="true"
                    data-qa="presence_indicator"
                    data-qa-presence-self="false"
                    data-qa-presence-active="false"
                    data-qa-presence-dnd="false"
                  />
                </div>
                <span>{member.nickname}</span>
                {member.id === userData?.id && <span> (나)</span>}
                {/* {(count && count > 0 && <span className="count">{count}</span>) || null} */}
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default DMList;
