'use client';
import "../styles/BarChart.css"
import Desk_fill from "./Desk_fill.png"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const income_expenses = [
    {
        name: 'Jan',
        income: 100,
        expense: 50,
    },
    {
        name: 'Feb',
        income: 120,
        expense: 50,
    },
    {
        name: 'Mar',
        income: 150,
        expense: 50,
    },
    {
        name: 'Apr',
        income: 80,
        expense: 50,
    },
    {
        name: 'May',
        income: 400,
        expense: 50,
    },
    {
        name: 'Jun',
        income: 1000,
        expense: 500,
    }
];

const BarChartComponent = () => {
    return (
        <div className="card">
            <div className="chart-header">
                
                <h2 className="text-h2">Balance Overview</h2>
                <button className="button">
                    Last 6 month
                    <span style={{ marginLeft: '5px' }} role="img" aria-label="calendar">
                        <img src={Desk_fill} alt="calendar icon" style={{height:'24px', width:'24px' }}></img>
                    </span>
                </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center',  gap: '1px' }}>
                <div style={{ color: '#4CAF50', display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#4CAF50', borderRadius: '50%', marginRight: '5px' }}></span>
                    Total Income
                </div>
                <div style={{ color: '#F44336', display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#F44336', borderRadius: '50%', marginRight: '5px' }}></span>
                    Total Spending
                    
                </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={income_expenses} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> {/* Змінено колір сітки */}
                    <XAxis dataKey="name" stroke="#333" /> {/* Колір осі */}
                    <YAxis stroke="#333" /> {/* Колір осі */}
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} /> {/* Легкий фон тултипу */}
                    <Bar dataKey="income" fill="#4CAF50" radius={[10, 10, 0, 0]} />{/* Зроблено округлені кути */}
                    <Bar dataKey="expense" fill="#F44336" radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartComponent;

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                color: 'black',
                fontSize: '14px',
            }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
                <p style={{ margin: 0, color: '#4CAF50' }}>
                    Income: <span>${payload[0]?.value}</span>
                </p>
                <p style={{ margin: 0, color: '#F44336' }}>
                    Expense: <span>${payload[1]?.value}</span>
                </p>
            </div>
        );
    }
    return null;
};


