import { IDM } from '@typings/db';

export default function addSingleChat(chatArray: IDM[][], newChat: IDM, count: number): IDM[][] {
  const newChatArray: IDM[][] = new Array<IDM[]>();

  const flatted = chatArray?.flat();
  if (flatted) {
    flatted.unshift(newChat); // 앞에 추가
    flatted.sort((a, b) => b.id - a.id);
    for (let i = 0; i < flatted.length; i += count) {
      const chunk = flatted.slice(i, i + count);
      newChatArray.push(chunk);
    }
  }

  return newChatArray;
}
