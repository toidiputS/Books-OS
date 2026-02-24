
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

export function FloorLogo() {
    // SVG files are unreliable with Three.js TextureLoader — use an error boundary approach
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.load(
            '/assets/y-a-logo.svg',
            (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                setTexture(tex);
            },
            undefined,
            () => {
                console.warn('[FloorLogo] Failed to load logo texture, skipping.');
            }
        );
    }, []);

    if (!texture) return null;

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.47, 0]}>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial
                map={texture}
                transparent
                opacity={0.8}
                color="#D4AF37"
                emissive="#D4AF37"
                emissiveIntensity={0.4}
                roughness={0.3}
                metalness={0.2}
                depthWrite={false}
                polygonOffset
                polygonOffsetFactor={-1}
            />
        </mesh>
    );
}
