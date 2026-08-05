import React from 'react';

interface SparklineChartProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  color = '#0EA5E9',
  width = 80,
  height = 24,
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  const lastVal = data[data.length - 1];
  const lastX = width;
  const lastY = height - ((lastVal - min) / range) * (height - 6) - 3;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }} aria-label={`Tendencia de temperatura: ${data.join('°, ')}°`}>
      <title>{`Tendencia: ${data.join('° -> ')}°`}</title>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <circle cx={lastX} cy={lastY} r="3" fill={color} />
    </svg>
  );
};
