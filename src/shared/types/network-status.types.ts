import { NETWORK_STATUS } from '@/shared/constants/network-status';

export type NetworkStatus = (typeof NETWORK_STATUS)[keyof typeof NETWORK_STATUS];
