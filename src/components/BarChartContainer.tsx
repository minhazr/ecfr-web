import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

type EcfrCorrection = {
    id: number;
    error_occurred: string;
    error_corrected: string;
    corrective_action: string;
};

type Dataset = {
    ecfr_corrections: EcfrCorrection[];
};

type BarChartContainerProps = {
    path: string | null; // path may initially be null
};

function getCorrectionsPerYear(data: Dataset): { year: number; count: number }[] {
    const yearCountMap: Record<number, number> = {};
    for (const correction of data.ecfr_corrections) {
        const year = new Date(correction.error_corrected).getFullYear();
        yearCountMap[year] = (yearCountMap[year] || 0) + 1;
    }
    return Object.entries(yearCountMap)
        .map(([year, count]) => ({ year: parseInt(year), count }))
        .sort((a, b) => a.year - b.year);
}

function getCorrectionDelays(data: Dataset): { correctedDate: string; daysToCorrect: number }[] {
    return data.ecfr_corrections
        .map((correction) => {
            const occurred = new Date(correction.error_occurred);
            const corrected = new Date(correction.error_corrected);
            const daysToCorrect = Math.floor((corrected.getTime() - occurred.getTime()) / (1000 * 60 * 60 * 24));
            return {
                correctedDate: correction.error_corrected,
                daysToCorrect,
            };
        })
        .sort((a, b) => new Date(a.correctedDate).getTime() - new Date(b.correctedDate).getTime());
}

const BarChartContainer: React.FC<BarChartContainerProps> = ({ path }) => {
    const [chart1Data, setChart1Data] = useState<{ year: number; count: number }[]>([]);
    const [chart2Data, setChart2Data] = useState<{ correctedDate: string; daysToCorrect: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!path) {
            // Clear or hide charts if no path is provided
            setChart1Data([]);
            setChart2Data([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`https://get-corrections-788903804860.us-central1.run.app/${path}`);
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                const json: Dataset = await res.json();
                setChart1Data(getCorrectionsPerYear(json));
                setChart2Data(getCorrectionDelays(json));
            } catch (err: any) {
                console.error("Failed to fetch or process data:", err);
                setError("Failed to load chart data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [path]);

    if (!path) {
        return <div>Please select a row to view charts.</div>;
    }

    if (loading) {
        return <div>Loading charts...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold mb-2">Corrections Per Year</h2>
                <BarChart width={500} height={300} data={chart1Data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Days to Correct Over Time</h2>
                <BarChart width={500} height={300} data={chart2Data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="correctedDate" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="daysToCorrect" fill="#82ca9d" />
                </BarChart>
            </div>
        </div>
    );
};

export default BarChartContainer;
