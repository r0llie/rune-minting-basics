import React from 'react';
import './BioInfo.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

const BioInfo: React.FC = () => {
    return (
        <div className="bio-info">
            <img src="profile.png" alt="Profile" className="profile-picture" />
            <h1>r0llie</h1>
            <p>
            I'm a software engineer who loves exploring new technologies and contributing to open-source projects. 
            I hold a degree in Computer Science and have a strong background in software development.
            </p>
            <div className="social-links">
                <a href="https://twitter.com/0xAtaturk2" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faTwitter} /> Twitter
                </a>
                <a href="https://linkedin.com/in/rollieboss" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
                </a>
                <a href="https://github.com/r0llie" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faGithub} /> GitHub
                </a>
            </div>
        </div>
    );
}

export default BioInfo;
