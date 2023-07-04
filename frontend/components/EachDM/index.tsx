import React, { VFC, useEffect } from 'react';
import { IUser } from '@typings/db';
import { NavLink, useParams } from 'react-router-dom';
import gravatar from 'gravatar';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useLocation } from 'react-router-dom';

interface Props {
  member: IUser;
  isOnline: boolean;
}

const EachDM: VFC<Props> = ({ member, isOnline }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>(`${process.env.REACT_APP_API_URL}/api/users`, fetcher, {
    revalidateOnMount: true,
  });
  const date = localStorage.getItem(`${workspace}-${member.id}`);
  const { data: count, mutate } = useSWR<number>(
    userData
      ? `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/dms/${member.id}/unreads?after=${date}`
      : null,
    fetcher,
  );

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/dm/${member.id}`) {
      mutate(0);
    }
  }, [location.pathname, workspace, member]);

  return (
    <NavLink
      key={member.id}
      activeStyle={{ fontWeight: 'bold', color: 'white' }}
      to={`/workspace/${workspace}/dm/${member.id}`}
    >
      <div style={{ position: 'relative', width: '35px', height: '30px' }}>
        <img
          className="c-base_icon c-base_icon--image"
          style={{ position: 'absolute', top: '0', left: '0' }}
          src={gravatar.url(member.nickname, { s: '25px', d: 'retro' })}
          alt={member.email}
        />

        <i
          className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
            isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
          }`}
          aria-hidden="true"
          data-qa="presence_indicator"
          data-qa-presence-self="false"
          data-qa-presence-active="false"
          data-qa-presence-dnd="false"
          style={{ top: '10px', left: '15px' }}
        />
      </div>
      <span className={count && count > 0 ? 'bold' : undefined}>{member.nickname}</span>
      {member.id === userData?.id && <span> (나)</span>}
      {(count && count > 0 && <span className="count">{count}</span>) || null}
    </NavLink>
  );
};

export default EachDM;
