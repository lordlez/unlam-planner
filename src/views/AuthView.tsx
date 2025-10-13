import React, { useState } from 'react';

interface AuthViewProps {
    onLogin: (email: string, pass: string) => void;
    onRegister: (email: string, pass: string, name: string) => void;
    error: string;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, onRegister, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isRegisterView, setIsRegisterView] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isRegisterView) {
            onRegister(email, password, name);
        } else {
            onLogin(email, password);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-900">
                    {isRegisterView ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </h2>
                {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {isRegisterView && (
                        <div>
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre</label>
                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        <p className="mt-2 text-sm text-gray-500">Mínimo 6 caracteres.</p>
                    </div>
                    <div>
                        <button type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                            {isRegisterView ? 'Registrarme' : 'Ingresar'}
                        </button>
                    </div>
                </form>

                <div className="text-sm text-center">
                    <button onClick={() => setIsRegisterView(!isRegisterView)} className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                        {isRegisterView ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes una cuenta? Regístrate'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthView;

