import styled from '@emotion/styled';

export const RightMenu = styled.div`
  // 요소를 좌우 방향으로 부유(floating)시키는 데 사용, 주변 요소는 요소의 오른쪽을 피해서 배치
  // { none, left, right }
  // cf> 부유된 요소의 부모 요소가 부유된 요소를 감싸지 않는 경우, 부모 요소는 부유된 요소를 인식하지 못하고 무시할 수 있음에 주의
  // 일반적으로 레이아웃에 float 속성을 사용하는 것보다 다른 방식을 선호하는 경향이 있음
  float: right;
`;

export const Header = styled.header`
  height: 38px; // 고정
  background: #350d36;
  color: #ffffff;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.1);
  padding: 5px;
  text-align: center;
`;

export const ProfileImg = styled.img`
  width: 28px;
  height: 28px;
  position: absolute;
  top: 5px;
  right: 16px;
`;

export const ProfileModal = styled.div`
  display: flex;
  padding: 20px;

  & img {
    display: flex;
  }

  & > div {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }

  & #profile-name {
    font-weight: bold;
    display: inline-flex;
  }

  & #profile-active {
    font-size: 13px;
    display: inline-flex;
  }
`;

export const LogOutButton = styled.button`
  border: none;
  width: 100%;
  border-top: 1px solid rgb(29, 28, 29);
  background: transparent;
  display: block;
  height: 33px;
  padding: 5px 20px 5px;
  outline: none;
  cursor: pointer;
`;

export const WorkspaceWrapper = styled.div`
  // flex-direction : row가 default => row 방향
  display: flex;
  // 하나의 flex 아이템이 자신의 컨테이너가 차지하는 공간에 맞추기 위해 크기를 키우거나 줄이는 방법을 설정하는 속성
  // flex-grow, flex-shrink, flex-basis의 단축 속성
  // flex-grow : 요소가 자신이 속한 플렉스 컨테이너 내에서의 비율. 다른 flex-grow 값이 설정된 형제 요소들과 비율에 따라 크기가 조절
  // flex-shrink : 요소가 자신의 컨텐츠가 플렉스 컨테이너 내에서 가용 공간을 초과할 경우, 자동으로 축소되도록 허용. 값이 커질수록 축소 비율이 커짐
  // flex-basis : 요소가 플렉스 컨테이너 내에서 가용한 공간을 모두 차지할 수 있도록 함
  flex: 1;
`;

// display: flex
// - 플렉스 컨테이너는 블록 레벨 요소로 취급
// - 기본적으로 가로 방향으로 최대 너비를 차지
// - 컨테이너의 너비를 초과하는 플렉스 아이템이 있을 경우, 줄 바꿈이 발생하지 않고 컨테이너 내에서 너비를 분배

// display: inline-flex
// - 플렉스 컨테이너는 인라인 레벨 요소로 취급
// - 컨텐츠의 너비에 맞게 축소. 즉, 컨테이너의 크기는 내부 요소에 따라 동적으로 결정
// - 플렉스 컨테이너는 줄 바꿈이 가능하며, 컨테이너의 너비를 초과하는 플렉스 아이템은 다음 줄로 이동

// vertical-align : trp
// - https://developer.mozilla.org/ko/docs/Web/CSS/vertical-align
export const Workspaces = styled.div`
  width: 65px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: #3f0e40;
  border-top: 1px solid rgb(82, 38, 83);
  border-right: 1px solid rgb(82, 38, 83);
  vertical-align: top;
  text-align: center;
  padding: 15px 0 0;
`;

// nav 태그
// 문서의 부분 중 현재 페이지 내, 또는 다른 페이지로의 링크를 보여주는 구획을 나타냄
// 자주 쓰이는 예제는 메뉴, 목차, 색인
export const Channels = styled.nav`
  width: 260px;
  display: inline-flex;
  flex-direction: column;
  background: #3f0e40;
  color: rgb(188, 171, 188);
  vertical-align: top;

  & a {
    padding-left: 36px;
    color: inherit;
    text-decoration: none;
    height: 28px;
    line-height: 28px;
    display: flex;
    align-items: center;

    &.selected {
      color: white;
    }
  }

  & .bold {
    color: white;
    font-weight: bold;
  }

  & .count {
    margin-left: auto;
    background: #cd2553;
    border-radius: 16px;
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    height: 18px;
    line-height: 18px;
    padding: 0 9px;
    color: white;
    margin-right: 16px;
  }

  & h2 {
    height: 36px;
    line-height: 36px;
    margin: 0;
    // 요소 내의 텍스트가 요소의 너비를 초과하는 경우, 초과된 텍스트를 생략 부호(...)로 표시하는 기능을 제공
    // 조건
    // 1. 요소는 일련의 텍스트를 포함하는 블록 레벨 요소여야 합니다. (예: <div>, <p>, <span> 등)
    // 2. 요소는 고정된 너비를 가져야 합니다. (예: width 속성으로 너비를 설정)
    // 3. 요소에 overflow: hidden; 속성을 함께 설정하여 초과된 텍스트를 감출 수 있도록 해야 합니다.
    text-overflow: ellipsis;
    // 초과된 텍스트 감추기
    overflow: hidden;
    // 텍스트를 한 줄로 유지
    white-space: nowrap;
    font-size: 15px;
  }
`;

export const WorkspaceName = styled.button`
  height: 64px;
  line-height: 64px;
  border: none;
  width: 100%;
  text-align: left;
  border-top: 1px solid rgb(82, 38, 83);
  border-bottom: 1px solid rgb(82, 38, 83);
  font-weight: 900;
  font-size: 24px;
  background: transparent;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0;
  padding-left: 16px;
  margin: 0;
  color: white;
  cursor: pointer;
`;

export const MenuScroll = styled.div`
  // 요소의 높이를 뷰포트의 100%에서 102픽셀을 뺀 값으로 설정하는 것을 의미
  // 요소의 높이가 뷰포트의 높이에 반응하면서 상단 또는 하단에 고정된 102픽셀의 여백을 가짐
  // 즉, 동적으로 값을 계산하면 뷰포트 크기에 따라 요소의 높이를 조정할 수 있음
  height: calc(100vh - 102px);
  overflow-y: auto;
`;

export const WorkspaceModal = styled.div`
  padding: 10px 0 0;

  & h2 {
    padding-left: 20px;
  }

  // 부모 요소의 직접적인 자식으로 있는 <button> 요소를 선택하는 선택자
  // > 기호는 자식 선택자를 나타내며, 부모 요소의 직계 자식 요소만 선택
  // 아무 기호가 없는 경우 부모 요소 내에서 모든 <button> 요소를 선택하는 선택자
  & > button {
    width: 100%;
    height: 28px;
    padding: 4px;
    border: none;
    background: transparent;
    border-top: 1px solid rgb(28, 29, 28);
    cursor: pointer;

    // :last-of-type 선택자는 해당 유형의 요소 중에서 가장 마지막으로 나타나는 요소를 선택하는 데 사용
    &:last-of-type {
      border-bottom: 1px solid rgb(28, 29, 28);
    }
  }
`;

export const Chats = styled.div`
  flex: 1;
`;

export const AddButton = styled.button`
  color: white;
  font-size: 24px;
  display: inline-block;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
`;

// display: inline-block
// - 인라인과 블록의 중간 형태로 요소를 조정할 수 있어 다양한 레이아웃 상황에서 유연하게 사용될 수 있음
// - 요소를 인라인 박스(inline box)처럼 취급하면서도 블록 박스(block box)처럼 동작하도록 설정
// - 1. 인라인 요소처럼 줄 바꿈 없이 나란히 배치되지만, 동시에 블록 요소처럼 너비와 높이, 여백 등을 설정할 수 있음
// - 2. 인라인 요소인 <span>과 같은 요소에도 너비와 높이를 설정할 수 있게 해주어 레이아웃을 유연하게 조정할 수 있음
// - 3. margin, padding 등 박스 모델 속성을 적용할 수 있음
// https://developer.mozilla.org/ko/docs/Web/CSS/display
export const WorkspaceButton = styled.button`
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: white;
  border: 3px solid #3f0e40;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 700;
  color: black;
  cursor: pointer;
`;
