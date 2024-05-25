import { useState } from 'react';
import Wallet, { BitcoinNetworkType, RpcErrorCode } from 'sats-connect';

type Props = {
  network: BitcoinNetworkType;
};

const SendBtc = ({ network }: Props) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [txnId, setTxnId] = useState('');

  const onClick = async () => {
    const response = await Wallet.request('sendTransfer', {
      recipients: [
        {
          address: address,
          amount: +amount,
        },
      ],
    });

    if (response.status === 'success') {
      setTxnId(response.result.txid);
      setAmount('');
      setAddress('');
    } else if (response.error.code === RpcErrorCode.USER_REJECTION) {
      alert('User cancelled the request');
    } else {
      console.error(response.error);
      alert('Error sending BTC. See console for details.');
    }
  };

  const explorerUrl =
    network === BitcoinNetworkType.Mainnet
      ? `https://mempool.space/tx/${txnId}`
      : `https://mempool.space/testnet/tx/${txnId}`;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-center">Send BTC</h2>
      </div>
      {!txnId && (
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Amount (sats)</label>
            <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <button onClick={onClick} disabled={!amount || !address} className="btn btn-primary">
            Send
          </button>
        </div>
      )}
      {txnId && (
        <div className="card-body">
          <div className="alert alert-success">
            Success! Click{' '}
            <a href={explorerUrl} target="_blank" rel="noreferrer">
              here
            </a>{' '}
            to see your transaction
          </div>
        </div>
      )}
    </div>
  );
};

export default SendBtc;
