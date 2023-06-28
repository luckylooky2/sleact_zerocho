// import React, { VFC } from 'react';
// import { ChatZone, Section, StickyHeader } from '@components/ChatList/style';
// import { Scrollbars } from 'react-custom-scrollbars-2';

// const ChatList: VFC = () => {
//   return (
//     <ChatZone>
//       <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
//         {Object.entries(chatSections).map(([date, chats]) => {
//           return (
//             <Section className={`section-${date}`} key={date}>
//               <StickyHeader>
//                 <button>{date}</button>
//               </StickyHeader>
//               {chats.map((chat) => (
//                 <Chat key={chat.id} data={chat} />
//               ))}
//             </Section>
//           );
//         })}
//       </Scrollbars>
//     </ChatZone>
//   );
// };

// export default ChatList;
