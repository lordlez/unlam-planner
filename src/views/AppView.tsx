// src/views/AppView.tsx

import React, { useMemo } from 'react';
import type { User, UserProgress, Carrera, Materia } from '../types';
// CORRECCIÓN AQUÍ: Importamos 'estados' desde su nueva ubicación
import { estados } from '../types';
import StatCard from '../components/StatCard';
// Y aquí, la importación de MateriaCard ya no incluye 'estados'
import MateriaCard from '../components/MateriaCard';

interface AppViewProps {
    user: User;
    carrera: Carrera;
    onLogout: () => void;
    userProgress: UserProgress;
    onStatusChange: (materiaId: string, newState: string) => void;
}

const AppView: React.FC<AppViewProps> = ({ user, carrera, onLogout, userProgress, onStatusChange }) => {
    const stats = useMemo(() => {
        const totalMaterias = carrera.materias.length;
        let aprobadas = 0;
        let cursando = 0;
        
        Object.values(userProgress).forEach(estado => {
            if (estado === estados.APROBADA_FINAL) aprobadas++;
            if (estado === estados.CURSANDO) cursando++;
        });

        const restantes = totalMaterias - aprobadas;
        const avance = totalMaterias > 0 ? Math.round((aprobadas / totalMaterias) * 100) : 0;
        
        return { aprobadas, cursando, restantes, avance };
    }, [userProgress, carrera.materias.length]);

    const materiasPorAno = useMemo(() => {
        return carrera.materias.reduce((acc, materia) => {
            (acc[materia.ano] = acc[materia.ano] || []).push(materia);
            return acc;
        }, {} as { [key: number]: Materia[] });
    }, [carrera.materias]);

    const checkCorrelatividades = (materia: Materia) => {
        if (!materia.correlativas || materia.correlativas.length === 0) return true;
        return materia.correlativas.every(idCorrelativa => {
            const estadoCorrelativa = userProgress[idCorrelativa] || estados.NO_CURSADA;
            return estadoCorrelativa === estados.APROBADA_CURSADA || estadoCorrelativa === estados.APROBADA_FINAL;
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow-md sticky top-0 z-10">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <span className="font-bold text-xl text-indigo-600">UNLaM Planner</span>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-4 hidden sm:block">{user.email}</span>
                            <button onClick={onLogout} className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Salir</button>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Aprobadas" value={stats.aprobadas} colorClass="text-green-600" />
                    <StatCard title="Cursando" value={stats.cursando} colorClass="text-blue-600" />
                    <StatCard title="Restantes" value={stats.restantes} colorClass="text-gray-600" />
                    <StatCard title="Avance" value={`${stats.avance}%`} colorClass="text-indigo-600" />
                </section>
                <section className="space-y-8">
                    {Object.keys(materiasPorAno).sort((a,b) => parseInt(a) - parseInt(b)).map(ano => (
                        <div key={ano}>
                            <h2 className="text-2xl font-bold border-b-2 border-indigo-200 pb-2 mb-4">{ano}° Año</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {materiasPorAno[parseInt(ano)].map(materia => (
                                    <MateriaCard
                                        key={materia.id}
                                        materia={materia}
                                        estado={userProgress[materia.id] || estados.NO_CURSADA}
                                        puedeCursar={checkCorrelatividades(materia)}
                                        onStatusChange={onStatusChange}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default AppView;