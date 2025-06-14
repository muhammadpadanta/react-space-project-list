
import React, { useState } from 'react';

const WelcomeModal = ({ isOpen, onClose }) => {
    const [page, setPage] = useState(1);

    if (!isOpen) {
        return null;
    }

    const handleSelectMusic = (shouldPlay) => {
        if (onClose) {
            onClose(shouldPlay);
        }
    };

    return (
        <div className="welcome-modal-overlay">
            <div className="welcome-modal-content">
                {page === 1 && (
                    <>
                        <h2>SYSTEM ONLINE</h2>
                        <p>Welcome, Operator. You have connected to the Project Constellation archive. Navigate the network graph to inspect linked project data. Your exploration progress is tracked in the top-left corner.</p>
                        <div className="welcome-modal-buttons">
                            <button onClick={() => setPage(2)}>Proceed</button>
                        </div>
                    </>
                )}

                {page === 2 && (
                    <>
                        <h2>AUDIO ENGAGEMENT</h2>
                        <p>For an enhanced immersive experience, we recommend enabling the system's background audio track. Would you like to proceed with audio enabled?</p>
                        <div className="welcome-modal-buttons">
                            <button onClick={() => handleSelectMusic(false)} className="secondary">Continue in Silence</button>
                            <button onClick={() => handleSelectMusic(true)}>Engage Audio</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WelcomeModal;