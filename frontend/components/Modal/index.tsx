import React, { FC, useCallback } from 'react';
import { CloseModalButton, CreateModal } from '@components/Modal/style';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  closeButton?: boolean; // ?
}

// Menu 컴포넌트와 거의 비슷 => stopPropagation(), show, onCloseModal props
// 차이점 => 보이는 위치가 다름
const Modal: FC<Props> = ({ show, children, onCloseModal, closeButton }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // modal이 처음에는 보이지 않는 이유
  if (!show) return null;

  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateModal>
  );
};

Modal.defaultProps = {
  closeButton: true,
};

export default Modal;
