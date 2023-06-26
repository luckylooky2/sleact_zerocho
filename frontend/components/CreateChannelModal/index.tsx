import React, { VFC, useCallback } from 'react';
import Modal from '@components/Modal';
import { Label, Input, Button } from '@pages/SignUp/style';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { IUser, IChannel } from '@typings/db';
import fetcher from '@utils/fetcher';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  // useParams를 이용하여 state 줄이기
  // 주소 자체가 어느 정도 데이터를 저장하는 역할을 함!
  // 즉, 따로 상태 관리를 해줄 필요가 없기 때문에 관리할 요소가 줄어듦
  // - 워크스페이스, 채널을 옮길 때마다 어디에 있는지 상태에 저장하고 수정해야 하는데
  // - 주소에서 데이터를 가져올 수 있으므로 신경 쓸 요소가 줄어들게 됨
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const {
    // destructuring alias
    // - import { Redirect as R } from "react-router" 도 가능
    data: userData,
    isLoading,
    error,
    mutate,
  } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher, {
    revalidateOnMount: true,
  });

  const { data: channelData, mutate: mutateChannelData } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
    {
      revalidateOnMount: true,
    },
  );

  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/channels`,
          { name: newChannel },
          { withCredentials: true },
        )
        .then((response) => {
          setShowCreateChannelModal(false);
          // GET 요청 보내지 않고 update
          mutateChannelData([...channelData!, response.data], { revalidate: false });
          setNewChannel('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newChannel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널 이름</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
