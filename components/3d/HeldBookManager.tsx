
import React from 'react';
import { useLibrary } from '../../stores/library';
import { BookSpine3D } from './BookSpine3D';

export function HeldBookManager() {
    const selectedBookId = useLibrary(s => s.selectedBookId);
    const books = useLibrary(s => s.books);

    if (!selectedBookId) return null;
    const book = books[selectedBookId];
    if (!book) return null;

    return (
        <group position={[0, -1, -3]}>
            <BookSpine3D
                title={book.title}
                color={book.spineColor}
                thickness={0.2}
            />
        </group>
    );
}
