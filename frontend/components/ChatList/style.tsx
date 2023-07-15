import styled from '@emotion/styled';

export const ChatZone = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  position: relative;
`;

export const Loading = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
  background-color: white;
`;

export const Section = styled.section`
  margin-top: 20px;
  border-top: 1px solid #eee;
`;

// position : sticky
// - 평소에는 일반 요소처럼 있다가, 특정 높이가 되면(화면에서 나가면) fixed 처럼 바뀜
// - e.g. 슬랙에서 날짜 표시가 위로 올라가면 상단에 붙는 효과
export const StickyHeader = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  width: 100%;
  position: sticky;
  top: 20px;

  & button {
    font-weight: bold;
    font-size: 13px;
    height: 28px;
    line-height: 27px;
    padding: 0 16px;
    z-index: 2;
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 0 0 1px var(--saf-0), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
    border-radius: 24px;
    position: relative;
    top: -13px;
    background: white;
    border: none;
    outline: none;
  }
`;
