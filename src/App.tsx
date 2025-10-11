// src/App.tsx

import { useState, useEffect } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    setPersistence, 
    browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

import { auth, db } from './firebase/config.ts';
import type { User, UserProgress, Carrera } from './types/index.ts';
import AuthView from './views/AuthView.tsx';
import AppView from './views/AppView.tsx';

const carrera: Carrera = {
    id: 'ing-inf',
    nombre: 'Ingeniería en Informática',
    materias: [
        { id: '1', nombre: 'Análisis Matemático I', ano: 1, correlativas: [] },
        { id: '2', nombre: 'Álgebra y Geometría Analítica I', ano: 1, correlativas: [] },
        { id: '3', nombre: 'Matemática Discreta', ano: 1, correlativas: [] },
        { id: '4', nombre: 'Sistemas y Organizaciones', ano: 1, correlativas: [] },
        { id: '5', nombre: 'Arquitectura de Computadores', ano: 1, correlativas: [] },
        { id: '6', nombre: 'Algoritmos y Estructuras de Datos', ano: 1, correlativas: [] },
        { id: '7', nombre: 'Análisis Matemático II', ano: 2, correlativas: ['1', '2'] },
        { id: '8', nombre: 'Probabilidad y Estadística', ano: 2, correlativas: ['1', '2'] },
        { id: '9', nombre: 'Física I', ano: 2, correlativas: ['1', '2'] },
        { id: '10', nombre: 'Sintaxis y Semántica de los Lenguajes', ano: 2, correlativas: ['3', '6'] },
        { id: '11', nombre: 'Paradigmas de Programación', ano: 2, correlativas: ['6'] },
        { id: '12', nombre: 'Sistemas Operativos', ano: 2, correlativas: ['5', '6'] },
    ]
};

export default function App() {
    const [user, setUser] = useState<User | null>(null);
    const [userProgress, setUserProgress] = useState<UserProgress>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) {
            setUserProgress({});
            return;
        }
        const docRef = doc(db, `users/${user.uid}/progress`, carrera.id);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            setUserProgress(docSnap.exists() ? docSnap.data() as UserProgress : {});
        });
        return () => unsubscribe();
    }, [user]);

    const handleRegister = async (email: string, password: string) => {
        setError('');
        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err: unknown) {
            if (typeof err === 'object' && err !== null && 'code' in err) {
                const firebaseError = err as { code: string };
                if (firebaseError.code === 'auth/email-already-in-use') {
                    setError("El correo ya está en uso.");
                } else {
                    setError("Ocurrió un error al registrar.");
                }
            } else {
                setError("Ocurrió un error desconocido.");
            }
        }
    };

    const handleLogin = async (email: string, password: string) => {
        setError('');
        try {
            await setPersistence(auth, browserLocalPersistence);
            await signInWithEmailAndPassword(auth, email, password);
        } catch { // <-- CORRECCIÓN AQUÍ: Eliminamos la variable 'err' que no se usaba
            setError("Email o contraseña incorrectos.");
        }
    };

    const handleLogout = () => {
        signOut(auth);
    };

    const handleStatusChange = async (materiaId: string, nuevoEstado: string) => {
        if (!user) return;
        const docRef = doc(db, `users/${user.uid}/progress`, carrera.id);
        try {
            await setDoc(docRef, { [materiaId]: nuevoEstado }, { merge: true });
        } catch (err) {
            console.error("Error al guardar el progreso: ", err);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen font-bold text-xl">Cargando...</div>;
    }

    return user ? (
        <AppView 
            user={user} 
            carrera={carrera}
            onLogout={handleLogout}
            userProgress={userProgress}
            onStatusChange={handleStatusChange}
        />
    ) : (
        <AuthView 
            onLogin={handleLogin} 
            onRegister={handleRegister}
            error={error} 
        />
    );
}