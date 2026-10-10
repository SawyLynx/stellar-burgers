import { selectUser } from '@/services/slices/userSlice';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(selectUser);
  const userName = user ? user.name : '';

  return <AppHeaderUI userName={userName} />;
};
