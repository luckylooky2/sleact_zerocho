import React from 'react';
import Workspace from '@layouts/Workspace';
import { Container, Header } from '@pages/Channel/style';

// children props : Workspace 컴포넌트 안에 있는 JSX
// 굳이 props로 명시하지 않아도 됨!
const Channel = () => {
  return (
    <Workspace>
      <Container>
        <Header>채널</Header>
      </Container>
    </Workspace>
  );
};

export default Channel;