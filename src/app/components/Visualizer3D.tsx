"use client";

import { Bvh, Loader, OrbitControls, Stage, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Outline, Selection, Vignette } from "@react-three/postprocessing";
import { Suspense, useState } from "react";
import { LandCruiser } from "./100-lc";
import { LCTooltip } from "./LCTooltip";
import { PartNumberSidePanel } from "./PartNumberSidePanel";

// 1. Need to have part numbers

// 2. Need to have map lookup of data
// 3. Start with local cache, but use fast.api after

// 4. Model needs to be fixed to be accurate.
//    a. Bumper
//    b. Body
//    c. Front Lights
//    d. Door step up bar

// 5. Need to fix tooltip

// 6. Redesign Navbar

// 7. Move model to mesh model for post-processing selection

export const Visualizer3D = () => {
  const [selectedPartNumber, setSelectedPartNumber] = useState<string | undefined>();
  const [hoveredPartNumber, setHoveredPartNumber] = useState<string | undefined>();

  if (typeof document === undefined || typeof window === undefined) return;

  // const scale = window.devicePixelRatio ?? 1; // Change to 1 on retina screens to see blurry canvas.
  // const [dpr, setDpr] = useState(1.5);

  return (
    <LCTooltip hoveredPartNumber={hoveredPartNumber}>
      <Loader />
      <PartNumberSidePanel
        selectedPartNumber={selectedPartNumber}
        setSelectedPartNumber={setSelectedPartNumber}
      />
      <Suspense fallback={null}>
        <Canvas
          // dpr={dpr}
          // frameloop="demand"
          shadows
          dpr={2}
          gl={{ antialias: true }}
          camera={{
            position: [2.5, 0.5, 3.5],
            fov: 60,
            near: 0.01,
            far: 400,
          }}>
          {/** PerfMon will detect performance issues */}
          {/* <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} /> */}
          <Stats showPanel={0} />
          <Stats className="!left-20" showPanel={2} />
          <axesHelper args={[30]} />
          <color attach="background" args={["#C4BEB4"]} />
          <ambientLight intensity={0.5} />
          <Bvh firstHitOnly>
            <Selection>
              <EffectComposer multisampling={8} autoClear={false}>
                <Outline visibleEdgeColor={0xff0000} hiddenEdgeColor={0xff0000} edgeStrength={2} />
                <Vignette eskil={false} offset={0.1} darkness={0.5} />

                <Stage shadows={false} preset="rembrandt">
                  <LandCruiser
                    position={[-1.25, 0, 3]}
                    scale={0.1}
                    selectedPartNumber={selectedPartNumber}
                    setSelectedPartNumber={setSelectedPartNumber}
                    hoveredPartNumber={hoveredPartNumber}
                    setHoveredPartNumber={setHoveredPartNumber}
                  />
                </Stage>
              </EffectComposer>
            </Selection>
          </Bvh>
          <OrbitControls makeDefault />
        </Canvas>
      </Suspense>
    </LCTooltip>
  );
};
