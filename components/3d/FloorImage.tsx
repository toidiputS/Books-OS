import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

export function FloorImage() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.48, 0]} receiveShadow>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial
                color="#0f0f13"
                roughness={0.8}
                metalness={0.1}
            />
        </mesh>
    );
}
