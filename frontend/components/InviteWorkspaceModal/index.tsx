import React, { VFC, useState, useCallback } from 'react';
import Modal from '@components/Modal';
import { Label, Input, Button } from '@pages/SignUp/style';
import useInput from '@hooks/useInput';
import { useParams } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { IUser, IChannel } from '@typings/db';
import fetcher from '@utils/fetcher';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteWorkspaceModal: (flag: boolean) => void;
}

const InviteWorkspaceModal: VFC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser>('http://localhost:3095:/api/users', fetcher);
  // 워크스페이스의 멤버 목록을 최신화하는 mutate
  // **여기서 data를 가져오지 않아도, 모든 컴포넌트에서 캐시를 공유하기 때문에 다른 어떤 컴포넌트에서 그냥 data를 가져다 쓰면 됨!**
  // why mutate?
  // - SWR은 캐시된 데이터를 무효화하고 다시 data fetching
  // - => 데이터를 갱신하고 UI를 업데이트
  // - 새 멤버를 초대하면 서버로 요청을 보내고 성공적으로 응답이 오면 mutateWorkspaceMembers 함수를 호출하여 채널 데이터를 갱신
  // - **이를 통해 화면에 실시간으로 새 멤버가 추가된 채널 목록을 업데이트할 수 있음**
  // - 초대받은 유저는 일단 워크스페이스 또는 채널에 추가되는 방식
  const { mutate: mutateWorkspaceMembers } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  const [newMember, onChangeNewMember, setNewMember] = useInput('');

  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) return;
      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/members`,
          { email: newMember },
          { withCredentials: true },
        )
        .then((response) => {
          // response에서 받은 data로 추가하는 것은 아니고, 새로 요청을 하여 캐시를 업데이트
          mutateWorkspaceMembers();
          setShowInviteWorkspaceModal(false);
          setNewMember('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [workspace, newMember],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteWorkspaceModal;
