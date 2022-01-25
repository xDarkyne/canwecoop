import styles from 'styles/components/userCard.module.scss';
import { FunctionComponent } from 'react';
import Image from 'next/image';
import { User } from '@prisma/client';
import { useUser } from 'lib/hook';
import { trpc } from 'lib/trpc';

interface IProps {
  user: User & {
    followers: User[];
    following: User[];
  }
}

export const UserCard: FunctionComponent<IProps> = ({ user }) => {
  const [ currentUser ] = useUser();
  const utils = trpc.useContext();
  const follow = trpc.useMutation('follow', {
    onSuccess() { utils.invalidateQueries('allUsers'); }
  });
  const unfollow = trpc.useMutation('unfollow', {
    onSuccess() { utils.invalidateQueries('allUsers'); }
  });

  return(
    <li className={styles.userCard}>
      <Image className={styles.userImg} src={user.avatarfull} alt={user.displayName} height={64} width={64} />
      <h2>{user.displayName}</h2>
      { (currentUser && user.id != currentUser?.id)
        ? (user.followers.findIndex((f) => f.id = currentUser?.id) == -1)
          ? <button 
              className={`appBtn ${styles.flexBottom}`} 
              onClick={async(e) => follow.mutate({ id: user.id, currentId: currentUser.id })}>
                follow
            </button>
          : <button 
              className={`appBtn ${styles.flexBottom}`} 
              onClick={async(e) =>  unfollow.mutate({ id: user.id, currentId: currentUser.id })}>
                unfollow
            </button>
        : <></>
      }
    </li>
  );
};
