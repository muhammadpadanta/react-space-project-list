
import React, { memo } from 'react';

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

export default StarryBackground;