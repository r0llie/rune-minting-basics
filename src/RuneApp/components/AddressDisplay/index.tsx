import { Address, BitcoinNetworkType } from 'sats-connect';
import { useState } from 'react';

type Props = {
  network: BitcoinNetworkType;
  addresses: Address[];
  onDisconnect: () => void;
};

const AddressDisplay = ({ network, addresses, onDisconnect }: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`card ${isExpanded ? 'expanded' : ''}`} onClick={handleCardClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Bağlı Adresler - ({network})</h3>
        <span>{isExpanded ? '▲' : '▼'}</span>
      </div>
      {isExpanded && (
        <>
          {addresses.map((address) => {
            if (address.purpose === 'stacks') {
              return null;
            }
            return (
              <div key={address.purpose}>
                <h4>{address.purpose}</h4>
                <div>Address: {address.address}</div>
                <div>Public key: {address.publicKey}</div>
              </div>
            );
          })}
          <div>
            <button onClick={onDisconnect}>Disconnect</button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddressDisplay;
