
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerfBudget } from './PerfBudget';
import { useUI } from '../../stores/ui';
import { BakeShadows, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

import { PlayerController } from './PlayerController';
import { ObsidianFloor } from './ObsidianFloor';
import { FloorLogo } from './FloorLogo';
import { FloorImage } from './FloorImage';
import { MainContent } from './MainContent';

export function Scene3D({ isMobile = false }: { isMobile?: boolean }) {
    const ambientIntensity = 0.8;
    const mainLightIntensity = 0.6;
    const pillarLightIntensity = 0.8;
    const hemiIntensity = 0.4;
    const envIntensity = 0.5;

    return (
        <Canvas
            id="root"
            shadows
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.2 }}
        >
            <PerspectiveCamera makeDefault position={[0, 60, 0]} rotation={[-Math.PI / 2, 0, 0]} fov={isMobile ? 95 : 85} near={0.1} far={500} />
            <PlayerController isMobile={isMobile} />

            <color attach="background" args={['#030303']} />
            <fog attach="fog" args={['#030303', 10, 250]} />

            <ambientLight intensity={ambientIntensity} color="#fff5e6" />
            <hemisphereLight intensity={hemiIntensity} color="#fff5e6" groundColor="#1a0f0a" />
            <pointLight position={[0, 80, 0]} intensity={mainLightIntensity} color="#fffaf0" distance={200} decay={1} />
            <pointLight position={[0, 15, 0]} intensity={pillarLightIntensity} color="#fffaf0" distance={40} decay={2} />

            {/* Deep Obsidian Floor */}
            <ObsidianFloor />
            <FloorImage />
            <FloorLogo />

            <Suspense fallback={null}>
                <Environment preset="warehouse" environmentIntensity={envIntensity} />
            </Suspense>

            <Suspense fallback={null}>
                <MainContent />
                <BakeShadows />
            </Suspense>

            <PerfBudget />
        </Canvas>
    );
}
