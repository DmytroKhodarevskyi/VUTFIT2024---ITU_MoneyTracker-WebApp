'use client';
import api from "../api"

import React from 'react';
import { useState, useEffect } from 'react';
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



const BarChartComponent = () => {

    const [incomeExpenses, setIncomeExpenses] = useState([]);

    const getMonthName = (dateString) => {
        const date = new Date(dateString);
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return monthNames[date.getMonth()];
    };

    const StatsHandler = async (Month) => {
        try {
            const response = await api.get("/api/transactions/");
            let income = 0;
            let spending = 0;

            // console.log(response.data);

            response.data.forEach(transaction => {

                // console.log(Month + " IT IS MONTH" + " " + getMonthName(transaction.transaction_datetime.month) + " IT IS MONTH");
                // console.log(getMonthName(transaction.transaction_datetime) + " IT IS MONTH");
                // if (transaction.transaction_type === "INCOME" && transaction.date.includes(Month)) {
                if (transaction.transaction_type === "INCOME" && getMonthName(transaction.transaction_datetime) === Month) {
                    
                    // console.log(transaction.amount + " INCOME");
                    income += parseFloat(transaction.amount);
                } else if (getMonthName(transaction.transaction_datetime) === Month) {
                    spending += parseFloat(transaction.amount);
                }
            });
    
            return [income, spending];
        } catch (error) {
            console.error("Failed to fetch transactions", error);
            return [0, 0];
        }
    }
    
    const getLastSixMonths = () => {
        const months = [];
        const date = new Date();
        for (let i = 0; i < 6; i++) {
            // const year = date.getFullYear();
            const monthName = getMonthName(date);
            // months.push(`${year}-${monthName}`);
            months.push(`${monthName}`);
            date.setMonth(date.getMonth() - 1);
        }
        return months.reverse(); // Reverse to get the oldest month first
    };

    useEffect(() => {
        const fetchData = async () => {
            const months = getLastSixMonths();
            const updatedData = await Promise.all(months.map(async (month) => {
                
                // console.log(month + " SENDING TO STATS HANDLER");
                const [income, expense] = await StatsHandler(month);
                return { name: month, income, expense };
            }));
            setIncomeExpenses(updatedData);
        };

        fetchData();
    }, []);

    return (
        <div className="BarChart-card-graph">
            <div className="BarChart-top-container-graph">
                <div className="BarChart-chart-header">
                    <h2 className="BarChart-text-h2">Balance Overview</h2>
                    <div className="BarChart-legend">
                        <div className="BarChart-legend-item" style={{ color: '#00000080' }}>
                        <span className="BarChart-legend-circle" style={{ backgroundColor: '#4CAF50' }}></span>
                            Total income
                        </div>
                        <div className="BarChart-legend-item" style={{ color: '#00000080' }}>
                        <span className="BarChart-legend-circle" style={{ backgroundColor: '#F44336' }}></span>
                            Total Spending
                        </div>
                    </div>
                </div>
                
                <button className="BarChart-button">
                    Last 6 month
                    <span style={{ marginLeft: '5px' }} role="img" aria-label="calendar">
                        <img src={Desk_fill} alt="calendar icon" style={{ height: '24px', width: '24px' }} />
                    </span>
                </button>
            </div>



            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeExpenses} margin={{ top: 20, right: 0, left: 20, bottom: 0 }}>
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


