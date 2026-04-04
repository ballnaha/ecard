import { pimPuConfig } from './clients/pim-pu';

const clientsData: Record<string, any> = {
  'pim-pu': pimPuConfig,
};

export const getClientData = (clientSlug: string) => {
  return clientsData[clientSlug] || null;
};
