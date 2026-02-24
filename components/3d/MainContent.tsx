
import React, { useMemo, useEffect, useState } from 'react';
import { useLibrary, TOWER_DEFS } from '../../stores/library';
import { TowerBase } from './TowerBase';
import { Shelf } from './Shelf';
import { Desk } from './Desk';
import { VortexManager } from './VortexManager';
import { HeldBookManager } from './HeldBookManager';
import { ExitSign } from './ExitSign';

export function MainContent() {
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
        Array.from({ length: TOWERS }).map((_, i) => (i * Math.PI * 2) / TOWERS), []
    );

    // Optimized shelf grouping
    const towerShelves = useMemo(() => {
        const groups: Record<number, any[]> = {};
        Object.values(shelves).forEach(shelf => {
            let t = shelf.towerIndex;
            // Fallback for existing persisted data
            if (t === undefined) {
                const towerKey = shelf.id.split('-')[1];
                t = TOWER_DEFS.findIndex(d => d.key === towerKey);
            }
            if (t === -1 || t === undefined) t = 0;
            if (!groups[t]) groups[t] = [];
            groups[t].push(shelf);
        });
        return groups;
    }, [shelves]);

    // Progressive loading limit
    const [limit, setLimit] = useState(1);
    useEffect(() => {
        const total = TOWERS * SHELVES_PER_TOWER;
        const interval = setInterval(() => {
            setLimit(prev => {
                if (prev >= total) {
                    clearInterval(interval);
                    return total;
                }
                return prev + 15;
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <group>
            {/* Tower Bases and Shelves */}
            {towerAngles.map((angle, i) => {
                const x = Math.cos(angle) * RADIUS;
                const z = Math.sin(angle) * RADIUS;
                const rotY = -angle - Math.PI / 2;

                const def = TOWER_DEFS[i] || { key: 'NULL', label: 'Archive', subtitle: 'Unlabeled' };

                return (
                    <group key={`tower-${i}`} position={[x, 0, z]} rotation={[0, rotY, 0]}>
                        <TowerBase
                            x={0} y={BLOCK_CENTER_Y} z={0}
                            rotY={0}
                            height={BLOCK_HEIGHT}
                            towerIndex={i + 1}
                            towerLabel={def.label}
                            towerSubtitle={def.subtitle}
                        />
                        {/* Shelves for this tower */}
                        {towerShelves[i]?.slice(0, Math.ceil(limit / TOWERS)).map((shelf, sIdx) => {
                            const shelfY = SHELF_START_Y + (sIdx * LEVEL_HEIGHT);
                            return (
                                <Shelf
                                    key={shelf.id}
                                    id={shelf.id}
                                    books={shelf.bookIds.map(bid => books[bid]).filter(Boolean)}
                                    y={shelfY}
                                    label={['NEXUS', 'BEFORE'].includes(def.key)
                                        ? `S${String(sIdx + 1).padStart(2, '0')}`
                                        : String(2026 + sIdx)}
                                />
                            );
                        })}
                    </group>
                );
            })}

            <Desk />
            <VortexManager />
            <HeldBookManager />
            <ExitSign />
        </group>
    );
}
