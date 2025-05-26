'use client';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Datos con valores reales y previstos separados
const data = [
    { name: 'Enero', real: 20000, forecast: null },
    { name: 'Febrero', real: 16000, forecast: null },
    { name: 'Marzo', real: 18000, forecast: null },
    { name: 'Abril', real: null, forecast: 20000 },
];
// Tooltip personalizado
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const real = payload.find(p => p.dataKey === 'real')?.value;
    const forecast = payload.find(p => p.dataKey === 'forecast')?.value;

    return (
      <div className="bg-white border rounded p-2 shadow text-xs text-black">
        <p className="font-semibold">{label}</p>
        {real !== undefined && <p>📊 Real: {real.toLocaleString()}</p>}
        {forecast !== undefined && <p>🔮 Previsto: {forecast.toLocaleString()}</p>}
      </div>
    );
  }
  return null;
};

export default function ForecastLineChart() {
    return (
        <Card>
            <CardContent className="p-4">
                <h3 className="text-sm text-muted-foreground mb-2">Stock (Reales vs. Previsto)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(v) => `${v / 1000} mil`} />
                        <Tooltip content={<CustomTooltip />} />

                        {/* Línea real */}
                        <Line
                            type="monotone"
                            dataKey="real"
                            stroke="#c6f51c"
                            strokeWidth={2}
                            dot={{ stroke: '#c6f51c', strokeWidth: 2, fill: 'white' }}
                            connectNulls={false}
                        />

                        {/* Línea prevista */}
                        <Line
                            type="monotone"
                            dataKey="forecast"
                            stroke="#2f55ff"
                            strokeWidth={2}
                            dot={{ stroke: '#2f55ff', strokeWidth: 2, fill: 'white' }}
                            connectNulls={false}
                        />
                    </LineChart>

                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
