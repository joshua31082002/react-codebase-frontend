import { NETWORK_STATUS } from '@/shared/constants/network-status';
import type { NetworkStatus } from '@/shared/types/network-status.types';
import { useEffect, useState } from 'react';

export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus>(NETWORK_STATUS.ONLINE);

  const handleNetworkStatusChange = ({ type }: Event) => {
    setStatus(type === NETWORK_STATUS.ONLINE ? NETWORK_STATUS.ONLINE : NETWORK_STATUS.OFFLINE);
  };

  useEffect(() => {
    window.addEventListener('online', handleNetworkStatusChange);
    window.addEventListener('offline', handleNetworkStatusChange);

    return () => {
      window.removeEventListener('online', handleNetworkStatusChange);
      window.removeEventListener('offline', handleNetworkStatusChange);
    };
  }, []);

  return {
    status,
  };
};
