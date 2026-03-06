export interface CanonPage {
    id: string;
    title: string;
    number: string;
    content: string;
}

export interface CanonChapter {
    id: string;
    number: string;
    title: string;
    description?: string;
    color?: string;
    pages: CanonPage[];
}

export interface CanonBook {
    id: string;
    title: string;
    number: string;
    subtitle: string;
    description?: string;
    chapters: CanonChapter[];
}
