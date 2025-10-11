// src/components/StatCard.tsx

import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, colorClass }) => (
    <div className="bg-white p-5 rounded-xl shadow flex flex-col items-center justify-center transition-transform transform hover:scale-105">
        <h3 className={`text-lg font-semibold ${colorClass}`}>{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);

export default StatCard;