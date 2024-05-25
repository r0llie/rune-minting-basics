import { useEffect, useState } from 'react';
import './InFooter.css'; // Bu dosyada CSS stillerini tanımlayın
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedin, faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    const [feeRates, setFeeRates] = useState({ slow: null, medium: null, fast: null });
    const [blockHeight, setBlockHeight] = useState(null);
    const [btcPrice, setBtcPrice] = useState<string>('');

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
            setBlockHeight(data.blockHeight);
          })
          .catch(error => console.error('Error:', error));
      };

      fetchBtcPrice(); // İlk veri çekme işlemi
      const intervalId1 = setInterval(fetchBtcPrice, 30000); // 15 saniyede bir veri çekme işlemi
      fetchFeeRates(); // İlk veri çekme işlemi
      const intervalId = setInterval(fetchFeeRates, 30000); // 15 saniyede bir veri çekme işlemi

      return () => clearInterval(intervalId); // Component unmount olduğunda interval'i temizle
      return () => clearInterval(intervalId1); // Component unmount olduğunda interval'i temizle
    }, []);

  return (
    <div className="footer border-top pt-3">
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <a href="https://twitter.com/0xAtaturk2" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://discord.com/invite/runes" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faDiscord} />
            </a>
          </div>
          <div className="col-sm">
            <div>Block Number: {blockHeight}</div>
            <div>Fee Rates: Slow: {feeRates.slow}, Fast: {feeRates.fast}</div>
            <div>BTC Price: {btcPrice}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;