
import React, { useState, useEffect, Fragment, useRef } from 'react';
import './styles/App.css';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

import StarryBackground from './components/StarryBackground';
import BootScreen from './components/BootScreen';
import Hints from './components/Hints';
import ExplorationProgress from './components/ExplorationProgress';
import PlayerStatus from './components/PlayerStatus';
import InfoPanel from './components/InfoPanel';
import D3Graph from './components/D3Graph';
import WelcomeModal from './components/WelcomeModal';

function App() {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [isBooting, setIsBooting] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isGraphReady, setIsGraphReady] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [visitedNodes, setVisitedNodes] = useState(new Set());
    const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
    const audioRef = useRef(null);
    const [hasSeenWelcome, setHasSeenWelcome] = useState(false);


    const handleBootAnimationStart = () => {
        if (!hasSeenWelcome) {
            setIsWelcomeModalOpen(true);
        }
    };

    const handleBootComplete = () => {
        setIsBooting(false);
    };

    const handleWelcomeModalClose = (shouldPlayMusic) => {
        setIsWelcomeModalOpen(false);
        setHasSeenWelcome(true);

        if (shouldPlayMusic && audioRef.current) {
            audioRef.current.volume = 0.3;
            audioRef.current.play().catch(error => {
                console.error("Audio playback failed:", error);
            });
        }
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
        const fetchGraphData = async () => {
            setIsLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "graph"));
                if (!querySnapshot.empty) {
                    // Assuming you have one document in the 'graph' collection
                    const data = querySnapshot.docs[0].data();
                    setGraphData({ nodes: data.nodes || [], links: data.links || [] });
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching graph data: ", error);
            }
            setIsLoading(false); // Set loading to false after fetching
        };

        fetchGraphData();
    }, []);



    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === "Escape") resetView();
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
            <audio ref={audioRef} src="/music/space_song.mp3" loop />
            <WelcomeModal isOpen={isWelcomeModalOpen} onClose={handleWelcomeModalClose} />
            {isBooting && <BootScreen onAnimationStart={handleBootAnimationStart} onBootComplete={handleBootComplete} />}
            <StarryBackground />
            <ExplorationProgress visitedCount={visitedNodes.size} totalCount={graphData.nodes.length} />
            <PlayerStatus />
            <Hints isVisible={!isLoading && !isWelcomeModalOpen} hasInteracted={hasInteracted} />

            {!isLoading && graphData.nodes.length > 0 && (
                <D3Graph
                    graphData={graphData}
                    onNodeClick={handleNodeClick}
                    selectedNode={selectedNode}
                    visitedNodes={visitedNodes}
                    onReady={setIsGraphReady}
                    isGraphReady={isGraphReady}
                />
            )}


            <InfoPanel
                node={selectedNode}
                isOpen={isPanelOpen}
                onClose={resetView}
            />
        </Fragment>
    );
}

export default App;