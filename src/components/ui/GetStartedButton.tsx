import React from "react";

export const GetStartedButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <>
      <svg className="hidden">
        <filter id="glass-distortion-i3gwzr4k9">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.006"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="25"
          />
        </filter>
      </svg>
      <button
        onClick={onClick}
        className="relative px-[36px] py-[12px] rounded-[50px] cursor-pointer overflow-hidden bg-transparent transform scale-100 transition-transform duration-200 outline-none w-max inline-flex items-center justify-center min-w-[140px]"
      >
        <div
          className="absolute inset-0 rounded-[50px] z-10 backdrop-blur-[3px]"
          style={{
            filter: "url(#glass-distortion-i3gwzr4k9) saturate(120%) brightness(1.15)",
          }}
        />
        <div
          className="absolute inset-0 rounded-[50px] z-20"
          style={{ backgroundColor: "rgba(148, 148, 148, 0.1)" }}
        />
        <div
          className="absolute inset-0 rounded-[50px] z-30"
          style={{
            boxShadow: "rgba(217, 217, 217, 0.75) 1px 1px 1px inset",
          }}
        />
        <div
          className="relative z-40 text-white flex items-center justify-center w-full gap-0 font-sans text-[18px] font-semibold tracking-normal leading-[1em]"
        >
          <span>ALT</span>
        </div>
      </button>
    </>
  );
};
