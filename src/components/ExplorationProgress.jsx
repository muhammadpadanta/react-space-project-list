
import React from 'react';

const ExplorationProgress = ({ visitedCount, totalCount }) => {
    const progress = totalCount > 0 ? (visitedCount / totalCount) * 100 : 0;
    return (
        <div className="progress-container">
            <div className="progress-label">EXPLORATION PROGRESS</div>
            <div className="progress-bar">
                <div className="progress-bar-inner" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

export default ExplorationProgress;