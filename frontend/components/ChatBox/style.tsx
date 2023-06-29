import styled from '@emotion/styled';
// MentionsInput : react-mentions에서 제공하는 컴포넌트
// 사용 방법
// - Mention의 부모 컴포넌트는 반드시 MentionsInput이어야 함!
// - e.g. <MentionsInput><Mention></Mention></MentionsInput>;
import { MentionsInput } from 'react-mentions';

export const ChatArea = styled.div`
  display: flex;
  width: 100%;
  padding: 20px;
  padding-top: 0;
`;

export const Form = styled.form`
  color: rgb(29, 28, 29);
  font-size: 15px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid rgb(29, 28, 29);
`;

// styled.textarea`` : <textarea> 태그에 css 적용
// styled(MentionsInput)`` : 기존에 있는 컴포넌트에다가 css 적용!
export const MentionsTextarea = styled(MentionsInput)<{ isMaxHeight: boolean }>`
  font-family: Slack-Lato, appleLogo, sans-serif;
  font-size: 15px;
  padding: 8px 9px;
  width: 100%;
  max-height: 500px;

  ${({ isMaxHeight }) =>
    isMaxHeight &&
    `
    overflow : auto;
`};

  & strong {
    background: skyblue;
  }

  & textarea {
    height: 40px;
    overflow: auto;
    padding: 9px 10px !important;
    outline: none !important;
    border-radius: 4px !important;
    resize: none !important;
    line-height: 22px;
    border: none;
  }

  & ul {
    border: 1px solid lightgray;
    max-height: 200px;
    overflow-y: auto;
    padding: 9px 10px;
    background: white;
    border-radius: 4px;
    width: 150px;
  }
`;

export const Toolbox = styled.div`
  position: relative;
  background: rgb(248, 248, 248);
  height: 41px;
  display: flex;
  border-top: 1px solid rgb(221, 221, 221);
  align-items: center;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;

export const SendButton = styled.button`
  position: absolute;
  right: 5px;
  top: 5px;
`;

// 1. emotion에서도 변수 사용 가능!
// - 원래 css에서는 변수를 사용하기 위해서는 모든 경우의 수를 클래스로 만들었음
// - focus === true ? 코드를 추가 : 코드를 제외

// 2. js에서 함수 호출 방법
// - 1) foo(); foo.call(); foo.apply(); foo.bind()();
// - 2) foo``; tagged template literal(`` string parameter)
// - 템플릿 리터럴이기 때문에 이런 식으로도 가능 : foo`${() => {}}`; foo`${() => `${() => ``}`}`;
// - e.g. styled.button : styled 객체 안에 있는 함수(메서드)
export const EachMention = styled.button<{ focus: boolean }>`
  padding: 4px 20px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  color: rgb(28, 29, 28);
  width: 100%;

  & img {
    margin-right: 5px;
  }

  ${({ focus }) =>
    focus &&
    `
    background: #1264a3;
    color: white;
  `};
`;
