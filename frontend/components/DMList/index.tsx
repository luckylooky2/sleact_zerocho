import { IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { VFC, useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { CollapseButton } from '@components/DMList/style';
import { NavLink } from 'react-router-dom';
import useSocket from '@hooks/useSocket';
import gravatar from 'gravatar';
import EachDM from '@components/EachDM';

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
// - HOC는 컴포넌트를 입력으로 받아 새로운 기능을 추가하거나 변형한 컴포넌트를 반환하는 함수
// - 컴포넌트 간의 코드 재사용과 추상화를 달성할 수 있음
// - 이젠 props 없이도 원하는 데이터를 가져올 수 있기 때문에, HOC의 역할도 줄어듦
// - data 상태와 데이터 가져오기 로직을 관리
// - 기존 방식
// function withDataFetching(WrappedComponent) {
//   return class extends React.Component {
//     state = {
//       data: null,
//       loading: true,
//       error: null,
//     };

//     componentDidMount() {
//       fetchData()
//         .then((data) => {
//           this.setState({ data, loading: false });
//         })
//         .catch((error) => {
//           this.setState({ error, loading: false });
//         });
//     }

//     render() {
//       const { data, loading, error } = this.state;
//       if (loading) {
//         return <LoadingSpinner />;
//       } else if (error) {
//         return <ErrorMessage error={error} />;
//       } else {
//         // data 상태를 WrappedComponent로 전달하기 위해 props를 사용
//         return <WrappedComponent data={data} {...this.props} />;
//       }
//     }
//   };
// }

// withDataFetching HOC를 사용하여 데이터를 가져오는 컴포넌트를 실제로 생성
// const DataComponent = withDataFetching(MyComponent);

// props로 전달된 데이터를 사용하여 컴포넌트의 렌더링 로직을 작성
// HOC에서 가져온 데이터를 컴포넌트에서 활용할 수 있음
// function MyComponent(props) {
//   const { data } = props;
//   // 데이터를 사용하는 나머지 컴포넌트의 렌더링 로직
//   return <div>{data}</div>;
// }

// - hook
// useSWR을 사용하면 HOC 패턴을 대체할 수 있으며, 데이터 가져오기와 관련된 로직을 더욱 간편하게 처리할 수 있음
// function MyComponent() {
//   const { data, error } = useSWR('/api/data', fetcher);

//   if (error) {
//     return <ErrorMessage error={error} />;
//   }

//   if (!data) {
//     return <LoadingSpinner />;
//   }

//   // 데이터를 사용하는 나머지 컴포넌트의 렌더링 로직
//   return <div>{data}</div>;
// }

// - hook을 통해 컴포넌트 로직을 재사용 가능한 함수로 분리하는 커스텀 hook을 작성할 수 있음
// - 이러한 커스텀 hook은 고차 함수와 비슷한 역할을 수행할 수 있음
// - 컴포넌트 간에 로직을 공유하거나 추상화하여 재사용할 수 있는 함수형 단위로 분리할 수 있음

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
        return { ...list, [id]: 0 };
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

  // 안 읽은 채팅 표시
  // - 어떤 시점까지 읽었는지, 그 시점 이후 몇 개가 쌓였는지를 알아야 함
  // - 1. 이떤 시점까지 읽었는지를 방에 들어갈 때마다 저장(업데이트) 해야 함 => DB? localStorage? 선택
  // - 2. 해당 시점을 기준으로 몇 개가 쌓였는지 API 요청을 통해 받아올 수 있음
  // - EachChannel, EachDM 컴포넌트로 분리
  // - => unreads API 호출 => count를 보여줌

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
            return <EachDM key={'member' + member.id} member={member} isOnline={isOnline} />;
          })}
      </div>
    </>
  );
};

export default DMList;
