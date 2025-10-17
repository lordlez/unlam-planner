import React, { useMemo, useState } from 'react';
// CORRECCIÓN: Se añaden las extensiones .ts y .tsx a las rutas de importación
import type { User, UserProgress, Carrera, Materia } from '../types/index.ts';
import { estados } from '../types';
import StatCard from '../components/StatCard.tsx';
import MateriaCard from '../components/MateriaCard.tsx';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface AppViewProps {
    user: User;
    userName: string;
    carrera: Carrera;
    onLogout: () => void;
    onReset: () => void;
    userProgress: UserProgress;
    onStatusChange: (materiaId: string, newState: string) => void;
}

const AppView: React.FC<AppViewProps> = ({ user, userName, carrera, onLogout, onReset, userProgress, onStatusChange }) => {
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    
    const handleConfirmReset = () => {
        onReset();
        setIsResetModalOpen(false);
    };

    const isMateriaValida = useMemo(() => {
        const materiasMap = new Map(carrera.materias.map(m => [m.id, m]));
        
        return (materiaId: string, progress: UserProgress, visited = new Set<string>()): boolean => {
            if (visited.has(materiaId)) return true; 
            visited.add(materiaId);

            const materia = materiasMap.get(materiaId);
            if (!materia) return false; 

            if (!materia.correlativas || materia.correlativas.length === 0) {
                return true;
            }

            return materia.correlativas.every(idCorrelativa => {
                const estadoCorrelativa = progress[idCorrelativa];
                const correlativaAprobada = estadoCorrelativa === estados.APROBADA_CURSADA || estadoCorrelativa === estados.APROBADA_FINAL;
                
                return correlativaAprobada && isMateriaValida(idCorrelativa, progress, visited);
            });
        };
    }, [carrera.materias]);


    const stats = useMemo(() => {
        let aprobadas = 0;
        let cursando = 0;
        
        Object.entries(userProgress).forEach(([materiaId, estado]) => {
            if ((estado === estados.APROBADA_FINAL || estado === estados.APROBADA_CURSADA) && isMateriaValida(materiaId, userProgress)) {
                aprobadas++;
            }
            if (estado === estados.CURSANDO) {
                cursando++;
            }
        });

        const totalMaterias = carrera.materias.length;
        const restantes = totalMaterias - aprobadas;
        const avance = totalMaterias > 0 ? Math.round((aprobadas / totalMaterias) * 100) : 0;
        
        return { aprobadas, cursando, restantes, avance };
    }, [userProgress, carrera.materias, isMateriaValida]);

    const materiasPorAno = useMemo(() => {
        return carrera.materias.reduce((acc, materia) => {
            (acc[materia.ano] = acc[materia.ano] || []).push(materia);
            return acc;
        }, {} as { [key: number]: Materia[] });
    }, [carrera.materias]);

    const statsPorAno = useMemo(() => {
        const stats: { [key: number]: { aprobadas: number; total: number; porcentaje: number } } = {};

        for (const anoString in materiasPorAno) {
            const ano = parseInt(anoString);
            const materiasDelAno = materiasPorAno[ano];
            const totalDelAno = materiasDelAno.length;
            let aprobadasDelAno = 0;

            materiasDelAno.forEach(materia => {
                const estado = userProgress[materia.id];
                if ((estado === estados.APROBADA_FINAL || estado === estados.APROBADA_CURSADA) && isMateriaValida(materia.id, userProgress)) {
                    aprobadasDelAno++;
                }
            });

            stats[ano] = {
                aprobadas: aprobadasDelAno,
                total: totalDelAno,
                porcentaje: totalDelAno > 0 ? Math.round((aprobadasDelAno / totalDelAno) * 100) : 0
            };
        }
        return stats;
    }, [userProgress, materiasPorAno, isMateriaValida]);


    const checkCorrelatividades = (materia: Materia): boolean => {
        if (!materia.correlativas || materia.correlativas.length === 0) return true;
        
        return materia.correlativas.every(idCorrelativa => {
            const estadoCorrelativa = userProgress[idCorrelativa] || estados.NO_CURSADA;
            return estadoCorrelativa === estados.APROBADA_CURSADA || estadoCorrelativa === estados.APROBADA_FINAL;
        });
    };
    
    const checkPuedePromocionar = (materia: Materia): boolean => {
        if (!materia.correlativas || materia.correlativas.length === 0) {
            return true;
        }
        return materia.correlativas.every(idCorrelativa => {
            const estadoCorrelativa = userProgress[idCorrelativa] || estados.NO_CURSADA;
            return estadoCorrelativa !== estados.APROBADA_CURSADA; 
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow-md sticky top-0 z-10">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <span className="font-bold text-lg sm:text-xl text-indigo-600 truncate">
                            {userName ? `¡Hola, ${userName}!` : 'UNLaM Planner'}
                        </span>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 mr-2 hidden sm:block">{user.email}</span>
                            <button onClick={() => setIsResetModalOpen(true)} className="px-3 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 cursor-pointer">Reiniciar</button>
                            <button onClick={onLogout} className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 cursor-pointer">Salir</button>
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
                    {Object.keys(materiasPorAno).sort((a,b) => parseInt(a) - parseInt(b)).map(anoString => {
                        const ano = parseInt(anoString);
                        return (
                        <div key={ano}>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4 border-b-2 border-indigo-200 pb-2 mb-4">
                                <h2 className="text-2xl font-bold whitespace-nowrap mb-2 sm:mb-0">{ano}° Año</h2>
                                {statsPorAno[ano] && (
                                    <div className="flex items-center space-x-2 w-full sm:w-96">
                                        <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">{statsPorAno[ano].aprobadas} / {statsPorAno[ano].total}</span>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${statsPorAno[ano].porcentaje}%` }}></div>
                                        </div>
                                        <span className="text-sm font-bold text-green-600 w-12 text-right">{statsPorAno[ano].porcentaje}%</span>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {materiasPorAno[ano].map(materia => (
                                    <MateriaCard
                                        key={materia.id}
                                        materia={materia}
                                        estado={userProgress[materia.id] || estados.NO_CURSADA}
                                        puedeCursar={checkCorrelatividades(materia)}
                                        puedePromocionar={checkPuedePromocionar(materia)}
                                        onStatusChange={onStatusChange}
                                    />
                                ))}
                            </div>
                        </div>
                    )})}
                </section>
            </main>

            <Dialog
                open={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmar Reinicio"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsResetModalOpen(false)}>Cancelar</Button>
                    <Button onClick={handleConfirmReset} autoFocus color="error">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AppView;

