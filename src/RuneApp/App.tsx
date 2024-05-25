import Wallet, { Address, BitcoinNetworkType, AddressPurpose } from 'sats-connect';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
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
    try {
      const response = await Wallet.request('getAccounts', {
        purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals, AddressPurpose.Stacks],
        message: 'Cool app wants to know your addresses!',
      });
      if (response.status === 'success') {
        setAddressInfo(response.result);
        console.log(response.result);
      }
    } catch (error) {
      console.log('Error connecting to the wallet:', error);
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
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-3 bg-light justify-content-start"> {/* Sidebar */}
                <div className="card">
                  <h3>Connect your wallet - ({network})</h3>
                  <NetworkSelector network={network} setNetwork={setNetwork} />
                  <div>
                    <button onClick={onConnect}>Connect</button>
                  </div>
                </div>
                <SendBtc network={network} /> {/* SendBtc componentini AddressDisplay'in altına ekledik */}
              </div>
              <div className="col-sm-9"> {/* Main content */}
                <div className="row">
                  <div className='col-md text-light align-self-center'>
                    <EtchRunes network={network} addresses={addressInfo} />
                  </div>
                  <div className='col-md text-light align-self-center'>
                    <MintRunes network={network} addresses={addressInfo} />
                  </div>
                </div> 
              </div>
            </div>
          </div>
        </header>
    </div>
    );
  }


  return (
    <div className="App">
      <div className="App-body">
        <img className="logo" src="/rollie.svg" alt="rollie" />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3 bg-light justify-content-start"> {/* Sidebar */}
              <AddressDisplay network={network} addresses={addressInfo} onDisconnect={onDisconnect} />
              <SendBtc network={network} /> {/* SendBtc componentini AddressDisplay'in altına ekledik */}
            </div>
            <div className="col-sm-9"> {/* Main content */}
              <div className="row">
                <div className='col-md text-light align-self-center'>
                  <EtchRunes network={network} addresses={addressInfo} />
                </div>
                <div className='col-md text-light align-self-stretch'>
                  <MintRunes network={network} addresses={addressInfo} />
                </div>
              </div> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
