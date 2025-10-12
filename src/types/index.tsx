import type { User as FirebaseUser } from 'firebase/auth';

export type User = FirebaseUser;

export interface Materia {
    id: string;
    nombre: string;
    ano: number;
    correlativas: string[];
}

export interface Carrera {
    id: string;
    nombre: string;
    materias: Materia[];
}

export interface UserProgress {
    [key: string]: string;
}

export const estados = {
    NO_CURSADA: 'No Cursada',
    CURSANDO: 'Cursando',
    APROBADA_CURSADA: 'Aprobada (Cursada)',
    APROBADA_FINAL: 'Aprobada (Final)'
} as const;