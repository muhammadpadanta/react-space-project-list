import React, { useState, useEffect, useRef, Fragment, memo } from 'react';
import * as d3 from 'd3';

// Data for the graph
const graphData = {
    nodes: [
        { id: "p1", group: "frontend", label: "E-Commerce", radius: 70, data: { title: "E-Commerce Platform", description: "A full-stack e-commerce solution with a modern frontend, leveraging a headless CMS for content and Stripe for secure payment processing. This description is intentionally made longer to demonstrate the scrolling functionality of the side panel. When the content overflows its container, a scrollbar should appear, allowing the user to view all the information without expanding the panel itself. The buttons below should remain fixed in place.", technologies: ["Next.js", "React", "Strapi", "Stripe", "PostgreSQL"], liveUrl: "#", repoUrl: "#" } },
        { id: "p2", group: "data-vis", label: "Data Viz", radius: 60, data: { title: "Data Visualizer", description: "An interactive dashboard for visualizing financial data using D3.js. Features include dynamic charts, tooltips, and responsive design.", technologies: ["D3.js", "Vanilla JS", "HTML5", "CSS3"], liveUrl: "#", repoUrl: "" } },
        { id: "p3", group: "frontend", label: "Terminal", radius: 65, data: { title: "Terminal Portfolio", description: "A lightweight, text-based portfolio interface built with React. It simulates a command-line environment for a unique user experience.", technologies: ["React", "Styled-Components", "TypeScript"], liveUrl: "#", repoUrl: "#" } },
        { id: "p4", group: "mobile", label: "Weather App", radius: 65, data: { title: "Mobile Weather App", description: "A cross-platform mobile application developed with React Native. It fetches data from a third-party weather API to provide real-time forecasts.", technologies: ["React Native", "Expo", "API"], liveUrl: "", repoUrl: "#" } },
        { id: "p5", group: "backend", label: "Task API", radius: 60, data: { title: "Task Management API", description: "A secure and efficient RESTful API for task management, built with a serverless architecture on AWS for scalability and cost-effectiveness.", technologies: ["Node.js", "AWS Lambda", "DynamoDB", "Serverless"], liveUrl: "", repoUrl: "#" } }
    ],
    links: [{ source: "p1", target: "p3" }, { source: "p1", target: "p5" }, { source: "p4", target: "p3" }]
};

const placeholderCode = `
function animateConstellation(nodes, links) {
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(width / 2, height / 2));

  // ... additional simulation logic
}
`.trim();

graphData.nodes.forEach(node => {
    if (node.data) {
        node.data.code = placeholderCode;
    }
});


// --- React Components ---

const StarryBackground = memo(({ starCount = 150 }) => {
    const stars = Array.from({ length: starCount }).map((_, i) => {
        const size = `${Math.random() * 2 + 1}px`;
        const style = {
            width: size,
            height: size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 5 + 4}s`,
            animationDelay: `${Math.random() * 4}s`,
        };
        return <div key={i} className="star" style={style} />;
    });

    return <div id="stars-container">{stars}</div>;
});


const BootScreen = ({ onAnimationStart, onBootComplete }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        let completionTimer;
        const startTimer = setTimeout(() => {
            // Trigger the fade-out animation
            setVisible(false);

            // Notify the parent that the main UI can start fading in
            if (onAnimationStart) {
                onAnimationStart();
            }

            // Notify the parent when the animation is fully complete
            completionTimer = setTimeout(onBootComplete, 800); // Must match CSS transition duration
        }, 2500);

        // Cleanup timers if the component unmounts
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

const Hints = ({ isVisible, hasInteracted }) => {
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    if (!isVisible) return null;

    // The central "click" hint should fade out after the first interaction.
    // The corner hints for zoom and drag should remain visible.
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
            <img src="https://media.tenor.com/FaS85oqEg9YAAAAi/mutalisk-starcraft.gif" alt="Player Avatar" className="player-avatar" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/50x50/3c3836/ebdbb2?text=...'; }} />
        </div>
    );
};

const InfoPanel = ({ node, isOpen, onClose }) => {
    const [content, setContent] = useState(null);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Only update the content if a node is selected.
        // This prevents the content from disappearing during the closing animation
        // when the selected `node` becomes null.
        if (node) {
            // If the panel is already open and we're switching to a new node,
            // fade the content out and in.
            if (isOpen && content && content.title !== node.data.title) {
                setIsFading(true);
                setTimeout(() => {
                    setContent(node.data);
                    setIsFading(false);
                }, 400);
            } else {
                // Otherwise, set the content immediately. This handles the first click.
                setContent(node.data);
            }
        }
    }, [node, isOpen]); // Rerunning on `content` is not needed here.

    // If there's no content to display, don't render the panel.
    if (!content) return null;

    const liveLink = content.liveUrl ? <a href={content.liveUrl} target="_blank" rel="noopener noreferrer">Live Demo</a> : <a className="disabled">No Demo</a>;
    const repoLink = content.repoUrl ? <a href={content.repoUrl} target="_blank" rel="noopener noreferrer">Source Code</a> : <a className="disabled">No Repo</a>;

    return (
        <aside className={`info-panel ${isOpen ? 'is-open' : ''}`}>
            <div className="close-btn" onClick={onClose} title="Close (Esc)">&times;</div>
            <div id="info-content" style={{ opacity: isFading ? 0 : 1 }}>
                <h2>{content.title}</h2>
                <h3>DESCRIPTION</h3>
                <p>{content.description}</p>
                <h3>TECHNOLOGIES</h3>
                <div className="tech-tags">{content.technologies.map(tech => <span key={tech}>{tech}</span>)}</div>
                <h3>CODE SNIPPET</h3>
                <pre><code>{content.code}</code></pre>
            </div>
            <div id="info-buttons">
                <div className="project-links">{liveLink}{repoLink}</div>
            </div>
        </aside>
    );
};

const D3Graph = ({ graphData, onNodeClick, selectedNode, visitedNodes, onReady, isGraphReady }) => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const simulationRef = useRef(null);
    const zoomRef = useRef(null);
    const selectionsRef = useRef({});

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            if (!entry) return;
            const { width, height } = entry.contentRect;

            if (width > 0 && height > 0) {
                observer.disconnect();
                d3.select(svgRef.current).selectAll("*").remove();

                const nodesCopy = graphData.nodes.map(n => ({ ...n }));
                const linksCopy = graphData.links.map(l => ({ ...l }));
                const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
                const graphContainer = svg.append("g");

                const simulation = d3.forceSimulation(nodesCopy)
                    .force("link", d3.forceLink(linksCopy).id(d => d.id).distance(200).strength(0.5))
                    .force("charge", d3.forceManyBody().strength(-400))
                    .force("center", d3.forceCenter(width / 2, height / 2))
                    .force("collide", d3.forceCollide().radius(d => d.radius + 15));

                const link = graphContainer.append("g").selectAll("line").data(linksCopy).join("line").attr("class", "link");
                const node = graphContainer.append("g").selectAll("g").data(nodesCopy).join("g").attr("class", "node");

                node.append("circle").attr("r", d => d.radius).style("animation-delay", () => `${Math.random() * 4}s`);
                node.append("text").text(d => d.label).attr("dy", "0.35em");

                simulation.on("tick", () => {
                    link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
                    node.attr("transform", d => `translate(${d.x},${d.y})`);
                });

                const zoom = d3.zoom().scaleExtent([0.3, 3]).on("zoom", (event) => graphContainer.attr("transform", event.transform));
                svg.call(zoom);
                const drag = d3.drag()
                    .on("start", (event, d) => { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
                    .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
                    .on("end", (event, d) => { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; simulation.alpha(0.1).restart(); });

                node.call(drag).on("click", (event, d) => onNodeClick(d, event));

                selectionsRef.current = { node, link };
                simulationRef.current = simulation;
                zoomRef.current = zoom;
                onReady(true);
            }
        });

        observer.observe(container);

        return () => {
            observer.disconnect();
            if (simulationRef.current) {
                simulationRef.current.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (!isGraphReady || !selectionsRef.current.node) return;

        const { node, link } = selectionsRef.current;
        const linkedByIndex = {};
        graphData.links.forEach(l => {
            linkedByIndex[`${l.source},${l.target}`] = true;
        });

        const areNodesConnected = (a, b) => linkedByIndex[`${a.id},${b.id}`] || linkedByIndex[`${b.id},${a.id}`] || a.id === b.id;

        node.on("mouseover", null).on("mouseout", null);

        if (selectedNode) {
            node.classed("faded", n => !areNodesConnected(selectedNode, n));
            link.classed("faded", l => !(l.source.id === selectedNode.id || l.target.id === selectedNode.id));
            node.filter(n => n.id === selectedNode.id).classed("faded", false).classed("highlight", true);
            link.filter(l => l.source.id === selectedNode.id || l.target.id === selectedNode.id).classed("highlight", true).raise();
        } else {
            node.classed("faded", false).classed("highlight", false);
            link.classed("faded", false).classed("highlight", false);

            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            if (!isTouchDevice) {
                node.on("mouseover", function(event, d) {
                    node.classed("faded", n => !areNodesConnected(d, n));
                    link.classed("faded", l => !(l.source.id === d.id || l.target.id === d.id));
                    d3.select(this).classed("faded", false);
                    link.filter(l => l.source.id === d.id || l.target.id === d.id).classed("highlight", true).raise();
                }).on("mouseout", () => {
                    node.classed("faded", false);
                    link.classed("faded", false).classed("highlight", false);
                });
            }
        }
    }, [selectedNode, isGraphReady, graphData.links]);

    useEffect(() => {
        if (!isGraphReady || !selectionsRef.current.node) return;
        selectionsRef.current.node.classed('visited', d => visitedNodes.has(d.id));
    }, [visitedNodes, isGraphReady]);

    useEffect(() => {
        if (!isGraphReady || !svgRef.current || !zoomRef.current || !containerRef.current) return;

        const svg = d3.select(svgRef.current);
        const zoom = zoomRef.current;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        if (selectedNode && selectedNode.x && selectedNode.y) {
            const scale = width > 768 ? 1.2 : 1.0;
            const x = width / 2 - selectedNode.x * scale;
            const y = height / 2 - selectedNode.y * scale;
            const mobileYOffset = height * 0.15;
            const finalY = width > 768 ? y : y - mobileYOffset;
            svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(x, finalY).scale(scale));
        } else {
            svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
        }
    }, [selectedNode, isGraphReady]);

    return (
        <div ref={containerRef} className="blueprint-container">
            <svg ref={svgRef}></svg>
        </div>
    );
};

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

        if (!visitedNodes.has(node.id)) {
            setVisitedNodes(prev => new Set(prev).add(node.id));
        }
    };

    const resetView = () => {
        setSelectedNode(null);
        setIsPanelOpen(false);
    };



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
            <style>{`
                /* Your existing CSS here... */
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@400;600&family=Source+Code+Pro:wght@400;600&display=swap');
                :root { --glow-color: #458588; --background-dark: #282828; --background-med: #3c3836; --border-color: #504945; --text-primary: #ebdbb2; --text-secondary: #d5c4a1; --link-color: rgba(168, 153, 132, 0.3); --pulse-glow: rgba(69, 133, 136, 0.4); --achievement-color: #d79921; --health-color: #cc241d; }
                body { margin:0; font-family:'Teko', sans-serif; background-color: var(--background-dark); color: var(--text-primary); overflow:hidden; position: fixed; width: 100%; height: 100%; }
                #root { height: 100%; }
                .progress-container { position: fixed; top: 20px; left: 20px; width: 250px; z-index: 150; }
                .progress-label { font-family: 'Source Code Pro', monospace; font-size: 14px; margin-bottom: 8px; color: var(--text-primary); }
                .progress-bar { width: 100%; height: 15px; background-color: var(--background-med); border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden; }
                .progress-bar-inner { width: 0%; height: 100%; background-color: var(--glow-color); transition: width 0.5s ease-out; box-shadow: 0 0 10px var(--glow-color); }
                .player-status-container { position: fixed; top: 20px; right: 20px; z-index: 150; display: flex; align-items: center; gap: 15px; }
                .player-avatar { width: 50px; height: 50px; border-radius: 50%; border: 2px solid var(--glow-color); box-shadow: 0 0 10px var(--glow-color); background-color: var(--background-med); }
                .health-label { font-family: 'Source Code Pro', monospace; font-size: 14px; margin-bottom: 8px; color: var(--text-primary); text-align: right; }
                .shield-container { display: flex; flex-direction: column; align-items: flex-end; }
                .hearts-display { display: flex; gap: 6px; }
                .heart-icon { width: 28px; height: 28px; fill: var(--health-color); filter: drop-shadow(0 0 5px var(--health-color)); stroke: var(--background-dark); stroke-width: 1; }
                .boot-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--background-dark); z-index: 200; display: flex; align-items: center; justify-content: center; flex-direction: column; font-family: 'Source Code Pro', monospace; transition: opacity 0.8s ease-out; opacity: 1; }
                .boot-screen.hidden { opacity: 0; pointer-events: none; }
                .boot-text { border: 2px solid var(--glow-color); padding: 20px 40px; color: var(--glow-color); font-size: 20px; text-align: center; text-transform: uppercase; box-shadow: 0 0 15px var(--glow-color), inset 0 0 15px var(--glow-color); animation: text-flicker 3s infinite; }
                @keyframes text-flicker { 0% { opacity: 0.8; } 5% { opacity: 0.5; } 10% { opacity: 0.9; } 25% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.8; } }
                .hint { position: fixed; color: var(--text-primary); background-color: rgba(60, 56, 54, 0.85); backdrop-filter: blur(5px); border: 1px solid var(--border-color); padding: 8px 15px; border-radius: 5px; font-family: 'Source Code Pro', monospace; font-size: 14px; z-index: 140; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
                .hint.visible { opacity: 1; }
                #hint-click { top: 50%; left: 50%; transform: translate(-50%, -50%); border-color: var(--glow-color); animation: bounce 2s infinite ease-in-out; }
                @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translate(-50%, -50%) translateY(0); } 40% { transform: translate(-50%, -50%) translateY(-20px); } 60% { transform: translate(-50%, -50%) translateY(-10px); } }
                #hint-zoom { bottom: 20px; left: 20px; }
                #hint-drag { bottom: 20px; right: 20px; }
                #stars-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden; }
                .star { position: absolute; background-color: white; border-radius: 50%; animation: twinkle linear infinite; }
                @keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1); } }
                .blueprint-container { position:absolute; top:0; left:0; width:100%; height:100%; cursor:grab; }
                .blueprint-container:active { cursor:grabbing; }
                svg { width: 100%; height: 100%; }
                .link { stroke: var(--link-color); stroke-width: 1.5px; transition: stroke 0.3s, stroke-opacity 0.3s, stroke-width 0.3s; }
                .node circle { stroke: var(--glow-color); stroke-width: 2px; fill: var(--background-dark); transition: fill 0.3s, transform 0.3s, stroke-width 0.3s, stroke 0.3s; animation: pulse 4s infinite ease-in-out; }
                .node text { fill: var(--text-primary); font-family: 'Teko', sans-serif; font-size: 20px; text-anchor: middle; pointer-events: none; transition: fill 0.3s, font-size 0.3s, text-shadow 0.3s; text-shadow: 0 0 5px rgba(0,0,0,0.7); }
                @keyframes pulse { 0% { box-shadow: 0 0 0 0 var(--pulse-glow); } 70% { box-shadow: 0 0 0 10px rgba(69, 133, 136, 0); } 100% { box-shadow: 0 0 0 0 rgba(69, 133, 136, 0); } }
                .node:hover circle, .node.highlight circle { fill: var(--background-med); stroke-width: 3px; transform: scale(1.1); animation: none; }
                .node:hover text, .node.highlight text { font-size: 24px; text-shadow: 0 0 8px var(--glow-color); fill: var(--text-primary); }
                .link.highlight { stroke: var(--glow-color); stroke-opacity: 1; stroke-width: 2.5px; }
                .faded { opacity: 0.1; transition: opacity 0.3s; }
                .node.visited circle { stroke: var(--achievement-color); animation: none; }
                .node.visited:hover circle { stroke-width: 4px; }
                .info-panel { position:fixed; top:0; right:-550px; width:450px; height:100%; background-color:rgba(40, 40, 40, 0.85); backdrop-filter: blur(10px); border-left:2px solid var(--glow-color); box-shadow:-10px 0px 30px rgba(0,0,0,0.5); transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1); z-index:160; box-sizing: border-box; display: flex; flex-direction: column; padding: 0; }
                .info-panel.is-open { transform: translateX(-550px); }
                .info-panel #info-content { flex-grow: 1; overflow-y: auto; padding: 25px 25px 0 25px; transition: opacity 0.4s ease-out; }
                .info-panel h2 {font-size:42px;margin-top:0;color:var(--glow-color); }
                .info-panel h3 {font-size:24px;margin-bottom:10px;border-bottom:1px solid var(--border-color);padding-bottom:5px; margin-top: 30px; }
                .info-panel p {font-family:'Helvetica',sans-serif;font-size:16px;line-height:1.6;color:var(--text-secondary); }
                .info-panel .close-btn {position:absolute;top:15px;right:25px;font-size:30px;cursor:pointer;color:var(--text-primary); transition: color 0.2s, transform 0.2s; z-index: 1; }
                .info-panel .close-btn:hover { color: var(--glow-color); transform: rotate(90deg); }
                .info-panel pre {background-color:var(--background-dark);padding:15px;border-radius:5px;border:1px solid var(--border-color);overflow-x:auto;}
                .info-panel code {font-family:'Source Code Pro',monospace;font-size:14px; color: var(--text-secondary); }
                .tech-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
                .tech-tags span { background-color: var(--border-color); color: var(--text-primary); padding: 5px 12px; border-radius: 4px; font-family: 'Source Code Pro', monospace; font-size: 14px; }
                #info-buttons { flex-shrink: 0; padding: 25px; padding-top: 15px; }
                .project-links { display: flex; gap: 15px; }
                .project-links a { flex: 1; text-align: center; background-color: transparent; border: 1px solid var(--glow-color); color: var(--glow-color); padding: 12px; text-decoration: none; border-radius: 4px; font-family: 'Teko', sans-serif; font-size: 20px; letter-spacing: 1px; transition: background-color 0.2s, color 0.2s; }
                .project-links a:hover { background-color: var(--glow-color); color: var(--background-dark); }
                .project-links a.disabled { border-color: var(--border-color); color: var(--border-color); pointer-events: none; opacity: 0.5; }
                @media (max-width: 768px) {
                    .progress-container { top: 10px; left: 10px; width: 180px; }
                    .player-status-container { top: 10px; right: 10px; gap: 10px; }
                    .player-avatar { width: 40px; height: 40px; }
                    .heart-icon { width: 22px; height: 22px; }
                    .boot-text { font-size: 16px; padding: 15px 25px; width: 80%; }
                    #hint-zoom { bottom: 15px; left: 15px; }
                    #hint-drag { bottom: 15px; right: 15px; }
                    .info-panel { width: 100%; height: 90vh; top: auto; bottom: -90vh; right: auto; left: 0; border-left: none; border-top: 2px solid var(--glow-color); transform: translateY(0); transition: transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1); }
                    .info-panel.is-open { transform: translateY(-90vh); }
                    .info-panel .close-btn { top: 15px; right: 20px; font-size: 36px; }
                    .info-panel h2 { font-size: 34px; }
                    .info-panel h3 { font-size: 20px; }
                    .info-panel p { font-size: 15px; }
                    .project-links a { font-size: 18px; padding: 10px; }
                }
            `}</style>

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