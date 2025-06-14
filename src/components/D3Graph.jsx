
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3Graph = ({ graphData, onNodeClick, selectedNode, visitedNodes, onReady, isGraphReady }) => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const simulationRef = useRef(null);
    const zoomRef = useRef(null);
    const selectionsRef = useRef({});
    const lastTransformRef = useRef(null);

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

                const wiggleGroup = node.append("g").attr("class", "node-wiggle-group");

                wiggleGroup.style("animation-duration", () => `${Math.random() * 8 + 7}s`);
                wiggleGroup.style("animation-delay", () => `${Math.random() * 5}s`);

                wiggleGroup.append("circle").attr("r", d => d.radius).style("animation-delay", () => `${Math.random() * 4}s`); /* */
                wiggleGroup.append("text").text(d => d.label).attr("dy", "0.35em"); /* */

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

        if (selectedNode && selectedNode.x && selectedNode.y) {

            if (lastTransformRef.current === null) {
                lastTransformRef.current = d3.zoomTransform(svg.node());
            }

            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            const scale = width > 768 ? 1.2 : 1.0;
            const x = width / 2 - selectedNode.x * scale;
            const y = height / 2 - selectedNode.y * scale;
            const mobileYOffset = height * 0.15;
            const finalY = width > 768 ? y : y - mobileYOffset;
            const targetTransform = d3.zoomIdentity.translate(x, finalY).scale(scale);

            svg.transition().duration(750).call(zoom.transform, targetTransform);

        } else {

            if (lastTransformRef.current) {
                svg.transition().duration(750).call(zoom.transform, lastTransformRef.current);
                lastTransformRef.current = null;
            } else {
                svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
            }
        }
    }, [selectedNode, isGraphReady]);

    return (
        <div ref={containerRef} className="blueprint-container">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default D3Graph;