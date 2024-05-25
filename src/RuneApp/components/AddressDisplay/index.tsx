import { Address, BitcoinNetworkType } from 'sats-connect';

type Props = {
  network: BitcoinNetworkType;
  addresses: Address[];
  onDisconnect: () => void;
};

const AddressDisplay = ({ network, addresses, onDisconnect }: Props) => {
  return (
    <div className="card">
      <div className="card-header">
        <h5>Connected Addresses - ({network})</h5>
      </div>
      <ul className="list-group list-group-flush">
        {addresses.map((address) => (
          address.purpose !== 'stacks' && (
            <li key={address.purpose} className="list-group-item">
              <small>
                <strong>{address.purpose}:</strong> {address.address}
              </small>
            </li>
          )
        ))}
      </ul>
      <div className="card-footer">
        <button onClick={onDisconnect} className="btn btn-primary">Disconnect</button>
      </div>
    </div>
  );
};

export default AddressDisplay;
