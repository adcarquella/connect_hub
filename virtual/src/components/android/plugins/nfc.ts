import { registerPlugin } from '@capacitor/core';

export interface NfcPlugin {
  addListener(
    eventName: 'nfcTag',
    listenerFunc: (event: { text: string }) => void
  ): Promise<{ remove: () => void }>;
}

const NFCPlugin = registerPlugin<NfcPlugin>('NFCPlugin');

export default NFCPlugin;
