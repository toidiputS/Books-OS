
import React, { useMemo } from 'react';
import * as THREE from 'three';

// ── Procedural Deep Obsidian Floor ──
function createObsidianTexture(): THREE.CanvasTexture {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Base color — absolute deep black
    ctx.fillStyle = '#020202';
    ctx.fillRect(0, 0, size, size);

    // Extremely faint gold veins
    for (let i = 0; i < 40; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;

        ctx.beginPath();
        const opacity = 0.15 + Math.random() * 0.15;
        ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
        ctx.lineWidth = 1.0 + Math.random() * 1.5;

        let curX = x;
        let curY = y;
        ctx.moveTo(curX, curY);

        for (let j = 0; j < 15; j++) {
            curX += (Math.random() - 0.5) * 50;
            curY += (Math.random() - 0.2) * 30;
            ctx.lineTo(curX, curY);
        }
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

const obsidianTextureCache = { tex: null as THREE.CanvasTexture | null };
function getObsidianTexture() {
    if (!obsidianTextureCache.tex) obsidianTextureCache.tex = createObsidianTexture();
    return obsidianTextureCache.tex;
}

export function ObsidianFloor() {
    const texture = useMemo(() => getObsidianTexture(), []);
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial
                map={texture}
                roughness={0.9}
                metalness={0.5}
                envMapIntensity={0.02}
            />
        </mesh>
    );
}
