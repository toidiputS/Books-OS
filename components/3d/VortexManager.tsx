
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLibrary } from '../../stores/library';
import { useShallow } from 'zustand/react/shallow';
import { BookSpine3D } from './BookSpine3D';

export function VortexManager() {
    const flyingIds = useLibrary(useShallow(s => Object.keys(s.bookStates).filter(id => s.bookStates[id] === 'flying')));
    const returnBookToShelf = useLibrary(s => s.returnBookToShelf);
    const setBookState = useLibrary(s => s.setBookState);
    const books = useLibrary(s => s.books);

    // Auto-return timers (local ref, not in store)
    const flyingTimers = useRef<Record<string, number>>({});

    // Physics state for floating books
    const physicsRefs = useRef<Record<string, {
        mesh: THREE.Group,
        phase: number[], // [p1, p2, p3, p4]
        baseRadius: number,
        heightOffset: number,
        orbitSpeed: number,
        tumbleSpeeds: THREE.Vector3,
        currentPos: THREE.Vector3 // For motion damping
    }>>({});

    useFrame((state, delta) => {
        const now = Date.now();
        const t = state.clock.getElapsedTime();

        flyingIds.forEach(id => {
            // Auto-return timer: assign on first sight, check expiration
            if (!flyingTimers.current[id]) {
                // Auto-return between 45 and 60 seconds
                flyingTimers.current[id] = now + 45000 + Math.random() * 15000;
            }
            if (now > flyingTimers.current[id]) {
                returnBookToShelf(id);
                delete physicsRefs.current[id];
                delete flyingTimers.current[id];
                return;
            }

            // Ensure physics object exists (safety for late mounting)
            if (!physicsRefs.current[id]) {
                return;
            }

            const phys = physicsRefs.current[id];
            if (phys.mesh) {
                // --- ORGANIC FLUID MOTION ---

                // 1. Noise-like drivers (Superimposed sine waves)
                const noise1 = Math.sin(t * 0.2 + phys.phase[0]);
                const noise2 = Math.cos(t * 0.45 + phys.phase[1]);
                const noise3 = Math.sin(t * 0.1 + phys.phase[2]);

                // 2. Vertical Movement:
                const targetY = phys.heightOffset
                    + (noise1 * 2.0)
                    + Math.sin(t * 0.5) * 0.5;

                // 3. Radial Movement:
                const r = phys.baseRadius + (noise2 * 2.0);

                // 4. Orbital Movement:
                const currentSpeed = phys.orbitSpeed * (1 + noise3 * 0.2);
                const theta = (t * currentSpeed) + phys.phase[3];

                const targetX = Math.cos(theta) * r;
                const targetZ = Math.sin(theta) * r;

                // MOTION DAMPING (Framerate-independent smoothing)
                const smoothing = 5; // Adjustment for "buttery" feel
                const alpha = 1 - Math.exp(-smoothing * delta);

                phys.currentPos.x = THREE.MathUtils.lerp(phys.currentPos.x, targetX, alpha);
                phys.currentPos.y = THREE.MathUtils.lerp(phys.currentPos.y, targetY, alpha);
                phys.currentPos.z = THREE.MathUtils.lerp(phys.currentPos.z, targetZ, alpha);

                phys.mesh.position.copy(phys.currentPos);

                // 5. Chaotic Tumble:
                phys.mesh.rotation.x += delta * (phys.tumbleSpeeds.x + noise1 * 0.1);
                phys.mesh.rotation.y += delta * (phys.tumbleSpeeds.y + noise2 * 0.1);
                phys.mesh.rotation.z += delta * (phys.tumbleSpeeds.z + noise3 * 0.1);
            }
        });
    });

    return (
        <>
            {flyingIds.map(id => {
                const book = books[id];
                if (!book) return null;

                return (
                    <group
                        key={id}
                        // Add click handler to catch floating books
                        onClick={(e) => {
                            e.stopPropagation();
                            setBookState(id, 'held');
                        }}
                        ref={(ref) => {
                            if (ref) {
                                // Initialize physics immediately upon mount
                                if (!physicsRefs.current[id]) {
                                    const baseRadius = 12 + Math.random() * 6;
                                    const heightOffset = 20 + Math.random() * 40;
                                    const phase = Array(4).fill(0).map(() => Math.random() * Math.PI * 2);

                                    const startX = Math.cos(phase[3]) * baseRadius;
                                    const startZ = Math.sin(phase[3]) * baseRadius;

                                    physicsRefs.current[id] = {
                                        mesh: ref,
                                        phase,
                                        baseRadius,
                                        heightOffset,
                                        orbitSpeed: (Math.random() - 0.5) * 0.05,
                                        tumbleSpeeds: new THREE.Vector3(
                                            (Math.random() - 0.5) * 0.2,
                                            (Math.random() - 0.5) * 0.2,
                                            (Math.random() - 0.5) * 0.2
                                        ),
                                        currentPos: new THREE.Vector3(startX, heightOffset, startZ)
                                    };

                                    ref.position.copy(physicsRefs.current[id].currentPos);
                                } else {
                                    physicsRefs.current[id].mesh = ref;
                                }
                            }
                        }}
                    >
                        <BookSpine3D title={book.title} color={book.spineColor} thickness={0.2} />
                    </group>
                );
            })}
        </>
    );
}
