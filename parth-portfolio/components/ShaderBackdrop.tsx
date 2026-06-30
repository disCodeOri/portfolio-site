"use client";

import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { useReducedMotion } from "framer-motion";

type ShaderBackdropProps = {
  className?: string;
};

export default function ShaderBackdrop({ className }: ShaderBackdropProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div aria-hidden="true" className={className} />;
  }

  return (
    <ShaderGradientCanvas
      className={className}
      fov={36}
      lazyLoad
      pixelDensity={0.75}
      pointerEvents="none"
      powerPreference="low-power"
    >
      <ShaderGradient
        animate="on"
        brightness={0.78}
        cAzimuthAngle={164}
        cDistance={4.8}
        cameraZoom={1.08}
        color1="#c9a84c"
        color2="#294235"
        color3="#070706"
        control="props"
        envPreset="city"
        grain="off"
        lightType="3d"
        positionX={0.1}
        positionY={-0.08}
        positionZ={0}
        reflection={0.16}
        rotationX={0}
        rotationY={0}
        rotationZ={72}
        type="sphere"
        uAmplitude={0.2}
        uDensity={0.9}
        uFrequency={1.7}
        uSpeed={0.08}
        uStrength={0.36}
      />
    </ShaderGradientCanvas>
  );
}
