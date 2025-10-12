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

import { auth, db } from './firebase/config.ts';
import type { User, UserProgress, Carrera } from './types/index.ts';
import AuthView from './views/AuthView.tsx';
import AppView from './views/AppView.tsx';

const carrera: Carrera = {
    id: 'ing-inf-2023',
    nombre: 'Ingeniería en Informática (2023)',
    materias: [
        { id: '03621', nombre: 'MATEMATICA DISCRETA', ano: 1, correlativas: [] },
        { id: '03622', nombre: 'ANALISIS MATEMATICO I', ano: 1, correlativas: [] },
        { id: '03623', nombre: 'PROGRAMACION INICIAL', ano: 1, correlativas: [] },
        { id: '03624', nombre: 'INTRODUCCION A LOS SISTEMAS DE INFORMACION', ano: 1, correlativas: [] },
        { id: '03625', nombre: 'SISTEMAS DE NUMERACION', ano: 1, correlativas: [] },
        { id: '03626', nombre: 'PRINCIPIOS DE CALIDAD DE SOFTWARE', ano: 1, correlativas: [] },
        { id: '00901', nombre: 'INGLES NIVEL I', ano: 1, correlativas: [] },
        { id: '00911', nombre: 'COMPUTACION NIVEL I', ano: 1, correlativas: [] },
        { id: '03627', nombre: 'ALGEBRA Y GEOMETRIA ANALITICA I', ano: 1, correlativas: [] },
        { id: '03628', nombre: 'FISICA I', ano: 1, correlativas: ['03622'] },
        { id: '03629', nombre: 'PROGRAMACION ESTRUCTURADA BASICA', ano: 1, correlativas: ['03623'] },
        { id: '03630', nombre: 'INTRODUCCION A LA GESTION DE REQUISITOS', ano: 1, correlativas: ['03624'] },
        { id: '03631', nombre: 'FUNDAMENTOS DE SISTEMAS EMBEBIDOS', ano: 1, correlativas: ['03625'] },
        { id: '03632', nombre: 'INTRODUCCION A LOS PROYECTOS INFORMATICOS', ano: 1, correlativas: [] },
        { id: '00902', nombre: 'INGLES NIVEL II', ano: 2, correlativas: ['00901'] },
        { id: '00912', nombre: 'COMPUTACION NIVEL II', ano: 2, correlativas: ['00911'] },
        { id: '03633', nombre: 'ANALISIS MATEMATICO II', ano: 2, correlativas: ['03622'] },
        { id: '03634', nombre: 'FISICA II', ano: 2, correlativas: ['03628'] },
        { id: '03635', nombre: 'TOPICOS DE PROGRAMACION', ano: 2, correlativas: ['03621', '03629'] },
        { id: '03636', nombre: 'BASES DE DATOS', ano: 2, correlativas: ['03621', '03629'] },
        { id: '03637', nombre: 'ANALISIS DE SISTEMAS', ano: 2, correlativas: ['03630'] },
        { id: '03638', nombre: 'ARQUITECTURA DE COMPUTADORAS', ano: 2, correlativas: ['03631'] },
        { id: '03676', nombre: 'RESPONSABILIDAD SOCIAL UNIVERSITARIA', ano: 2, correlativas: ['03626'] },
        { id: '00903', nombre: 'INGLES NIVEL III', ano: 2, correlativas: ['00902'] },
        { id: '03639', nombre: 'ANALISIS MATEMATICO III', ano: 2, correlativas: ['03633'] },
        { id: '03640', nombre: 'ALGORITMOS Y ESTRUCTURAS DE DATOS', ano: 2, correlativas: ['03635'] },
        { id: '03641', nombre: 'BASES DE DATOS APLICADAS', ano: 2, correlativas: ['03636'] },
        { id: '03642', nombre: 'PRINCIPIOS DE DISEÑO DE SISTEMAS', ano: 2, correlativas: ['03626', '03637'] },
        { id: '03643', nombre: 'REDES DE COMPUTADORAS', ano: 2, correlativas: ['03634', '03638'] },
        { id: '03644', nombre: 'GESTION DE LAS ORGANIZACIONES', ano: 2, correlativas: ['03632'] },
        { id: '03680', nombre: 'TALLER DE INTEGRACION', ano: 2, correlativas: ['03621', '03623', '03624', '03625', '03626', '03630', '03632', '03635', '03636', '03638'] },
        { id: '00904', nombre: 'INGLES NIVEL IV', ano: 3, correlativas: ['00903'] },
        { id: '03645', nombre: 'ALGEBRA Y GEOMETRIA ANALITICA II', ano: 3, correlativas: ['03627'] },
        { id: '03646', nombre: 'PARADIGMAS DE PROGRAMACION', ano: 3, correlativas: ['03633', '03640'] },
        { id: '03647', nombre: 'REQUISITOS AVANZADOS', ano: 3, correlativas: ['03642'] },
        { id: '03648', nombre: 'DISEÑO DE SOFTWARE', ano: 3, correlativas: ['03636', '03642'] },
        { id: '03649', nombre: 'SISTEMAS OPERATIVOS', ano: 3, correlativas: ['03638'] },
        { id: '03650', nombre: 'SEGURIDAD DE LA INFORMACION', ano: 3, correlativas: ['03635', '03638', '03643'] },
        { id: '03675', nombre: 'PRACTICA PROFESIONAL SUPERVISADA', ano: 3, correlativas: ['03642'] },
        { id: '03651', nombre: 'PROBABILIDAD Y ESTADISTICA', ano: 3, correlativas: ['03621', '03639', '03645'] },
        { id: '03652', nombre: 'PROGRAMACION AVANZADA', ano: 3, correlativas: ['03646', '03641'] },
        { id: '03653', nombre: 'ARQUITECTURA DE SISTEMAS SOFTWARE', ano: 3, correlativas: ['03648'] },
        { id: '03654', nombre: 'VIRTUALIZACION DE HARDWARE', ano: 3, correlativas: ['03640', '03645', '03649'] },
        { id: '03655', nombre: 'AUDITORIA Y LEGISLACION', ano: 3, correlativas: ['03650'] },
        { id: '03656', nombre: 'ESTADISTICA APLICADA', ano: 4, correlativas: ['03641', '03651'] },
        { id: '03657', nombre: 'AUTOMATAS Y GRAMATICAS', ano: 4, correlativas: ['03646'] },
        { id: '03658', nombre: 'PROGRAMACION CONCURRENTE', ano: 4, correlativas: ['03646', '03654'] },
        { id: '03659', nombre: 'GESTION APLICADA AL DESARROLLO DE SOFTWARE I', ano: 4, correlativas: ['03644', '03647', '03653'] },
        { id: '03660', nombre: 'SISTEMAS OPERATIVOS AVANZADOS', ano: 4, correlativas: ['03654'] },
        { id: '03661', nombre: 'GESTION DE PROYECTOS', ano: 4, correlativas: ['03644', '03650', '03651'] },
        { id: '03662', nombre: 'MATEMATICA APLICADA', ano: 4, correlativas: ['03651'] },
        { id: '03663', nombre: 'LENGUAJES Y COMPILADORES', ano: 4, correlativas: ['03657'] },
        { id: '03664', nombre: 'INTELIGENCIA ARTIFICIAL', ano: 4, correlativas: ['03646', '03651'] },
        { id: '03665', nombre: 'GESTION APLICADA AL DESARROLLO DE SOFTWARE II', ano: 4, correlativas: ['03652', '03659'] },
        { id: '03666', nombre: 'SEGURIDAD APLICADA Y FORENSIA', ano: 4, correlativas: ['03649', '03652', '03655'] },
        { id: '03667', nombre: 'GESTION DE LA CALIDAD EN PROCESOS DE SISTEMAS', ano: 4, correlativas: ['03647'] },
        { id: '03668', nombre: 'INTELIGENCIA ARTIFICIAL APLICADA', ano: 5, correlativas: ['03656', '03664'] },
        { id: '03669', nombre: 'INNOVACION Y EMPRENDEDORISMO', ano: 5, correlativas: ['03661'] },
        { id: '03670', nombre: 'CIENCIA DE DATOS', ano: 5, correlativas: ['03656', '03664'] },
        { id: '03672', nombre: 'ELECTIVA I', ano: 5, correlativas: [] },
        { id: '03673', nombre: 'ELECTIVA II', ano: 5, correlativas: [] },
        { id: '03674', nombre: 'ELECTIVA III', ano: 5, correlativas: [] },
        { id: '03671', nombre: 'PROYECTO FINAL DE CARRERA', ano: 5, correlativas: ['03656', '03659', '03660', '03661', '03667'] },
    ]
};

export default function App() {
    const [user, setUser] = useState<User | null>(null);
    const [userName, setUserName] = useState<string>('');
    const [userProgress, setUserProgress] = useState<UserProgress>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setUserName('');
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) {
            setUserProgress({});
            return;
        }

        setLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setUserName(docSnap.data().name || '');
            }
        });

        const progressDocRef = doc(db, `progress/${user.uid}/courses`, carrera.id);
        const unsubscribeProgress = onSnapshot(progressDocRef, (docSnap) => {
            setUserProgress(docSnap.exists() ? docSnap.data() : {});
            setLoading(false);
        });

        return () => {
            unsubscribeUser();
            unsubscribeProgress();
        };
    }, [user]);

    const handleRegister = async (email: string, password: string, name: string) => {
        setError('');
        if (name.trim() === '') {
            setError("Por favor, ingresa tu nombre.");
            return;
        }
        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', userCredential.user.uid), { name });
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
        const docRef = doc(db, `progress/${user.uid}/courses`, carrera.id);
        try {
            await setDoc(docRef, { [materiaId]: nuevoEstado }, { merge: true });
        } catch (err) {
            console.error("Error al guardar el progreso: ", err);
        }
    };

    const handleResetProgress = async () => {
        if (!user) return;
        const docRef = doc(db, `progress/${user.uid}/courses`, carrera.id);
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
            userName={userName}
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

