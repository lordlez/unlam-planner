import React, { useState } from 'react';

interface AuthViewProps {
    onLogin: (email: string, pass: string) => void;
    onRegister: (email: string, pass: string, name: string) => void;
    onPasswordReset: (email: string) => void;
    error: string;
}

// 1. Componentes de íconos para el ojo (abierto y cerrado)
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.443-5.328a1.012 1.012 0 011.638-.046l.12.144a1.012 1.012 0 010 1.343l-4.443 5.328a1.012 1.012 0 01-1.638.046l-.12-.144z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6.75 6.75 0 006.75-6.75 6.75 6.75 0 00-6.75-6.75A6.75 6.75 0 005.25 12a6.75 6.75 0 006.75 6.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
    </svg>
);


const AuthView: React.FC<AuthViewProps> = ({ onLogin, onRegister, onPasswordReset, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isRegisterView, setIsRegisterView] = useState(false);
    // 2. Nuevo estado para controlar la visibilidad de la contraseña
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isRegisterView) {
            onRegister(email, password, name);
        } else {
            onLogin(email, password);
        }
    };

    const handleResetClick = () => {
        if (!email) {
            alert("Por favor, ingresa tu email en el campo correspondiente para restablecer la contraseña.");
            return;
        }
        onPasswordReset(email);
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
                        {/* 3. Contenedor relativo para posicionar el ícono */}
                        <div className="relative">
                            <input 
                                id="password" 
                                // 4. El tipo de input cambia según el estado
                                type={showPassword ? 'text' : 'password'}
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                            />
                            {/* 5. Botón para alternar la visibilidad */}
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 top-1 flex items-center pr-3"
                            >
                                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        {isRegisterView && <p className="mt-2 text-sm text-gray-500">Mínimo 6 caracteres.</p>}
                    </div>

                    {!isRegisterView && (
                         <div className="text-sm text-right">
                            <button type="button" onClick={handleResetClick} className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                    )}

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

