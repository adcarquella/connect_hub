import React, { useEffect, useState } from 'react';
import NFCPlugin from './plugins/nfc';

export default function NfcScreen() {
  const [nfcValue, setNfcValue] = useState<string>('Waiting for NFC...');

  useEffect(() => {
    let listener: { remove: () => void } | undefined;

    const setup = async () => {
      listener = await NFCPlugin.addListener('nfcTag', (event) => {
        console.log('NFC Event:', event);
        setNfcValue(event.text);
      });
    };

    setup();

    return () => {
      listener?.remove();
    };
  }, []);

  return (
    <div>
      <h1>NFC Value</h1>
      <pre>{nfcValue}</pre>
    </div>
  );
}
