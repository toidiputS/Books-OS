
import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSystem } from '../../stores/system';
import { useUI } from '../../stores/ui';
import { useLibrary } from '../../stores/library';

export function PlayerController({ isMobile }: { isMobile: boolean }) {
    const { camera, gl } = useThree();
    const cameraSpeed = useSystem(s => s.cameraSpeed);
    const keys = useSystem(s => s.keys);
    const user = useSystem(s => s.user);
    const view = useUI(s => s.view);
    const isCatalogOpen = useUI(s => s.isCatalogOpen);
    const isSettingsOpen = useUI(s => s.isSettingsOpen);
    const selectedBookId = useLibrary(s => s.selectedBookId);

    const isOverlayOpen = isCatalogOpen || isSettingsOpen || !!selectedBookId || !user.isAuthenticated;

    // Movement state
    const moveState = useRef({ forward: false, backward: false, left: false, right: false, up: false, down: false, run: false });

    // Velocity for damping
    const velocity = useRef(new THREE.Vector3());

    useEffect(() => {
        if (view === 'stacks') {
            camera.position.set(0, 60, 0);
            camera.rotation.set(-Math.PI / 2, 0, 0);
            velocity.current.set(0, 0, 0);
        }
    }, [view, camera]);

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

        const baseSpeed = 40.0 * cameraSpeed; // Higher base for damping
        const speed = moveState.current.run ? baseSpeed * 3.0 : baseSpeed;
        const friction = 10.0;

        const input = new THREE.Vector3();
        if (moveState.current.forward) input.z += 1;
        if (moveState.current.backward) input.z -= 1;
        if (moveState.current.left) input.x -= 1;
        if (moveState.current.right) input.x += 1;
        if (moveState.current.up) input.y += 1;
        if (moveState.current.down) input.y -= 1;

        if (input.lengthSq() > 0) input.normalize();

        // Calculate world direction vectors
        const camDirection = new THREE.Vector3();
        camera.getWorldDirection(camDirection);
        const camRight = new THREE.Vector3().crossVectors(camDirection, new THREE.Vector3(0, 1, 0)).normalize();

        // Translate local input to world velocity
        const targetVelocity = new THREE.Vector3();
        targetVelocity.addScaledVector(camDirection, input.z * speed);
        targetVelocity.addScaledVector(camRight, input.x * speed);
        targetVelocity.y += input.y * speed;

        // Apply Damping (Framerate-independent exponential decay)
        const alpha = 1 - Math.exp(-friction * delta);
        velocity.current.lerp(targetVelocity, alpha);

        camera.position.addScaledVector(velocity.current, delta);

        // Bounds
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
