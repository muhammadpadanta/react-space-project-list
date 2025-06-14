
import React from 'react';

const PlayerStatus = () => {
    const hearts = Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="heart-icon" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    ));

    return (
        <div className="player-status-container">
            <div className="shield-container">
                <div className="health-label">PixelDino</div>
                <div className="hearts-display">{hearts}</div>
            </div>
            <img src="dino.gif" alt="Player Avatar" className="player-avatar" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/50x50/3c3836/ebdbb2?text=...'; }} />
        </div>
    );
};

export default PlayerStatus;