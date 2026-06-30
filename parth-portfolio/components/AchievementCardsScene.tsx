"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import { easing } from "maath";
import { useMemo, useRef, type CSSProperties } from "react";
import * as THREE from "three";
import type { AchievementGroup } from "./AchievementFlow";
import styles from "./AchievementCardsScene.module.css";

type AchievementCardsSceneProps = {
  groups: AchievementGroup[];
  footers: Record<string, string>;
  hoveredId: string | null;
  selectedId: string | null;
  shouldReduceMotion: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
};

type CardPose = {
  position: [number, number, number];
  rotation: [number, number, number];
};

const cardPoses: CardPose[] = [
  { position: [-0.92, -0.82, 0.2], rotation: [-0.04, 0.4, -0.07] },
  { position: [0.16, 0.05, 0.58], rotation: [0.02, 0.12, 0.03] },
  { position: [1.24, -0.2, 0.46], rotation: [-0.03, -0.18, -0.03] },
  { position: [2.06, 0.56, 0.1], rotation: [0.04, -0.4, 0.08] },
];

const cardAccents: Record<string, string> = {
  athletics: "#ff315d",
  technology: "#2f6dff",
  business: "#7cffb2",
  leadership: "#f7f9ff",
};

export default function AchievementCardsScene({
  groups,
  footers,
  hoveredId,
  selectedId,
  shouldReduceMotion,
  onHover,
  onSelect,
}: AchievementCardsSceneProps) {
  return (
    <div className={styles.scene3d} aria-label="Achievement 3D card carousel">
      <Canvas
        camera={{ position: [0, 0.05, 7.25], fov: 35 }}
        className={styles.canvas}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#03050a"]} />
        <fog attach="fog" args={["#03050a", 5.6, 9.4]} />
        <ambientLight intensity={1.25} />
        <spotLight
          angle={0.5}
          color="#f7f9ff"
          intensity={3.8}
          penumbra={0.8}
          position={[0, 3.4, 5.4]}
        />
        <pointLight color="#7cffb2" intensity={1.7} position={[-3.4, -1.4, 3]} />
        <pointLight color="#ff315d" intensity={1.7} position={[3, 1.6, 2.4]} />
        <CardRig hoveredId={hoveredId} shouldReduceMotion={shouldReduceMotion}>
          {groups.map((group, index) => (
            <CardSlab
              accent={cardAccents[group.id] ?? "#2f6dff"}
              isActive={selectedId === group.id || hoveredId === group.id}
              key={group.id}
              pose={cardPoses[index]}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </CardRig>
        <ContactShadows
          blur={2.4}
          color="#000000"
          far={4.6}
          opacity={0.52}
          position={[0, -1.35, -0.22]}
          scale={7.5}
        />
      </Canvas>
      <div className={styles.cardContentLayer} aria-label="Achievement cards">
        {groups.map((group, index) => (
          <button
            aria-expanded={selectedId === group.id}
            className={`${styles.cardContent} ${
              selectedId === group.id || hoveredId === group.id
                ? styles.cardContentActive
                : ""
            }`}
            key={group.id}
            onBlur={() => onHover(null)}
            onClick={() => onSelect(group.id)}
            onFocus={() => onHover(group.id)}
            onPointerEnter={() => onHover(group.id)}
            onPointerLeave={() => onHover(null)}
            style={
              {
                "--card-accent": cardAccents[group.id] ?? "#2f6dff",
                "--card-x": `${cardOverlayPoses[index].x}%`,
                "--card-y": `${cardOverlayPoses[index].y}%`,
                "--card-rotate": `${cardOverlayPoses[index].rotate}deg`,
            } as CSSProperties
            }
            type="button"
          >
            <span className={styles.cardIndex}>{group.index}</span>
            <span className={styles.cardSignal}>{group.signal}</span>
            <strong>{group.title}</strong>
            <span className={styles.cardRule} />
            <small>{group.summary}</small>
            <span className={styles.cardFooter}>/ {footers[group.id]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const cardOverlayPoses = [
  { x: 39, y: 68, rotate: -4 },
  { x: 50, y: 50, rotate: 2 },
  { x: 67, y: 58, rotate: -2 },
  { x: 81, y: 36, rotate: 4 },
];

function CardRig({
  children,
  hoveredId,
  shouldReduceMotion,
}: {
  children: React.ReactNode;
  hoveredId: string | null;
  shouldReduceMotion: boolean;
}) {
  const rigRef = useRef<THREE.Group>(null);
  const targetRotation = hoveredId ? 0.03 : -0.04;

  useFrame((state, delta) => {
    if (!rigRef.current || shouldReduceMotion) {
      return;
    }

    easing.damp(rigRef.current.rotation, "y", state.pointer.x * 0.16, 0.35, delta);
    easing.damp(rigRef.current.rotation, "x", -state.pointer.y * 0.05, 0.35, delta);
    easing.damp(rigRef.current.rotation, "z", targetRotation, 0.35, delta);
    easing.damp3(
      state.camera.position,
      [state.pointer.x * -0.45, state.pointer.y * 0.22 + 0.05, 7.25],
      0.45,
      delta,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={rigRef} rotation={[0, 0, -0.04]}>
      {children}
    </group>
  );
}

function CardSlab({
  accent,
  isActive,
  pose,
  shouldReduceMotion,
}: {
  accent: string;
  isActive: boolean;
  pose: CardPose;
  shouldReduceMotion: boolean;
}) {
  const cardRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const basePosition = useMemo(() => new THREE.Vector3(...pose.position), [pose]);
  const activePosition = useMemo(
    () => new THREE.Vector3(pose.position[0], pose.position[1] + 0.08, pose.position[2] + 0.42),
    [pose],
  );

  useFrame((_, delta) => {
    if (!cardRef.current) {
      return;
    }

    const target = isActive ? activePosition : basePosition;
    if (shouldReduceMotion) {
      cardRef.current.position.copy(target);
      cardRef.current.scale.setScalar(isActive ? 1.045 : 1);
    } else {
      easing.damp3(cardRef.current.position, target, 0.25, delta);
      easing.damp3(cardRef.current.scale, isActive ? 1.075 : 1, 0.18, delta);
    }

    if (materialRef.current) {
      easing.damp(materialRef.current, "roughness", isActive ? 0.34 : 0.52, 0.2, delta);
      easing.damp(materialRef.current, "metalness", isActive ? 0.36 : 0.2, 0.2, delta);
    }
  });

  return (
    <group ref={cardRef} position={pose.position} rotation={pose.rotation}>
      <RoundedBox args={[1.72, 1.16, 0.1]} radius={0.14} smoothness={12}>
        <meshPhysicalMaterial
          ref={materialRef}
          clearcoat={0.68}
          clearcoatRoughness={0.24}
          color={isActive ? "#111827" : "#070b14"}
          emissive={new THREE.Color(accent)}
          emissiveIntensity={isActive ? 0.2 : 0.07}
          metalness={0.24}
          roughness={0.52}
        />
      </RoundedBox>
      <lineSegments position={[0, 0, 0.052]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.76, 1.2, 0.11)]} />
        <lineBasicMaterial color={accent} transparent opacity={isActive ? 0.95 : 0.42} />
      </lineSegments>
    </group>
  );
}
