
import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSystem } from '../../stores/system';
import { useUI } from '../../stores/ui';
import { useLibrary } from '../../stores/library';
import { moveFlags, setMoveFlag, resetMoveFlags } from '../../stores/moveState';

export function PlayerController({ isMobile }: { isMobile: boolean }) {
    const { camera, gl } = useThree();
    const cameraSpeed = useSystem(s => s.cameraSpeed);
    const keys = useSystem(s => s.keys);
    const user = useSystem(s => s.user);
    const view = useUI(s => s.view);
    const isCatalogOpen = useUI(s => s.isCatalogOpen);
    const isSettingsOpen = useUI(s => s.isSettingsOpen);
    const isCanonOpen = useUI(s => s.isCanonOpen);
    const selectedBookId = useLibrary(s => s.selectedBookId);

    const isOverlayOpen = isCatalogOpen || isSettingsOpen || isCanonOpen || !!selectedBookId || !user.isAuthenticated;

    // Velocity for damping
    const velocity = useRef(new THREE.Vector3());

    useEffect(() => {
        if (view === 'stacks') {
            camera.position.set(0, 60, 0);
            camera.rotation.set(-Math.PI / 2, 0, 0);
            velocity.current.set(0, 0, 0);
        }
    }, [view, camera]);

    // Reset move flags when overlay opens
    useEffect(() => {
        if (isOverlayOpen) resetMoveFlags();
    }, [isOverlayOpen]);

    // Keyboard-driven move flags
    useEffect(() => {
        const onKey = (e: KeyboardEvent, down: boolean) => {
            const k = e.code;
            if (k === keys.forward) setMoveFlag('forward', down);
            if (k === keys.backward) setMoveFlag('backward', down);
            if (k === keys.left) setMoveFlag('left', down);
            if (k === keys.right) setMoveFlag('right', down);
            if (k === keys.up) setMoveFlag('up', down);
            if (k === keys.down) setMoveFlag('down', down);
            if (k === keys.run) setMoveFlag('run', down);
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

    // Touch look (mobile only)
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

    // Wheel zoom (stacks view)
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

        const baseSpeed = 40.0 * cameraSpeed;
        const speed = moveFlags.run ? baseSpeed * 3.0 : baseSpeed;
        const friction = 10.0;

        const input = new THREE.Vector3();
        if (moveFlags.forward) input.z += 1;
        if (moveFlags.backward) input.z -= 1;
        if (moveFlags.left) input.x -= 1;
        if (moveFlags.right) input.x += 1;
        if (moveFlags.up) input.y += 1;
        if (moveFlags.down) input.y -= 1;

        if (input.lengthSq() > 0) input.normalize();

        const camDirection = new THREE.Vector3();
        camera.getWorldDirection(camDirection);
        const camRight = new THREE.Vector3().crossVectors(camDirection, new THREE.Vector3(0, 1, 0)).normalize();

        const targetVelocity = new THREE.Vector3();
        targetVelocity.addScaledVector(camDirection, input.z * speed);
        targetVelocity.addScaledVector(camRight, input.x * speed);
        targetVelocity.y += input.y * speed;

        const alpha = 1 - Math.exp(-friction * delta);
        velocity.current.lerp(targetVelocity, alpha);

        camera.position.addScaledVector(velocity.current, delta);

        if (camera.position.y < 2.0) {
            camera.position.y = 2.0;
            velocity.current.y = Math.max(0, velocity.current.y);
        }
        if (camera.position.y > 190) {
            camera.position.y = 190;
            velocity.current.y = Math.min(0, velocity.current.y);
        }
    });

    return (view === 'stacks' && !isMobile && !isOverlayOpen) ? <PointerLockControls /> : null;
}
