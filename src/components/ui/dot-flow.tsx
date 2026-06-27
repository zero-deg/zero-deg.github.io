"use client";

import { useEffect, useRef, useState } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { DotLoader } from "@/components/ui/dot-loader";

export type DotFlowProps = {
    items: {
        title: string;
        frames: number[][];
        duration?: number;
        repeatCount?: number;
    }[];
};

export const DotFlow = ({ items }: DotFlowProps) => {
    const [index, setIndex] = useState(0);

    const { contextSafe } = useGSAP();

    const next = contextSafe(() => {
        setIndex((prev) => (prev + 1) % items.length);
    });

    return (
        <div className="flex items-center">
            <DotLoader
                frames={items[index].frames}
                onComplete={next}
                className="gap-px"
                repeatCount={items[index].repeatCount ?? 1}
                duration={items[index].duration ?? 150}
                dotClassName="bg-white [&.active]:bg-[#111] size-8"
            />
        </div>
    );
};
