
import React, { Suspense, useState, useRef, useEffect, useMemo } from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Color, CanvasTexture, RepeatWrapping, Group, MathUtils } from 'three';
import * as THREE from 'three';


export type SpineProps = {
  title?: string;
  color?: string;
  spineLetter?: string;
  isEmpty?: boolean;
  thickness?: number;
  onFloat?: () => void;
  onClick?: (e: any) => void;
  [key: string]: any;
};

let leatherTexture: CanvasTexture | null = null;
const getLeatherTexture = () => {
  if (leatherTexture) return leatherTexture;
  if (typeof document === 'undefined') return null;

  const width = 256;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const grain = (Math.random() - 0.5) * 40;
      let val = 128 + grain;
      val = Math.max(0, Math.min(255, val));
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 10 + 2;
      ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#fff';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  leatherTexture = new CanvasTexture(canvas);
  leatherTexture.wrapS = RepeatWrapping;
  leatherTexture.wrapT = RepeatWrapping;
  leatherTexture.repeat.set(2, 4);
  return leatherTexture;
};

// Pre-allocate shared geometries and materials for performance
const sharedBoxGeo = new THREE.BoxGeometry(1, 1, 1);
const sharedPageGeo = new THREE.BoxGeometry(1, 1, 1);
const sharedEmptyMat = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.8, metalness: 0.1 });

export function BookSpine3D({ title, color = '#3e2723', spineLetter, isEmpty = false, thickness = 0.2, onFloat, onClick, ...rest }: SpineProps) {
  const visualGroupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHover] = useState(false);
  const hoverTime = useRef(0);
  const isFloatTriggered = useRef(false);
  const onFloatRef = useRef(onFloat);

  useEffect(() => { onFloatRef.current = onFloat; }, [onFloat]);

  const texture = useMemo(() => getLeatherTexture(), []);

  // Cache color object to avoid GC pressure
  const colorObj = useMemo(() => new THREE.Color(isEmpty ? '#1a1a1a' : color), [color, isEmpty]);
  const highlightColor = useMemo(() => new THREE.Color(isEmpty ? '#1a1a1a' : color).offsetHSL(0, 0, 0.05), [color, isEmpty]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = isEmpty ? 'copy' : 'pointer';
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered, isEmpty]);

  useFrame((state, delta) => {
    if (!visualGroupRef.current) return;

    const currentZ = visualGroupRef.current.position.z;
    const targetZ = hovered ? 0.35 : 0;

    // Only update position if it hasn't reached target or is hovered
    const needsPositionUpdate = Math.abs(currentZ - targetZ) > 0.001;
    const needsHoverLogic = hovered && !isEmpty && onFloatRef.current && !isFloatTriggered.current;

    if (!needsPositionUpdate && !needsHoverLogic && !hovered && (!materialRef.current || materialRef.current.emissiveIntensity < 0.001)) {
      return; // Skip work
    }

    if (needsHoverLogic) {
      hoverTime.current += delta;
      if (hoverTime.current > 0.2) {
        const intensity = Math.min((hoverTime.current - 0.2) * 0.005, 0.01);
        visualGroupRef.current.position.x = (Math.random() - 0.5) * intensity;
        visualGroupRef.current.position.y = (Math.random() - 0.5) * intensity;
      }
      if (materialRef.current) {
        const pulse = Math.sin(state.clock.elapsedTime * 15) * 0.5 + 0.5;
        const chargeLevel = Math.min(hoverTime.current / 2.0, 1.0);
        materialRef.current.emissive.setHSL(0.1, 1, 0.5);
        materialRef.current.emissiveIntensity = chargeLevel * 1.0 + (pulse * 0.5 * chargeLevel);
      }
      if (hoverTime.current > 2.0) {
        onFloatRef.current?.();
        isFloatTriggered.current = true;
        setHover(false);
        hoverTime.current = 0;
        visualGroupRef.current.position.x = 0;
        visualGroupRef.current.position.y = 0;
        if (materialRef.current) {
          materialRef.current.emissiveIntensity = 0;
        }
      }
    } else {
      hoverTime.current = 0;
      visualGroupRef.current.position.x = MathUtils.lerp(visualGroupRef.current.position.x, 0, delta * 10);
      visualGroupRef.current.position.y = MathUtils.lerp(visualGroupRef.current.position.y, 0, delta * 10);
      if (materialRef.current && materialRef.current.emissiveIntensity > 0) {
        materialRef.current.emissiveIntensity = MathUtils.lerp(materialRef.current.emissiveIntensity, 0, delta * 5);
      }
    }

    if (needsPositionUpdate) {
      visualGroupRef.current.position.z = MathUtils.lerp(currentZ, targetZ, delta * 12);
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    if (!hovered) {
      setHover(true);
      isFloatTriggered.current = false;
      hoverTime.current = 0;
    }
  };

  const handlePointerOut = (e: any) => {
    setHover(false);
    hoverTime.current = 0;
  };

  const height = 1.6;
  const depth = 1;
  const pageHeight = height - 0.08;
  const pageDepth = depth - 0.04;
  const pageThickness = thickness - 0.04;

  return (
    <group
      {...rest}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={onClick}
    >
      {/* Invisible hitbox - larger for easier selection */}
      <mesh visible={false}>
        <boxGeometry args={[thickness * 1.5, height, depth]} />
        <meshBasicMaterial />
      </mesh>

      <group ref={visualGroupRef}>
        {/* Main Spine Box - Performance Optimized */}
        <mesh
          scale={[thickness, height, depth]}
          castShadow={!isEmpty}
          receiveShadow
        >
          <primitive object={sharedBoxGeo} />
          <meshStandardMaterial
            ref={materialRef}
            color={hovered ? highlightColor : colorObj}
            roughness={0.7}
            metalness={0.15}
            bumpMap={texture || undefined}
            bumpScale={0.015}
            roughnessMap={texture || undefined}
          />
        </mesh>

        {/* Spine Letter - Now on the FRONT face (Z = 0.51) */}
        {spineLetter && !isEmpty && (
          <Suspense fallback={null}>
            <Text
              position={[0, 0.45, 0.51]}
              rotation={[0, 0, 0]}
              fontSize={0.15}
              maxWidth={0.18}
              anchorX="center"
              anchorY="middle"
              font="/fonts/Inter-Bold.woff" // Explicit font for stability
            >
              {spineLetter}
              <meshStandardMaterial
                color="#FFD700"
                metalness={1.0}
                roughness={0.12}
                emissive="#d4af37"
                emissiveIntensity={0.6}
                envMapIntensity={3.0}
                toneMapped={false}
              />
            </Text>
          </Suspense>
        )}

        {/* Pages - Performance Optimized */}
        {!isEmpty && (
          <mesh position={[0.01, 0, -0.02]} scale={[pageThickness, pageHeight, pageDepth]} castShadow>
            <primitive object={sharedPageGeo} />
            <meshStandardMaterial color="#f5e6d3" roughness={0.9} metalness={0.0} />
          </mesh>
        )}
      </group>
    </group>
  );
}
