import { useEffect, useState } from 'react';
import './InFooter.css'; // Bu dosyada CSS stillerini tanımlayın
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faDiscord, faBtc } from '@fortawesome/free-brands-svg-icons';
import { faArrowUp, faSquare, faCoins } from '@fortawesome/free-solid-svg-icons';


const Footer = () => {
    const [feeRates, setFeeRates] = useState({ slow: null, medium: null, fast: null });
    const [blockHeight, setBlockHeight] = useState<string>('');
    const [btcPrice, setBtcPrice] = useState<string>('');
    const [timeAgo, setTimeAgo] = useState<string>('');


    useEffect(() => {

        const fetchBtcPrice = () => {
            fetch('https://blockchain.info/ticker')
              .then(response => response.json())
              .then(data => {
                const price = data.USD.last;
                const formattedPrice = `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                setBtcPrice(formattedPrice);
              })
              .catch(error => console.error('Error:', error));
          };

      const fetchFeeRates = () => {
        fetch('https://api.blockchain.info/mempool/fees')
          .then(response => response.json())
          .then(data => {
            setFeeRates({
                slow: data.regular,
                medium: null,
                fast: data.priority
            });
          })
          .catch(error => console.error('Error:', error));
      };

      const fetchBlockHeight = () => {
        fetch('https://blockchain.info/q/getblockcount')
      .then(response => response.text()) // Blockchain.info returns plain text, not JSON
      .then(data => {
        setBlockHeight(data);
        return fetch(`https://mempool.space/api/block-height/${data}`);
      })
      .then(response => response.text())
      .then(data => {
        const blockHex = data;
        return fetch(`https://mempool.space/api/block/${blockHex}`);
      })
      .then(response => response.json())
      .then(data => {
        const timestamp = data.timestamp;
        const currentTime = Math.floor(Date.now() / 1000);
        const timeDifference = currentTime - timestamp;
        setTimeAgo(formatTimeAgo(timeDifference));
      })
      .catch(error => console.error('Error:', error));

      };

      const formatTimeAgo = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
    
        if (days > 0) return `${days} d ${hours-(days*24)} h ${minutes-(hours*60)} m ${seconds-(minutes*60)} s`;
        if (hours > 0) return `${hours} h ${minutes-(hours*60)} m ${seconds-(minutes*60)} s`;
        if (minutes > 0) return `${minutes} m  ${seconds-(minutes*60)} s`;
        return `${seconds} s`;
      };
    



      fetchBlockHeight(); // İlk veri çekme işlemi
      const intervalId2 = setInterval(fetchBlockHeight, 500); // 15 saniyede bir veri çekme işlemi
      fetchBtcPrice(); // İlk veri çekme işlemi
      const intervalId1 = setInterval(fetchBtcPrice, 30000); // 15 saniyede bir veri çekme işlemi
      fetchFeeRates(); // İlk veri çekme işlemi
      const intervalId = setInterval(fetchFeeRates, 30000); // 15 saniyede bir veri çekme işlemi

      return () => clearInterval(intervalId2); // Component unmount olduğunda interval'i temizle
      return () => clearInterval(intervalId); // Component unmount olduğunda interval'i temizle
      return () => clearInterval(intervalId1); // Component unmount olduğunda interval'i temizle
    }, []);

    return (
        <div className="footer border-top pt-3 bg-slate-800 text-white text-xs">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center p-2 px-4">
              <div className="d-flex align-items-center">
                <a href="https://twitter.com/0xAtaturk2" target="_blank" rel="noreferrer" className="social-link text-white mr-2">
                  <FontAwesomeIcon icon={faTwitter} className='social-link'/>
                </a>
                <a href="https://discord.com/invite/runes" target="_blank" rel="noreferrer" className="social-link text-white">
                  <FontAwesomeIcon icon={faDiscord} className='social-link'/>
                </a>
              </div>
              <div className="d-flex align-items-center info-section">
                <div className="d-flex align-items-center align-self-stretch bg-slate-800 border rounded-md py-2 px-3 mr-2 h-100">
                  <div className="bg-indigo-400 h-2 w-2 rounded-full animate-ping"></div>
                  <FontAwesomeIcon icon={faSquare} className="text-sky-300" />
                  <div className="ml-2">{blockHeight} , {timeAgo}</div>
                </div>
                <div className="d-flex align-items-center align-self-stretch bg-slate-800 border rounded-md py-2 px-3 mr-2 h-100">
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faCoins} className="text-sky-300" />
                    <div className="ml-2">{feeRates.slow} sats/vB</div>
                  </div>
                </div>
                <div className="d-flex align-items-center align-self-stretch bg-slate-800 border rounded-md py-2 px-3 h-100">
                  <FontAwesomeIcon icon={faBtc} className="text-sky-300" />
                  <div className="ml-2">{btcPrice}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

export default Footer;