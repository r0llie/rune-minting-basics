import React, { useState, useEffect } from 'react';
import App from '../RuneApp/App';
import BioInfo from '../BioInfo/BioInfo'; // Yeni bileşeni içe aktarın
import './BioPage.css';

function BioPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentApp, setCurrentApp] = useState<JSX.Element | null>(null);

    useEffect(() => {
        renderApp('BioPage'); // İlk açılışta BioPage renderlanacak
    }, []);

    const renderApp = (appName: string) => {
        if (appName === 'App') {
            setCurrentApp(<App />);
            setMenuOpen(false);
        } else if (appName === 'BioPage') {
            setCurrentApp(<BioInfo />);
            setMenuOpen(false);
        }
    };

    return (
        <div className="BioPage">
            <div className={`menu ${menuOpen ? 'open' : ''}`}>
                <button onClick={() => renderApp('BioPage')}>Who is rollie</button>
                <button onClick={() => renderApp('App')}>Runes</button>
            </div>
            <div className="header">
                <img src="rollie.svg" className="menu-button" onClick={() => setMenuOpen(!menuOpen)}></img>
            </div>
            <div className="content">
                {currentApp}
            </div>
        </div>
    );
}

export default BioPage;
