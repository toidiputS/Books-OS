
import React, { Suspense, useMemo, useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame, createPortal } from '@react-three/fiber';
import { PerfBudget } from './PerfBudget';
import { Shelf } from './Shelf';
import { Desk } from './Desk';
import { BookSpine3D } from './BookSpine3D';
import { useLibrary, TOWER_DEFS } from '../../stores/library';
import { useUI } from '../../stores/ui';
import { useSystem } from '../../stores/system';
import { BakeShadows, PerspectiveCamera, PointerLockControls, Text, Environment, useTexture } from '@react-three/drei';
import type { BookLite, Shelf as LibraryShelf } from '../../stores/library';
import { useShallow } from 'zustand/react/shallow';
import * as THREE from 'three';


// --- COMPONENTS ---

const GOLD = '#D4AF37';
const DARK_GOLD = '#B8860B';

function ExitSign() {
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

function TowerBase({ x, y, z, rotY, height, towerIndex, towerLabel, towerSubtitle }: {
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

// --- PHYSICS & LOGIC ---

function VortexManager() {
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
        tumbleSpeeds: THREE.Vector3
    }>>({});

    useFrame((state, delta) => {
        const now = Date.now();
        const t = state.clock.getElapsedTime();

        flyingIds.forEach(id => {
            // Auto-return timer: assign on first sight, check expiration
            if (!flyingTimers.current[id]) {
                flyingTimers.current[id] = now + 20000 + Math.random() * 10000;
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
                const y = phys.heightOffset
                    + (noise1 * 2.0)
                    + Math.sin(t * 0.5) * 0.5;

                // 3. Radial Movement:
                const r = phys.baseRadius + (noise2 * 2.0);

                // 4. Orbital Movement:
                const currentSpeed = phys.orbitSpeed * (1 + noise3 * 0.2);
                const theta = (t * currentSpeed) + phys.phase[3];

                const x = Math.cos(theta) * r;
                const z = Math.sin(theta) * r;

                phys.mesh.position.set(x, y, z);

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
                                    physicsRefs.current[id] = {
                                        mesh: ref,
                                        phase: Array(4).fill(0).map(() => Math.random() * Math.PI * 2),
                                        baseRadius: 12 + Math.random() * 6,
                                        heightOffset: 20 + Math.random() * 40,
                                        orbitSpeed: (Math.random() - 0.5) * 0.05,
                                        tumbleSpeeds: new THREE.Vector3(
                                            (Math.random() - 0.5) * 0.2,
                                            (Math.random() - 0.5) * 0.2,
                                            (Math.random() - 0.5) * 0.2
                                        )
                                    };
                                    const p = physicsRefs.current[id];
                                    ref.position.set(
                                        Math.cos(p.phase[3]) * p.baseRadius,
                                        p.heightOffset,
                                        Math.sin(p.phase[3]) * p.baseRadius
                                    );
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

function HeldBookManager() {
    const heldId = useLibrary(s => Object.keys(s.bookStates).find(id => s.bookStates[id] === 'held'));
    const books = useLibrary(s => s.books);
    const select = useLibrary(s => s.select);
    const { camera } = useThree();
    const groupRef = useRef<THREE.Group>(null);
    const book = heldId ? books[heldId] : null;

    useFrame((state) => {
        if (groupRef.current && book) {
            const time = state.clock.getElapsedTime();
            // Position: Bring closer and center-right.
            // Rotation: Rotate 90 degrees (PI/2) on Y to show the cover (Side Face).
            // Sway: Gentle floating effect.
            groupRef.current.position.set(0.35, -0.25 + Math.sin(time * 1.5) * 0.01, -0.5);
            groupRef.current.rotation.set(
                0.1, // Slight tilt back
                Math.PI / 2 + Math.cos(time * 0.8) * 0.05, // Show cover + gentle yaw
                Math.sin(time * 1) * 0.02 // Gentle roll
            );
        }
    });

    if (!book) return null;

    return createPortal(
        <group
            ref={groupRef}
            onClick={(e) => {
                e.stopPropagation();
                select(book.id);
            }}
        >
            {/* Scale up slightly for held view */}
            <BookSpine3D title={book.title} color={book.spineColor} thickness={0.2} scale={[1.3, 1.3, 1.3]} />
        </group>,
        camera
    );
}

function PlayerController({ isMobile }: { isMobile: boolean }) {
    const { camera, gl } = useThree();
    const cameraSpeed = useSystem(s => s.cameraSpeed);
    const keys = useSystem(s => s.keys);
    const user = useSystem(s => s.user);
    const view = useUI(s => s.view);
    const isCatalogOpen = useUI(s => s.isCatalogOpen);
    const isSettingsOpen = useUI(s => s.isSettingsOpen);
    const selectedBookId = useLibrary(s => s.selectedBookId);

    const isOverlayOpen = isCatalogOpen || isSettingsOpen || !!selectedBookId || !user.isAuthenticated;

    useEffect(() => {
        if (view === 'stacks') {
            camera.position.set(0, 60, 0);
            camera.rotation.set(-Math.PI / 2, 0, 0);
        }
    }, [view, camera]);

    const moveState = useRef({ forward: false, backward: false, left: false, right: false, up: false, down: false, run: false });

    useEffect(() => {
        const onKey = (e: KeyboardEvent, down: boolean) => {
            const k = e.code;
            if (k === keys.forward) moveState.current.forward = down;
            if (k === keys.backward) moveState.current.backward = down;
            if (k === keys.left) moveState.current.left = down;
            if (k === keys.right) moveState.current.right = down;
            if (k === keys.up) moveState.current.up = down;
            if (k === keys.down) moveState.current.down = down;
            if (k === keys.run) moveState.current.run = down;
        };
        const onKeyDown = (e: KeyboardEvent) => onKey(e, true);
        const onKeyUp = (e: KeyboardEvent) => onKey(e, false);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [keys]);

    useEffect(() => {
        if (!isMobile) return;
        let lastX = 0;
        let lastY = 0;
        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;
            }
        };
        const onTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const clientX = e.touches[0].clientX;
                const clientY = e.touches[0].clientY;
                const deltaX = clientX - lastX;
                const deltaY = clientY - lastY;
                lastX = clientX;
                lastY = clientY;
                const sensitivity = 0.005 * cameraSpeed;
                camera.rotation.y -= deltaX * sensitivity;
                const newPitch = camera.rotation.x - (deltaY * sensitivity);
                camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newPitch));
            }
        };
        const canvas = gl.domElement;
        canvas.addEventListener('touchstart', onTouchStart, { passive: false });
        canvas.addEventListener('touchmove', onTouchMove, { passive: false });
        return () => {
            canvas.removeEventListener('touchstart', onTouchStart);
            canvas.removeEventListener('touchmove', onTouchMove);
        };
    }, [isMobile, camera, gl, cameraSpeed]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (view !== 'stacks') return;
            const strength = 0.05 * cameraSpeed;
            let delta = -e.deltaY * strength;
            delta = Math.max(-5, Math.min(5, delta));
            const camDirection = new THREE.Vector3();
            camera.getWorldDirection(camDirection);
            camera.position.addScaledVector(camDirection, delta);
            if (camera.position.y < 2.0) camera.position.y = 2.0;
            if (camera.position.y > 190) camera.position.y = 190;
        };
        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [view, camera, cameraSpeed]);

    // Middle-click (scroll wheel click) to unlock cursor
    useEffect(() => {
        const handleMiddleClick = (e: MouseEvent) => {
            if (e.button === 1 && document.pointerLockElement) {
                e.preventDefault();
                document.exitPointerLock();
            }
        };
        window.addEventListener('mousedown', handleMiddleClick);
        return () => window.removeEventListener('mousedown', handleMiddleClick);
    }, []);

    useFrame((state, delta) => {
        if (view !== 'stacks') return;
        if (document.pointerLockElement) {
            state.pointer.x = 0;
            state.pointer.y = 0;
        }
        if (camera.position.y > 190) camera.position.y = 190;
        const baseSpeed = 8.0 * cameraSpeed;
        const speed = moveState.current.run ? baseSpeed * 3.0 : baseSpeed;
        const camDirection = new THREE.Vector3();
        camera.getWorldDirection(camDirection);
        const camRight = new THREE.Vector3().crossVectors(camDirection, new THREE.Vector3(0, 1, 0)).normalize();
        if (moveState.current.forward) camera.position.addScaledVector(camDirection, speed * delta);
        if (moveState.current.backward) camera.position.addScaledVector(camDirection, -speed * delta);
        if (moveState.current.left) camera.position.addScaledVector(camRight, -speed * delta);
        if (moveState.current.right) camera.position.addScaledVector(camRight, speed * delta);
        if (moveState.current.up) camera.position.y += speed * delta;
        if (moveState.current.down) camera.position.y -= speed * delta;
        if (camera.position.y < 2.0) camera.position.y = 2.0;
    });

    return (view === 'stacks' && !isMobile && !isOverlayOpen) ? <PointerLockControls /> : null;
}

// ── Procedural Deep Obsidian Floor with System Grid ──
function createObsidianTexture(): THREE.CanvasTexture {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Base color — absolute deep black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);

    // Subtle Grid Lines
    const gridSize = 128; // Size of each grid square
    ctx.strokeStyle = '#D4AF37'; // Gold/Amber
    ctx.lineWidth = 1;

    // Grid with varying opacity for depth
    for (let y = 0; y <= size; y += gridSize) {
        ctx.globalAlpha = 0.02;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
    }

    for (let x = 0; x <= size; x += gridSize) {
        ctx.globalAlpha = 0.02;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();
    }

    // Intersections — tiny glowing points
    ctx.globalAlpha = 0.1;
    for (let x = 0; x <= size; x += gridSize) {
        for (let y = 0; y <= size; y += gridSize) {
            ctx.beginPath();
            ctx.arc(x, y, 0.8, 0, Math.PI * 2);
            ctx.fillStyle = '#D4AF37';
            ctx.fill();
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(16, 16);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

const obsidianTextureCache = { tex: null as THREE.CanvasTexture | null };
function getObsidianTexture() {
    if (!obsidianTextureCache.tex) obsidianTextureCache.tex = createObsidianTexture();
    return obsidianTextureCache.tex;
}

function ObsidianFloor() {
    const texture = useMemo(() => getObsidianTexture(), []);
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial
                map={texture}
                emissiveMap={texture}
                emissive="#D4AF37"
                emissiveIntensity={0.25}
                roughness={0.1}
                metalness={0.5}
                envMapIntensity={0.5}
            />
        </mesh>
    );
}

function FloorLogo() {
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
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.48, 0]}>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial
                map={texture}
                transparent
                opacity={0.35}
                roughness={0.7}
                metalness={0.1}
                depthWrite={false}
            />
        </mesh>
    );
}

function MainContent() {
    const shelves = useLibrary((s) => s.shelves);
    const books = useLibrary((s) => s.books);

    const TOWERS = 14;
    const RADIUS = 18;
    const LEVEL_HEIGHT = 3.5;
    const VISUAL_FLOOR_Y = -2.5;
    const SHELF_START_Y = 1.5;
    const BLOCK_HEIGHT = 3.0; // Fixed base pedestal height
    const BLOCK_CENTER_Y = VISUAL_FLOOR_Y + (BLOCK_HEIGHT / 2); // Block sits on floor
    const SHELVES_PER_TOWER = 30;
    const BASE_YEAR = 2026;

    // Pre-compute tower angles (14 evenly spaced)
    const towerAngles = useMemo(() =>
        TOWER_DEFS.map((_, i) => (i / TOWERS) * Math.PI * 2),
        []);

    // Tower base blocks
    const towerBases = useMemo(() =>
        TOWER_DEFS.map((tower, i) => {
            const angle = towerAngles[i];
            return {
                key: `tower-base-${tower.key}`,
                x: Math.cos(angle) * RADIUS,
                z: Math.sin(angle) * RADIUS,
                y: BLOCK_CENTER_Y,
                rotY: -angle - Math.PI / 2,
                towerIndex: tower.index,
                towerLabel: tower.label,
                towerSubtitle: tower.subtitle,
            };
        }),
        [towerAngles, BLOCK_CENTER_Y]);

    // Shelf positions — 14 towers × 30 levels stacked vertically
    const shelfPositions = useMemo(() => {
        const positions: {
            key: string; x: number; y: number; z: number;
            rotY: number; label: string; shelfId: string;
        }[] = [];

        TOWER_DEFS.forEach((tower, towerIdx) => {
            const angle = towerAngles[towerIdx];
            const x = Math.cos(angle) * RADIUS;
            const z = Math.sin(angle) * RADIUS;
            const rotY = -angle - Math.PI / 2;

            for (let level = 0; level < SHELVES_PER_TOWER; level++) {
                const lvl = (level + 1).toString().padStart(2, '0');
                let shelfId: string;
                let label: string;

                if (tower.key === 'NEXUS' || tower.key === 'BEFORE') {
                    shelfId = `TOWER-${tower.key}-SHELF-${lvl}`;
                    label = `SHELF ${level + 1}`;
                } else {
                    const year = BASE_YEAR + level;
                    shelfId = `TOWER-${tower.key}-YEAR-${year}`;
                    label = `${year}`;
                }

                const y = SHELF_START_Y + (level * LEVEL_HEIGHT);
                positions.push({ key: shelfId, x, y, z, rotY, label, shelfId });
            }
        });

        return positions;
    }, [towerAngles]);

    // Progressive loading — batch in shelves to avoid frame drops
    const [limit, setLimit] = useState(0);
    useEffect(() => {
        if (shelfPositions.length < 50) {
            setLimit(shelfPositions.length);
            return;
        }
        let current = 0;
        const batchSize = 42;
        const interval = setInterval(() => {
            current += batchSize;
            setLimit(c => Math.min(c + batchSize, shelfPositions.length));
            if (current >= shelfPositions.length) {
                clearInterval(interval);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [shelfPositions.length]);

    return (
        <>
            {/* Tower bases with gold engravings */}
            {towerBases.map((base) => (
                <TowerBase
                    key={base.key}
                    x={base.x}
                    y={base.y}
                    z={base.z}
                    rotY={base.rotY}
                    height={BLOCK_HEIGHT}
                    towerIndex={base.towerIndex}
                    towerLabel={base.towerLabel}
                    towerSubtitle={base.towerSubtitle}
                />
            ))}

            {/* Shelves — stacked vertically per tower */}
            {shelfPositions.slice(0, limit).map((pos) => {
                const shelf = shelves[pos.shelfId];
                if (!shelf) return null;
                const bookDetails = shelf.bookIds
                    .map(id => books[id])
                    .filter((b): b is BookLite => !!b);

                return (
                    <group key={pos.key} position={[pos.x, pos.y, pos.z]} rotation={[0, pos.rotY, 0]}>
                        <Shelf id={shelf.id} title={shelf.title} books={bookDetails} label={pos.label} />
                    </group>
                );
            })}

            {/* Center display pillar */}
            <group position={[0, 0, 0]}>
                <Desk />
            </group>

            <VortexManager />
            <HeldBookManager />
            <ExitSign />
        </>
    );
}

export function Scene3D({ isMobile = false }: { isMobile?: boolean }) {
    const lightingLevel = useSystem((s) => s.lightingLevel);
    // Lowered lighting for moodier archive atmosphere
    const ambientIntensity = 0.1 + (lightingLevel * 0.3);
    const hemiIntensity = 0.05 + (lightingLevel * 0.2);
    const mainLightIntensity = lightingLevel * 1.2;
    const pillarLightIntensity = 0.8 + (lightingLevel * 0.6);
    const envIntensity = 0.15 + (lightingLevel * 0.4);

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

            {/* Obsidian Floor with Gold Veins */}
            <ObsidianFloor />


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
