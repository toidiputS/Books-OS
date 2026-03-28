
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

export function FloorLogo() {
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.load(
            '/assets/logo.svg',
            (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.anisotropy = 16; // Maximize sharpness at grazing angles
                tex.minFilter = THREE.LinearMipMapLinearFilter;
                tex.magFilter = THREE.LinearFilter;
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
            <planeGeometry args={[36, 36]} />
            <meshBasicMaterial
                map={texture}
                transparent
                depthWrite={false}
                polygonOffset
                polygonOffsetFactor={-1}
            />
        </mesh>
    );
}
