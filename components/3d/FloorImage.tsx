import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

export function FloorImage() {
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.load(
            '/assets/floor.png',
            (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.anisotropy = 16;
                tex.wrapS = THREE.RepeatWrapping;
                tex.wrapT = THREE.RepeatWrapping;
                // Repeat slightly if the image isn't natively huge, or just stretch it once if 1,1
                tex.repeat.set(1, 1);
                setTexture(tex);
            },
            undefined,
            (err) => {
                console.warn('[FloorImage] Failed to load floor texture', err);
            }
        );
    }, []);

    if (!texture) return null;

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.48, 0]} receiveShadow>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial
                map={texture}
                roughness={0.8}
                metalness={0.1}
            />
        </mesh>
    );
}
