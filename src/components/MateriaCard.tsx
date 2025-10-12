import React from 'react';
import type { Materia } from '../types/index.ts';
import { estados } from '../types';

interface MateriaCardProps {
    materia: Materia;
    estado: string;
    puedeCursar: boolean;
    puedePromocionar: boolean;
    onStatusChange: (materiaId: string, newState: string) => void;
}

const MateriaCard: React.FC<MateriaCardProps> = ({ materia, estado, puedeCursar, puedePromocionar, onStatusChange }) => {
    const borderColor = {
        [estados.APROBADA_FINAL]: 'border-purple-500', 
        [estados.APROBADA_CURSADA]: 'border-green-500',
        [estados.CURSANDO]: 'border-blue-500',
        [estados.NO_CURSADA]: 'border-gray-300'
    }[estado] || 'border-gray-300';

    const lockedClasses = !puedeCursar ? 'bg-gray-200 cursor-not-allowed border-gray-300' : 'bg-white';
    const lockedText = !puedeCursar ? 'text-gray-400' : '';

    let opcionesDisponibles = Object.values(estados);
    if (!puedePromocionar) {
        opcionesDisponibles = opcionesDisponibles.filter(opcion => opcion !== estados.APROBADA_FINAL);
    }

    return (
        <div className={`p-4 rounded-lg shadow border-l-4 transition-all duration-200 ease-in-out ${borderColor} ${lockedClasses}`}>
            <div className="flex flex-col h-full">
                <h4 className={`font-semibold text-lg flex-grow ${lockedText}`}>{materia.nombre}</h4>
                {puedeCursar ? (
                    <select value={estado} onChange={(e) => onStatusChange(materia.id, e.target.value)} className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        {opcionesDisponibles.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                ) : (
                    <p className="text-sm text-red-500 mt-2">Correlativas pendientes</p>
                )}
            </div>
        </div>
    );
};

export default MateriaCard;

