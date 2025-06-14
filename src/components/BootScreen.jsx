
import React, { useState, useEffect } from 'react';

const BootScreen = ({ onAnimationStart, onBootComplete }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        let completionTimer;
        const startTimer = setTimeout(() => {
            setVisible(false);

            if (onAnimationStart) {
                onAnimationStart();
            }

            completionTimer = setTimeout(onBootComplete, 800);
        }, 2500);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(completionTimer);
        };
    }, [onAnimationStart, onBootComplete]);

    return (
        <div className={`boot-screen ${!visible ? 'hidden' : ''}`}>
            <div className="boot-text">INITIALIZING CONSTELLATION...</div>
        </div>
    );
};

export default BootScreen;