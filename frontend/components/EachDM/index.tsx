// import React, { VFC } from 'react';
// import { IUser } from '@typings/db';
// import { NavLink, useParams } from 'react-router-dom';

// interface Props {
//   member: IUser;
//   isOnline: boolean;
// }

// const EachDM: VFC<Props> = ({ member, isOnline }) => {
//   const { workspace } = useParams<{ workspace: string }>();

//   return (
//     <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
//       <i
//         className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
//           isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
//         }`}
//         aria-hidden="true"
//         data-qa="presence_indicator"
//         data-qa-presence-self="false"
//         data-qa-presence-active="false"
//         data-qa-presence-dnd="false"
//       />
//       <span className={count && count > 0 ? 'bold' : undefined}>{member.nickname}</span>
//       {member.id === userData?.id && <span> (나)</span>}
//       {(count && count > 0 && <span className="count">{count}</span>) || null}
//     </NavLink>
//   );
// };

// export default EachDM;
