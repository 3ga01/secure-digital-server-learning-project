import React from 'react';
import server from './server'; // Import your server instance here

function Wallet({ address, setAddress, balance, setBalance }) {
  async function onChange(evt) {
    const newAddress = evt.target.value;
    setAddress(newAddress);
    if (newAddress) {
      try {
        const response = await server.get(`balance/${newAddress}`);
        const { balance: newBalance } = response.data;
        setBalance(newBalance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
