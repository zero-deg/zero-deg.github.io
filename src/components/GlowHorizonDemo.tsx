import GlowHorizonFM from "@/components/ui/glow-horizon";
import { AnimatedTitleFM } from "../components/ui/glow-horizon-utils/animated-title-fm";

export default function GlowHorizonDemo() {
  return (
    <div 
      className="relative overflow-hidden w-full h-[80vh] md:h-screen lg:h-[80vh] bg-[#050507] border border-white/5 flex flex-col justify-center items-center"
      style={{ isolation: "isolate" }}
    >
      <GlowHorizonFM variant="top" />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <AnimatedTitleFM open={true} />
      </div>
    </div>
  );
}
