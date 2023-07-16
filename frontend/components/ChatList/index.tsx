import React, { useCallback, useRef, VFC, forwardRef, MutableRefObject, useState, useEffect } from 'react';
import { ChatZone, Loading, Section, StickyHeader } from '@components/ChatList/style';
// react-custom-scrollbars
// 진짜 화면의 스크롤은 없어지고, 가상 커스텀 스크롤을 만들어주는 라이브러리
// scroll bar : div 역할 => 가로로 배치되는 것을 처리
import { Scrollbars, positionValues } from 'react-custom-scrollbars';
import { IDM, IChat } from '@typings/db';
import Chat from '@components/Chat';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

// chatData는 없을 수도 있음
// optional chaning : undefined와 null을 걸러줌
// chatData && ~의 느낌
interface Props {
  chatSections?: { [key: string]: IDM[] | IChat[] };
  setSize: (size: number | ((_size: number) => number)) => Promise<IDM[][] | IChat[][] | undefined>;
  isEmpty: boolean;
  size: number | undefined;
  isReachingEnd: boolean;
}
// chat : 공통 컴포넌트이고, swr로부터 가져오는 데이터가 다르기 때문에 props로 결정
const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, size, isEmpty, isReachingEnd }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadedImageCount, setLoadedImageCount] = useState(0);
  let imageCount = 0;
  let timer: ReturnType<typeof setTimeout> | null;
  const stopper = useRef(false);

  // reverse infinite scrolling : 과거 채팅 불러오기 구현을 위해
  // - 원래는 아래 방향(infinite scrolling)으로 하는데, 채팅 특성 상 과거 데이터를 불러와야 하므로

  // ref를 부모 컴포넌트에서도 사용해야 하기 때문에
  // const scrollbarRef = useRef(null);

  // <Scrollbars /> react-custom-scrollbars 컴포넌트의 onScroll 이벤트
  // - 기본 onScroll 이벤트의 콜백 함수는 UIEventHandler type : (e : any) => void
  // - 이 라이브러리는 추가로 values parameter를 제공
  // - https://github.com/malte-wessel/react-custom-scrollbars/blob/master/docs/v2-documentation.md#customization

  // scrollTop 값이 크면, 0.1초 간격으로 호출하는 경우 연속으로 호출될 수 있음
  const handleScroll = (values: positionValues) => {
    timer = null;
    if (values.scrollTop < 300 && !isReachingEnd && !isEmpty && !stopper.current) {
      stopper.current = true;
      setTimeout(() => {
        stopper.current = false;
      }, 200);
      // data re-fetching
      setSize((prev: number) => prev + 1).then(() => {
        // 스크롤 위치 유지
        const current = (ref as MutableRefObject<Scrollbars>)?.current;
        if (current) {
          // refCopy 안의 values 객체 중에 scroll 관련 값들을 일일이 찾아봐야 함...
          // console.log(refCopy?.getScrollHeight(), values.scrollHeight);
          current.scrollTop(current?.getScrollHeight() - values.scrollHeight);
        }
      });
    }
  };

  const onScroll = (values: positionValues) => {
    if (!timer) {
      timer = setTimeout(() => {
        handleScroll(values);
      }, 100);
    }
  };

  const onLoad = useCallback(() => {
    setLoadedImageCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    Object.entries(chatSections!)
      .map((v) => v[1])
      .flat()
      .map((v) => {
        if (v.content.includes('upload')) imageCount++;
      });

    // 이미지가 하나라도 있을 때 || 이미지가 하나도 없을 때(chatSections가 {}일 때 제외)
    if ((imageCount && imageCount === loadedImageCount) || (Object.keys(chatSections!).length !== 0 && !imageCount)) {
      setIsOpen(true);
      if (size && size === 1) {
        const current = (ref as MutableRefObject<Scrollbars>)?.current;
        current?.scrollToBottom();
      }
      setLoadedImageCount(0);
    }
  }, [chatSections, loadedImageCount]);

  // 채팅 메시지 그룹화
  // - 날짜 등으로 그룹화되지 않은 raw data를 서버로 부터 받아옴
  // - 프런트에서 날짜별 그룹화를 진행

  // 프런트와 백의 알고리즘(데이터 가공)
  // - 프런트에서 알고리즘(데이터 가공 : 정렬, 그룹화, 구역 분할 등)을 많이 적용하는 추세
  // - 즉, 백에서는 데이터만 받아오고 프런트에서 알고리즘을 적용
  // 백에서 연산을 하는 방법
  // - 장점) 프런트에서 처리하기가 쉬움, 프런트보다는 보안에 강함
  // - 단점) 서버 본연의 역할에 영향이 갈 수도 있음
  // 프런트에서 연산을 하는 방법
  // - 장점) 일종의 분산 컴퓨팅(서버에 무리가 덜 감)
  // - 단점) 프런트는 보안에 취약함
  // 서버가 다운되면 모든 고객을 잃지만, 프런트 몇몇 브라우저에서 느리게 로딩되는 것은 소수의 고객에 한정될 수 있음
  // **결론 : 보안에 위협되지 않으면서, 브라우저에서 버벅되지 않을만큼 프런트에서 데이터 가공을 담당하는 것이 좋음!**

  // Array element 기준 반복문 : Array.map()
  // Object key 기준 반복문 : Object.entries().map()
  // - Object.entries() : 객체가 배열로 변환

  return (
    <ChatZone>
      {!isOpen ? <Loading /> : ''}
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
        {chatSections &&
          Object.entries(chatSections).map(([date, chats]) => {
            return (
              <Section className={`section-${date}`} key={date}>
                <StickyHeader>
                  <button>{dayjs(date).format('M월 D일 dddd')}</button>
                </StickyHeader>
                {chats?.map((chat, index) => (
                  <Chat onLoad={onLoad} key={chat.id + index} data={chat} />
                ))}
              </Section>
            );
          })}
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;
