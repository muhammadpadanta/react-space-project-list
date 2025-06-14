
import React, { useState, useEffect } from 'react';

const InfoPanel = ({ node, isOpen, onClose }) => {
    const [content, setContent] = useState(null);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {

        if (node) {

            if (isOpen && content && content.title !== node.data.title) {
                setIsFading(true);
                setTimeout(() => {
                    setContent(node.data);
                    setIsFading(false);
                }, 400);
            } else {
                setContent(node.data);
            }
        }
    }, [node, isOpen]);

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

export default InfoPanel;