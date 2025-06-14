
import React, { useState, useEffect, Fragment } from 'react';

import { graphData } from './data/graphData';

import './styles/App.css';

import StarryBackground from './components/StarryBackground';
import BootScreen from './components/BootScreen';
import Hints from './components/Hints';
import ExplorationProgress from './components/ExplorationProgress';
import PlayerStatus from './components/PlayerStatus';
import InfoPanel from './components/InfoPanel';
import D3Graph from './components/D3Graph';

function App() {
    const [isBooting, setIsBooting] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isGraphReady, setIsGraphReady] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [visitedNodes, setVisitedNodes] = useState(new Set());

    const handleBootAnimationStart = () => {
        setIsLoading(false);
    };

    const handleBootComplete = () => {
        setIsBooting(false);
    };

    const handleNodeClick = (node, event) => {
        event.stopPropagation();
        setSelectedNode(node);

        if (!hasInteracted) {
            setHasInteracted(true);
            setTimeout(() => {
                setIsPanelOpen(true);
            }, 350);
        } else {
            setIsPanelOpen(true);
        }

        setVisitedNodes(prevVisited => new Set(prevVisited).add(node.id));
    };

    const resetView = () => {
        setSelectedNode(null);
        setIsPanelOpen(false);
    };

    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === "Escape") {
                resetView();
            }
        };
        const handleClickOutside = (event) => {
            if (isPanelOpen && !event.target.closest('.info-panel') && !event.target.closest('.node')) {
                resetView();
            }
        };
        document.addEventListener('keydown', handleEscKey);
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isPanelOpen]);

    return (
        <Fragment>
            {isBooting && <BootScreen onAnimationStart={handleBootAnimationStart} onBootComplete={handleBootComplete} />}
            <StarryBackground />
            <ExplorationProgress visitedCount={visitedNodes.size} totalCount={graphData.nodes.length} />
            <PlayerStatus />
            <Hints isVisible={!isLoading} hasInteracted={hasInteracted} />

            <D3Graph
                graphData={graphData}
                onNodeClick={handleNodeClick}
                selectedNode={selectedNode}
                visitedNodes={visitedNodes}
                onReady={setIsGraphReady}
                isGraphReady={isGraphReady}
            />

            <InfoPanel
                node={selectedNode}
                isOpen={isPanelOpen}
                onClose={resetView}
            />
        </Fragment>
    );
}

export default App;