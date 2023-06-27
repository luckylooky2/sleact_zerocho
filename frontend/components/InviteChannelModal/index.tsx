import React, { useCallback, VFC } from 'react';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/style';
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
  setShowInviteChannelModal: (flag: boolean) => void;
}

const InviteChannelModal: VFC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');

  const { data: userData } = useSWR<IUser>(`${process.env.REACT_APP_API_URL}:/api/users`, fetcher);
  // 채널의 멤버 목록을 최신화하는 mutate
  // **여기서 data를 가져오지 않아도, 모든 컴포넌트에서 캐시를 공유하기 때문에 다른 어떤 컴포넌트에서 그냥 data를 가져다 쓰면 됨!**
  const { mutate: mutateChannelMembers } = useSWR<IChannel[]>(
    userData ? `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback((e) => {
    e.preventDefault();
    if (!newMember || !newMember.trim()) return;
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/workspaces/${workspace}/channels/${channel}/member`,
        { email: newMember },
        { withCredentials: true },
      )
      .then((response) => {
        // response에서 받은 data로 추가하는 것은 아니고, 새로 요청을 하여 캐시를 업데이트
        mutateChannelMembers();
        setShowInviteChannelModal(false);
        setNewMember('');
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, []);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>채널 멤버 초대</span>
          <Input id="member" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;
