
import React, { useState, useEffect, Fragment } from 'react';

const Hints = ({ isVisible, hasInteracted }) => {
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    if (!isVisible) return null;

    return (
        <Fragment>
            <div className={`hint ${!hasInteracted ? 'visible' : ''}`} id="hint-click">
                Click a node to inspect a project
            </div>
            <div className="hint visible" id="hint-zoom">
                {isTouchDevice ? 'Pinch to Zoom' : 'Scroll to Zoom'}
            </div>
            <div className="hint visible" id="hint-drag">Click & Drag to Pan</div>
        </Fragment>
    );
};

export default Hints;