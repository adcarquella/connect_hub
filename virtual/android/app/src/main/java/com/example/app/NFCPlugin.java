package com.example.app; // use your package

import android.content.Intent;
import android.nfc.NdefMessage;
import android.nfc.NdefRecord;
import android.nfc.NfcAdapter;
import android.os.Parcelable;
import android.util.Base64;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;

@CapacitorPlugin(name = "NFCPlugin")
public class NFCPlugin extends Plugin {

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");
        JSObject ret = new JSObject();
        ret.put("value", value);
        call.resolve(ret);
    }

    // Called by Capacitor when an Activity receives a new intent
    @Override
    protected void handleOnNewIntent(Intent intent) {
        super.handleOnNewIntent(intent);
        handleIntent(intent);
    }

    // Also parse the intent if the plugin is created after the intent arrived
    @Override
    public void handleOnStart() {
        super.handleOnStart();
        Intent intent = getActivity().getIntent();
        if (intent != null) handleIntent(intent);
    }

    private void handleIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();

        if (NfcAdapter.ACTION_NDEF_DISCOVERED.equals(action) ||
            NfcAdapter.ACTION_TAG_DISCOVERED.equals(action) ||
            NfcAdapter.ACTION_TECH_DISCOVERED.equals(action)) {

            Parcelable[] rawMsgs = intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES);
            if (rawMsgs != null) {
                // For simplicity handle first NDEF message and first record
                NdefMessage msg = (NdefMessage) rawMsgs[0];
                NdefRecord[] records = msg.getRecords();
                if (records != null && records.length > 0) {
                    NdefRecord record = records[0];
                    // Try to extract payload as text
                    byte[] payload = record.getPayload();
                    String text = parseTextRecord(payload);
                    // Notify JS
                    JSObject data = new JSObject();
                    data.put("text", text);
                    notifyListeners("nfcTag", data);
                }
            } else {
                // No NDEF messages — optionally handle raw tag bytes
                JSObject data = new JSObject();
                data.put("text", "no NDEF message found");
                notifyListeners("nfcTag", data);
            }
        }
    }

    private String parseTextRecord(byte[] payload) {
        try {
            // Simple NDEF text record parser (UTF-8/UTF-16 aware)
            int languageCodeLength = payload[0] & 0x3F;
            String textEncoding = ((payload[0] & 0x80) == 0) ? "UTF-8" : "UTF-16";
            return new String(payload, 1 + languageCodeLength, payload.length - 1 - languageCodeLength, textEncoding);
        } catch (Exception e) {
            // Fallback: base64 encode
            return Base64.encodeToString(payload, Base64.NO_WRAP);
        }
    }
}
