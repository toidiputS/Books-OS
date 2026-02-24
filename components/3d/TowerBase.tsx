
import React, { Suspense } from 'react';
import { Text } from '@react-three/drei';
import { GOLD, DARK_GOLD } from './constants';

export function TowerBase({ x, y, z, rotY, height, towerIndex, towerLabel, towerSubtitle }: {
    x: number; y: number; z: number; rotY: number; height: number;
    towerIndex: number; towerLabel: string; towerSubtitle: string;
}) {
    return (
        <group position={[x, y, z]} rotation={[0, rotY, 0]}>
            {/* Block Mesh — dark obsidian */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[5.0, height, 2]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.85} />
            </mesh>

            {/* Gold engraving on the FRONT face */}
            <Suspense fallback={null}>
                <group position={[0, 0, 1.01]}>
                    {/* Tower number */}
                    <Text
                        position={[0, 0.7, 0]}
                        fontSize={0.14}
                        anchorX="center"
                        anchorY="middle"
                        letterSpacing={0.3}
                    >
                        {`TOWER ${towerIndex}`}
                        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={2.5} metalness={1} roughness={0.15} toneMapped={false} />
                    </Text>

                    {/* Month / name label */}
                    <Text
                        position={[0, 0.3, 0]}
                        fontSize={0.35}
                        anchorX="center"
                        anchorY="middle"
                        letterSpacing={0.08}
                    >
                        {towerLabel}
                        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={3.0} metalness={1} roughness={0.1} toneMapped={false} />
                    </Text>

                    {/* Decorative divider */}
                    <mesh position={[0, 0.05, 0]}>
                        <planeGeometry args={[2.0, 0.004]} />
                        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={1.5} toneMapped={false} />
                    </mesh>

                    {/* Subtitle */}
                    <Text
                        position={[0, -0.2, 0]}
                        fontSize={0.22}
                        anchorX="center"
                        anchorY="middle"
                        letterSpacing={0.1}
                    >
                        {towerSubtitle}
                        <meshStandardMaterial color={DARK_GOLD} emissive={DARK_GOLD} emissiveIntensity={1.5} metalness={1} roughness={0.25} toneMapped={false} />
                    </Text>
                </group>
            </Suspense>
        </group>
    );
}
