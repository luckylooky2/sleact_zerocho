import { IChat, IDM } from '@typings/db';

export default function combineOldNewChats<T extends IChat | IDM>(chatData: T[][], newChatData: T[]) {
  const added: T[][] = new Array<T[]>();

  added.push([...newChatData].sort((a, b) => b.id - a.id));
  chatData.map((v) => added.push(v.sort((a, b) => b.id - a.id)));

  return added;
}
