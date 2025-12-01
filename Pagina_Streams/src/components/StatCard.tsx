import React from 'react';

interface Stat {
  label: string;
  value: string | number;
  hint?: string;
  color?: string;
}

interface StatCardProps {
  stat: Stat;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  return (
    <div
      style={{
        flex: '1 1 200px',
        background: '#18181b',
        padding: '20px',
        borderRadius: 8,
        borderLeft: `4px solid ${stat.color || '#00b7ff'}`,
      }}
    >
      <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>{stat.label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{stat.value}</div>
      {stat.hint && <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{stat.hint}</div>}
    </div>
  );
};

export default StatCard;