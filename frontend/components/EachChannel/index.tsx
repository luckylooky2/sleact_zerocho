import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useEffect, VFC } from 'react';
import { useParams } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import useSWR from 'swr';

interface Props {
  channel: IChannel;
}
const EachChannel: VFC<Props> = ({ channel }) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>(`${process.env.REACT_APP_API_URL}/api/users`, fetcher, {
    revalidateOnMount: true,
  });
  const date = localStorage.getItem(`${workspace}-${channel.name}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData
      ? `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/channels/${channel.name}/unreads?after=${date}`
      : null,
    fetcher,
  );

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/channel/${channel.name}`) {
      mutate(0);
    }
  }, [mutate, location.pathname, workspace, channel]);

  return (
    <NavLink
      key={channel.name}
      activeStyle={{ fontWeight: 'bold', color: 'white' }}
      to={`/workspace/${workspace}/channel/${channel.name}`}
    >
      <span className={count !== undefined && count > 0 ? 'bold' : undefined}># {channel.name}</span>
      {count !== undefined && count > 0 && <span className="count">{count}</span>}
    </NavLink>
  );
};

export default EachChannel;
