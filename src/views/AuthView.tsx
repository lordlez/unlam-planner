// src/views/AuthView.tsx

import React, { useState } from 'react';

interface AuthViewProps {
    onLogin: (email: string, pass: string) => void;
    onRegister: (email: string, pass: string) => void;
    error: string;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, onRegister, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-900">Registro Académico</h2>
                {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        <p className="mt-2 text-sm text-gray-500">Mínimo 6 caracteres.</p>
                    </div>
                    <div className="space-y-2">
                        <button type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Ingresar</button>
                        <button type="button" onClick={() => onRegister(email, password)} className="flex justify-center w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 border border-transparent rounded-md shadow-sm hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Registrarme</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthView;