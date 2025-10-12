import { useState, useEffect } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    setPersistence, 
    browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc, onSnapshot, deleteDoc } from 'firebase/firestore';

import { auth, db } from './firebase/config';
import type { User, UserProgress, Carrera } from './types/index';
import AuthView from './views/AuthView';
import AppView from './views/AppView';

const carrera: Carrera = {
    id: 'ing-inf-2023',
    nombre: 'Ingeniería en Informática - Plan 2023',
    materias: [
        { id: '03621', nombre: 'Matemática Discreta', ano: 1, correlativas: [] },
        { id: '03622', nombre: 'Análisis Matemático I', ano: 1, correlativas: [] },
        { id: '03623', nombre: 'Programación Inicial', ano: 1, correlativas: [] },
        { id: '03624', nombre: 'Introducción a los Sistemas de Información', ano: 1, correlativas: [] },
        { id: '03625', nombre: 'Sistemas de Numeración', ano: 1, correlativas: [] },
        { id: '03626', nombre: 'Principios de Calidad de Software', ano: 1, correlativas: [] },
        { id: '00901', nombre: 'Inglés Nivel I', ano: 1, correlativas: [] },
        { id: '00911', nombre: 'Computación Nivel I', ano: 1, correlativas: [] },
        { id: '03627', nombre: 'Álgebra y Geometría Analítica I', ano: 1, correlativas: [] },
        { id: '03628', nombre: 'Física I', ano: 1, correlativas: ['03622'] },
        { id: '03629', nombre: 'Programación Estructurada Básica', ano: 1, correlativas: ['03623'] },
        { id: '03630', nombre: 'Introducción a la Gestión de Requisitos', ano: 1, correlativas: ['03624'] },
        { id: '03631', nombre: 'Fundamentos de Sistemas Embebidos', ano: 1, correlativas: ['03625'] },
        { id: '03632', nombre: 'Introducción a los Proyectos Informáticos', ano: 1, correlativas: [] },
        { id: '00902', nombre: 'Inglés Nivel II', ano: 2, correlativas: ['00901'] },
        { id: '00912', nombre: 'Computación Nivel II', ano: 2, correlativas: ['00911'] },
        { id: '03633', nombre: 'Análisis Matemático II', ano: 2, correlativas: ['03622'] },
        { id: '03634', nombre: 'Física II', ano: 2, correlativas: ['03628'] },
        { id: '03635', nombre: 'Tópicos de Programación', ano: 2, correlativas: ['03621', '03629'] },
        { id: '03636', nombre: 'Bases de Datos', ano: 2, correlativas: ['03621', '03629'] },
        { id: '03637', nombre: 'Análisis de Sistemas', ano: 2, correlativas: ['03630'] },
        { id: '03638', nombre: 'Arquitectura de Computadoras', ano: 2, correlativas: ['03631'] },
        { id: '03676', nombre: 'Responsabilidad Social Universitaria', ano: 2, correlativas: ['03626'] },
        { id: '00903', nombre: 'Inglés Nivel III', ano: 2, correlativas: ['00902'] },
        { id: '03639', nombre: 'Análisis Matemático III', ano: 2, correlativas: ['03633'] },
        { id: '03640', nombre: 'Algoritmos y Estructuras de Datos', ano: 2, correlativas: ['03635'] },
        { id: '03641', nombre: 'Bases de Datos Aplicadas', ano: 2, correlativas: ['03636'] },
        { id: '03642', nombre: 'Principios de Diseño de Sistemas', ano: 2, correlativas: ['03626', '03637'] },
        { id: '03643', nombre: 'Redes de Computadoras', ano: 2, correlativas: ['03634', '03638'] },
        { id: '03644', nombre: 'Gestión de las Organizaciones', ano: 2, correlativas: ['03632'] },
        { id: '03680', nombre: 'Taller de Integración', ano: 2, correlativas: ['03621', '03623', '03624', '03625', '03626', '03630', '03632', '03635', '03636', '03638'] },
        { id: '00904', nombre: 'Inglés Nivel IV', ano: 3, correlativas: ['00903'] },
        { id: '03645', nombre: 'Álgebra y Geometría Analítica II', ano: 3, correlativas: ['03627'] },
        { id: '03646', nombre: 'Paradigmas de Programación', ano: 3, correlativas: ['03633', '03640'] },
        { id: '03647', nombre: 'Requisitos Avanzados', ano: 3, correlativas: ['03642'] },
        { id: '03648', nombre: 'Diseño de Software', ano: 3, correlativas: ['03636', '03642'] },
        { id: '03649', nombre: 'Sistemas Operativos', ano: 3, correlativas: ['03638'] },
        { id: '03650', nombre: 'Seguridad de la Información', ano: 3, correlativas: ['03635', '03638', '03643'] },
        { id: '03675', nombre: 'Práctica Profesional Supervisada', ano: 3, correlativas: ['03642'] },
        { id: '03651', nombre: 'Probabilidad y Estadística', ano: 3, correlativas: ['03621', '03639', '03645'] },
        { id: '03652', nombre: 'Programación Avanzada', ano: 3, correlativas: ['03646', '03641'] },
        { id: '03653', nombre: 'Arquitectura de Sistemas Software', ano: 3, correlativas: ['03648'] },
        { id: '03654', nombre: 'Virtualización de Hardware', ano: 3, correlativas: ['03640', '03645', '03649'] },
        { id: '03655', nombre: 'Auditoría y Legislación', ano: 3, correlativas: ['03650'] },
        { id: '03656', nombre: 'Estadística Aplicada', ano: 4, correlativas: ['03641', '03651'] },
        { id: '03657', nombre: 'Autómatas y Gramáticas', ano: 4, correlativas: ['03646'] },
        { id: '03658', nombre: 'Programación Concurrente', ano: 4, correlativas: ['03646', '03654'] },
        { id: '03659', nombre: 'Gestión Aplicada al Desarrollo de Software I', ano: 4, correlativas: ['03644', '03647', '03653'] },
        { id: '03660', nombre: 'Sistemas Operativos Avanzados', ano: 4, correlativas: ['03654'] },
        { id: '03661', nombre: 'Gestión de Proyectos', ano: 4, correlativas: ['03644', '03650', '03651'] },
        { id: '03662', nombre: 'Matemática Aplicada', ano: 4, correlativas: ['03651'] },
        { id: '03667', nombre: 'Gestión de la Calidad en Procesos de Sistemas', ano: 4, correlativas: ['03647'] },
        { id: '03663', nombre: 'Lenguajes y Compiladores', ano: 4, correlativas: ['03667'] },
        { id: '03664', nombre: 'Inteligencia Artificial', ano: 4, correlativas: ['03646', '03651'] },
        { id: '03665', nombre: 'Gestión Aplicada al Desarrollo de Software II', ano: 4, correlativas: ['03652', '03659'] },
        { id: '03666', nombre: 'Seguridad Aplicada y Forensia', ano: 4, correlativas: ['03649', '03652', '03655'] },
        { id: '03668', nombre: 'Inteligencia Artificial Aplicada', ano: 5, correlativas: ['03656', '03664'] },
        { id: '03669', nombre: 'Innovación y Emprendedorismo', ano: 5, correlativas: ['03661'] },
        { id: '03670', nombre: 'Ciencia de Datos', ano: 5, correlativas: ['03656', '03664'] },
        { id: '03672', nombre: 'Electiva I', ano: 5, correlativas: [] },
        { id: '03673', nombre: 'Electiva II', ano: 5, correlativas: [] },
        { id: '03674', nombre: 'Electiva III', ano: 5, correlativas: [] },
        { id: '03671', nombre: 'Proyecto Final de Carrera', ano: 5, correlativas: ['03656', '03659', '03660', '03661', '03667'] },
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
        } catch {
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
    
    const handleResetProgress = async () => {
        if (!user) return;
        
        const docRef = doc(db, `users/${user.uid}/progress`, carrera.id);
        try {
            await deleteDoc(docRef);
        } catch (err) {
            console.error("Error al reiniciar el progreso: ", err);
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
            onReset={handleResetProgress}
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

