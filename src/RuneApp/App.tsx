import Wallet, { Address, BitcoinNetworkType, AddressPurpose } from 'sats-connect';
import './App.css';
import {
  AddressDisplay,
  NetworkSelector,
  SendBtc,
  MintRunes,
  EtchRunes,
} from './components';
import { useLocalStorage } from './hooks';

function App() {
  const [network, setNetwork] = useLocalStorage<BitcoinNetworkType>(
    'network',
    BitcoinNetworkType.Mainnet
  );
  const [addressInfo, setAddressInfo] = useLocalStorage<Address[]>('addresses', []);

  const isConnected = addressInfo.length > 0;

  const onConnect = async () => {
    const response = await Wallet.request('getAccounts', {
      purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals, AddressPurpose.Stacks],
      message: 'Cool app wants to know your addresses!',
    });
    if (response.status === 'success') {
      setAddressInfo(response.result);
      console.log(response.result);
    }
  };

  const onDisconnect = () => {
    Wallet.disconnect();
    setAddressInfo([]);
  };

  if (!isConnected) {
    return (
      <div className="App">
        <header className="App-header">
          <img className="logo" src="/rollie.svg" alt="rollie" />
          <NetworkSelector network={network} setNetwork={setNetwork} />
          <p>Cüzdanını bağlamak için butona tıkla!</p>
          <button onClick={onConnect}>Bağlan</button>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="App-body">
        <div>
          <img className="logo" src="/rollie.svg" alt="rollie" />
        </div>
        <AddressDisplay network={network} addresses={addressInfo} onDisconnect={onDisconnect} />
        <MintRunes network={network} addresses={addressInfo} />
        <EtchRunes network={network} addresses={addressInfo} />
        <SendBtc network={network} />
      </div>
    </div>
  );
}

export default App;
