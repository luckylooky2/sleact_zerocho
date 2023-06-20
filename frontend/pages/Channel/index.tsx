import React from 'react';
import Workspace from '@layouts/Workspace';

// children props : Workspace 컴포넌트 안에 있는 JSX
// 굳이 props로 명시하지 않아도 됨!
const Channel = () => {
  return (
    <Workspace>
      <div>로그인 하신 것을 축하드려요!</div>
    </Workspace>
  );
};

export default Channel;
