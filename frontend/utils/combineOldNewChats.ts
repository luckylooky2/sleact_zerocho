import { IDM } from '@typings/db';

export default function combineOldNewChats(chatData: IDM[][], newChatData: IDM[]) {
  const added: IDM[][] = new Array<IDM[]>();

  added.push([...newChatData].sort((a, b) => b.id - a.id));
  chatData.map((v) => added.push(v.sort((a, b) => b.id - a.id)));

  return added;
}
