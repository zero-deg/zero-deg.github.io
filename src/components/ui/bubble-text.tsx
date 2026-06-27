import React, { useState } from "react";

export const BubbleText = ({ text = "Bubbbbbbbble text" }: { text?: string }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <h2
      onMouseLeave={() => setHoveredIndex(null)}
      className="text-center text-5xl md:text-7xl font-light text-indigo-300 select-none pb-2"
    >
      {text.split("").map((char, idx) => {
        const distance = hoveredIndex !== null ? Math.abs(hoveredIndex - idx) : null;
        
        let classes = "transition-all duration-300 ease-in-out cursor-default inline-block";
        
        switch (distance) {
          case 0:
            classes += " font-black text-indigo-50";
            break;
          case 1:
            classes += " font-semibold text-indigo-200";
            break;
          case 2:
            classes += " font-medium text-indigo-200/60";
            break;
          default:
            break;
        }

        return (
          <span
            key={idx}
            onMouseEnter={() => setHoveredIndex(idx)}
            className={classes}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </h2>
  );
};
