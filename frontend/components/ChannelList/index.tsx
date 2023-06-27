import React, { VFC, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';
import { IUser, IChannel } from '@typings/db';
import { CollapseButton } from '@components/DMList/style';
import fetcher from '@utils/fetcher';

const ChannelList: VFC = ({}) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser>(`${process.env.REACT_APP_API_URL}/api/users`, fetcher, {
    revalidateOnMount: true,
  });
  const { data: channelData } = useSWR<IChannel[]>(
    userData ? `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );
  // const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState(false);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Channels</span>
      </h2>
      <div>
        {!channelCollapse &&
          channelData?.map((channel) => {
            return (
              <NavLink
                key={channel.name}
                activeClassName="selected"
                to={`/workspace/${workspace}/channel/${channel.name}`}
              >
                <span># {channel.name}</span>
                {/* {count !== undefined && count > 0 && <span className="count">{count}</span>} */}
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default ChannelList;
