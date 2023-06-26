import React, { CSSProperties, FC, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from '@components/Menu/style';

// props type
// - typescript에서 props를 사용하게 되면, props에 대한 type을 지정해주어야 함!
// - javascipt에서 Menu.propTypes = {} 했던 것과 동일한 개념

// 2. type interface를 작성
interface Props {
  show: boolean;
  onCloseModal: (e: any) => void; // 어쩔 수 없이 any 사용? ts 컴파일러의 추천
  style: CSSProperties;
  closeButton?: boolean; // ?
}

// 1. props 자리에 props 작성
// 3. generic을 이용하여 FC<Props>로 컴포넌트와 props를 연결 => Props.show 이렇게 사용하지 않는 방법!
const Menu: FC<Props> = ({ children, style, show, onCloseModal, closeButton }) => {
  // 부모 컴포넌트를 누르면, 모달이 닫혀야 함 => <CreateMenu onClick={onCloseModal}>
  // 자신의 컴포넌트를 누르면, 닫히지 않고 로직이 실행되어야 함 => <div onClick={stopPropagation} style={style}>
  // - 이벤트 버블링 : div(자식)를 클릭하면 CreateMenu(부모)까지 클릭 이벤트가 전달됨
  // - <div>를 클릭했는데도 <CreateMenu>의 onCloseModal 함수가 실행되는 문제가 발생
  // - why? 자식 영역이 부모 영역의 일부이기 때문?
  // - e.stopPropagation()을 이용 : 부모 컴포넌트로 이벤트가 전달되지 않음
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // &times;
  // HTML 엔티티 : HTML에서 특정 캐릭터들이 예약되어있기 때문에 표기의 혼란을 막기 위해서 사용
  // &nbsp;( ), &times;(x), &lt;(<) 등...
  // https://blog.outsider.ne.kr/380

  // Menu 컴포넌트 밖에서 { show ? <Menu /> : null } 와 같은 효과
  if (!show) return null;

  return (
    // <div onClick={stopPropagation}>
    <CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
    // </div>
  );
};

// defaultProps Object
// - **컴포넌트에 props를 넣어주지 않아도, 기본적으로 props를 넣어 줌**
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
