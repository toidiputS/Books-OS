
import React, { Suspense, useState } from 'react';
import { Text } from '@react-three/drei';

export function ExitSign() {
    const [hovered, setHover] = useState(false);

    const handleExit = () => {
        window.location.href = 'https://itsyouonline.com';
    };

    return (
        <group position={[0, 195, 0]}
            onClick={(e) => { e.stopPropagation(); handleExit(); }}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
        >
            {/* Red torus ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[18, 0.5, 16, 100]} />
                <meshStandardMaterial
                    color="#ff0000"
                    emissive="#ff0000"
                    emissiveIntensity={hovered ? 8 : 4}
                    toneMapped={false}
                />
            </mesh>
            {/* EXIT text flat inside the circle */}
            <Suspense fallback={null}>
                <Text
                    position={[0, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={12}
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.3}
                >
                    EXIT
                    <meshStandardMaterial
                        color="#ff0000"
                        emissive="#ff0000"
                        emissiveIntensity={hovered ? 6 : 3}
                        toneMapped={false}
                    />
                </Text>
            </Suspense>
            {/* Invisible Hitbox */}
            <mesh visible={false}>
                <cylinderGeometry args={[19, 19, 5]} />
            </mesh>
        </group>
    );
}
