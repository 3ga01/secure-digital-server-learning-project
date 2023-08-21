import { useState } from "react";
import server from "./server";
import { secp256k1 as secp } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

async function signMessage(message, privateKey) {
  const msgHash = keccak256(message);
  const signature = secp.sign(msgHash, privateKey);
  return {
    r: toHex(signature.signature.slice(0, 32)),
    s: toHex(signature.signature.slice(32, 64)),
    v: signature.recovery + 27,
  };
}

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const nonce = Date.now().toString(16); // Convert to hexadecimal string
      const message = JSON.stringify({
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        nonce,
      });

      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        nonce,
        // signature
      });

      setBalance(balance);
    } catch (ex) {
      console.error("Error:", ex); // Add this line to log the error object
      // alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
