import styled from '@emotion/styled';

// collapse button : 접었다 폈다하는 버튼
// 아래와 같은 방법으로 props에 따라 css를 다르게 구성할 수 있음
export const CollapseButton = styled.button<{ collapse: boolean }>`
  background: transparent;
  border: none;
  width: 26px;
  height: 26px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-left: 10px;
  cursor: pointer;

  // 조건부 CSS 스타일을 적용하기 위한 템플릿 리터럴 문법
  // true인 경우 i 요소의 transform 스타일이 초기화
  ${({ collapse }) =>
    collapse &&
    `
    & i {
      transform: none;
    }
  `};
`;
