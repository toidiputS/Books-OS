
import React, { Suspense, useState, useEffect } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import { useLibrary } from '../../stores/library';
import * as THREE from 'three';

export function Desk() {
  const libraryCardName = useLibrary((s) => s.libraryCardName);
  const [hovered, setHover] = useState(false);

  const openAuth = (e: any) => {
    e.stopPropagation();
    window.dispatchEvent(new Event('open-auth'));
  };

  const GOLD = '#D4AF37';
  const PILLAR_HEIGHT = 1.75;
  const PILLAR_RADIUS = 0.5;

  return (
    <group position={[0, -2.5, 0]}>

      {/* === DISPLAY PILLAR === */}
      <group position={[0, 0, 0]}>
        {/* Base platform — dark stone */}
        <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.2, 1.4, 0.2, 32]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Gold ring around base */}
        <mesh position={[0, 0.21, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.02, 8, 64]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={1.5}
            metalness={1}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>

        {/* Main pillar column */}
        <mesh position={[0, PILLAR_HEIGHT / 2 + 0.2, 0]} castShadow>
          <cylinderGeometry args={[PILLAR_RADIUS, PILLAR_RADIUS + 0.1, PILLAR_HEIGHT, 32]} />
          <meshStandardMaterial color="#0e0e0e" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Capital — gold-trimmed top plate */}
        <mesh position={[0, PILLAR_HEIGHT + 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.9, PILLAR_RADIUS, 0.15, 32]} />
          <meshStandardMaterial color="#111" roughness={0.15} metalness={0.9} />
        </mesh>
        <mesh position={[0, PILLAR_HEIGHT + 0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.015, 8, 64]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={2.0}
            metalness={1}
            roughness={0.15}
            toneMapped={false}
          />
        </mesh>

        {/* === THE YOUNIVERSE BOOK === */}
        <group position={[0, PILLAR_HEIGHT + 0.55, 0]}>
          {/* Book body — rich dark cover */}
          <RoundedBox
            args={[1.4, 0.18, 1.0]}
            radius={0.02}
            smoothness={2}
            castShadow
          >
            <meshStandardMaterial
              color="#1a0f0a"
              roughness={0.5}
              metalness={0.3}
            />
          </RoundedBox>

          {/* Gold spine accent */}
          <mesh position={[-0.71, 0, 0]}>
            <boxGeometry args={[0.02, 0.19, 1.01]} />
            <meshStandardMaterial
              color={GOLD}
              emissive={GOLD}
              emissiveIntensity={2.0}
              metalness={1}
              roughness={0.15}
              toneMapped={false}
            />
          </mesh>

          {/* Title on top cover */}
          <Suspense fallback={null}>
            <Text
              position={[0, 0.1, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.12}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.25}
            >
              THE YOUNIVERSE
              <meshStandardMaterial
                color={GOLD}
                emissive={GOLD}
                emissiveIntensity={3.0}
                metalness={1}
                roughness={0.1}
                toneMapped={false}
              />
            </Text>

            {/* Decorative line under title */}
            <mesh position={[0, 0.1, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.8, 0.003]} />
              <meshStandardMaterial
                color={GOLD}
                emissive={GOLD}
                emissiveIntensity={2.0}
                toneMapped={false}
              />
            </mesh>

            {/* Logo emblem on book cover */}
            <LogoEmblem />

            {/* Subtitle */}
            <Text
              position={[0, 0.1, 0.28]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.04}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.15}
            >
              YOUR LIVING ARCHIVE
              <meshStandardMaterial
                color={GOLD}
                emissive={GOLD}
                emissiveIntensity={1.5}
                metalness={1}
                roughness={0.2}
                toneMapped={false}
              />
            </Text>
          </Suspense>

          {/* Soft spotlight on the book */}
          <pointLight
            position={[0, 1.5, 0]}
            intensity={3.0}
            color="#fffaf0"
            distance={8}
            decay={2}
          />
        </group>

        {/* === NAMEPLATE === */}
        <group
          position={[0, PILLAR_HEIGHT * 0.55, PILLAR_RADIUS + 0.06]}
          rotation={[0, 0, 0]}
          onClick={openAuth}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
        >
          <mesh castShadow>
            <boxGeometry args={[1.0, 0.3, 0.04]} />
            <meshStandardMaterial
              color="#050505"
              roughness={0.15}
              metalness={0.95}
              emissive={hovered ? '#111' : '#000'}
            />
          </mesh>
          <Suspense fallback={null}>
            <Text
              position={[0, 0, 0.025]}
              fontSize={0.12}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.08}
            >
              {libraryCardName ? libraryCardName.toUpperCase() : "LOGIN"}
              <meshStandardMaterial
                color={GOLD}
                emissive={GOLD}
                emissiveIntensity={2.5}
                toneMapped={false}
              />
            </Text>
          </Suspense>
        </group>

      </group>
    </group>
  );
}

// Logo emblem rendered on the Youniverse book cover
function LogoEmblem() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      '/assets/icon-192.png',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      () => console.warn('[LogoEmblem] Failed to load icon texture, skipping.')
    );
  }, []);

  if (!texture) return null;

  return (
    <mesh position={[0, 0.101, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.06, 32]} />
      <meshStandardMaterial
        map={texture}
        transparent
        emissive="#D4AF37"
        emissiveIntensity={0.3}
        toneMapped={false}
      />
    </mesh>
  );
}
