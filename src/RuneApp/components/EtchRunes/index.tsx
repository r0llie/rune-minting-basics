import { useMemo, useState } from 'react';
import Wallet, { Address, AddressPurpose, BitcoinNetworkType } from 'sats-connect';

type Props = {
  network: BitcoinNetworkType;
  addresses: Address[];
};

const EtchRunes = ({ addresses, network }: Props) => {
  const [totalCost, setTotalCost] = useState<number>();
  const [totalSize, setTotalSize] = useState<number>();
  const [fundTxId, setFundTxId] = useState<string>('');
  const [runeName, setRuneName] = useState<string>('');
  const [feeRate, setFeeRate] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [preMine, setPreMine] = useState<string>('');
  const [divisibility, setDivisibility] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [mintCap, setMintCap] = useState<string>('');
  const [turbo, setTurbo] = useState<boolean>();
  const [reserveSupply, setReserveSupply] = useState<boolean>();
  const [blockLimit, setBlockLimit] = useState<boolean>();
  const [heightStart, setHeightStart] = useState<string>('');
  const [heightEnd, setHeightEnd] = useState<string>('');



  const ordinalsAddress = useMemo(
    () => addresses.find((a) => a.purpose === AddressPurpose.Ordinals)?.address || '',
    [addresses]
  );

  const paymentAddress = useMemo(
    () => addresses.find((a) => a.purpose === AddressPurpose.Payment)?.address || '',
    [addresses]
  );

  const onClickEstimate = async () => {
    const response = await Wallet.request('runes_estimateEtch', {
      destinationAddress: ordinalsAddress,
      feeRate: +feeRate,
      symbol: symbol || undefined,
      premine: preMine || undefined,
      divisibility: +divisibility || undefined,
      terms:
        amount || mintCap
          ? {
              amount: amount || undefined,
              cap: mintCap || undefined,
            }
          : undefined,
      isMintable: true,
      runeName: runeName,
      network: network,
    });

    if (response.status === 'success') {
      setTotalCost(response.result.totalCost);
      setTotalSize(response.result.totalSize);
    } else {
      console.error(response.error);
      alert('Error Fetching Estimate. See console for details.');
    }
  };

  const onClickExecute = async () => {
    const response = await Wallet.request('runes_etch', {
      destinationAddress: ordinalsAddress,
      symbol: symbol || undefined,
      premine: preMine || undefined,
      terms:
        amount || mintCap
          ? {
              amount: amount || undefined,
              cap: mintCap || undefined,
            }
          : undefined,
      feeRate: +feeRate,
      isMintable: true,
      runeName,
      refundAddress: paymentAddress,
      network,
    });

    if (response.status === 'success') {
      setFundTxId(response.result.fundTransactionId);
    } else {
      console.error(response.error);
      alert('Error sending BTC. See console for details.');
    }
  };

  const fundTxLink =
    network === BitcoinNetworkType.Mainnet
      ? `https://mempool.space/tx/${fundTxId}`
      : `https://mempool.space/testnet/tx/${fundTxId}`;

  return (
    <>
    <div className="card">
        <div className="container">
          <h2 className="text-center my-4">Etching Runes</h2>
          <div className="mb-3">
            <label className="form-label">Rune Ticker</label>
            <input type="text" className="form-control" value={runeName} onChange={(e) => setRuneName(e.target.value)} />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Decimals</label>
              <input type="number" min="0" max="38" className="form-control" value={divisibility} onChange={(e) => setDivisibility(e.target.value)} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Symbol</label>
              <input type="text" maxLength={1} className="form-control" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Max Supply</label>
              <input type="number" className="form-control" value={mintCap} onChange={(e) => setMintCap(e.target.value)} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Limit Per Mint</label>
              <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={turbo} onChange={(e) => setTurbo(e.target.checked)} />
                <label className="form-check-label">Turbo</label>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={reserveSupply} onChange={(e) => setReserveSupply(e.target.checked)} />
                <label className="form-check-label">Reserve Supply</label>
              </div>
              {reserveSupply && (
                <div className="mt-2">
                  <label className="form-label">Premine</label>
                  <input type="text" className="form-control" value={preMine} onChange={(e) => setPreMine(e.target.value)} />
                </div>
              )}
            </div>
            <div className="col-md-4 mb-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={blockLimit} onChange={(e) => setBlockLimit(e.target.checked)} />
                <label className="form-check-label">Block Limit</label>
              </div>
              {blockLimit && (
                <div className="mt-2">
                  <label className="form-label">Starting Block</label>
                  <input type="text" className="form-control" value={heightStart} onChange={(e) => setHeightStart(e.target.value)} />
                  <label className="form-label">Ending Block</label>
                  <input type="text" className="form-control" value={heightEnd} onChange={(e) => setHeightEnd(e.target.value)} />
                </div>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Fee (sats/vb)</label>
            <input type="number" className="form-control" value={feeRate} onChange={(e) => setFeeRate(e.target.value)} />
          </div>
          <button className="button" onClick={onClickEstimate} disabled={!runeName || !feeRate}>
            Estimate
          </button>
        </div>


      {totalCost && (
        <div className="card">
          <div>
            <h3>Rune Name</h3>
            <p className="success">{runeName}</p>
          </div>
          <div>
            <h3>Total Cost (sats) - Total Size</h3>
            <p className="success">
              {totalCost} - {totalSize}
            </p>
          </div>
          <button onClick={onClickExecute}>Execute Etch</button>
          {fundTxId && (
            <div className="success">
              Success! Click{' '}
              <a href={fundTxLink} target="_blank" rel="noreferrer">
                here
              </a>{' '}
              to see your transaction
            </div>
          )}
        </div>
      )}
      </div>
    </>
  );
};

export default EtchRunes;
