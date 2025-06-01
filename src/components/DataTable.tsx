import React, { useEffect, useState } from "react";
import axios from "axios";

interface TitleRow {
    number: number;
    name: string;
    checksum?: string;
    latest_amended_on?: string;
    latest_issue_date?: string;
    up_to_date_as_of?: string;
    reserved?: boolean;
    word?: number;
}

interface DataTableProps {
    onRowSelect: (row: TitleRow) => void;
}

const DataTable: React.FC<DataTableProps> = ({ onRowSelect }) => {
    const [data, setData] = useState<TitleRow[]>([]);
    const [loadingDownload, setLoadingDownload] = useState<{ [key: number]: boolean }>({});
    const [showChart, setShowChart] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        axios.get("https://get-titles-info-788903804860.us-central1.run.app")
            .then((res) => setData(res.data.titles))
            .catch((err) => console.error("Error fetching data:", err));
    }, []);

    const handleDownload = async (number: number) => {
        setLoadingDownload(prev => ({ ...prev, [number]: true }));
        try {
            await axios.get(`https://ecfr-data-downloader-788903804860.europe-west1.run.app/${number}`);
            setShowChart(prev => ({ ...prev, [number]: true }));
        } catch (err) {
            console.error("Download failed:", err);
        } finally {
            setLoadingDownload(prev => ({ ...prev, [number]: false }));
        }
    };

    return (
        <table className="w-full border border-gray-300">
            <thead>
            <tr className="bg-gray-100">
                <th className="p-2">Number</th>
                <th className="p-2">Name</th>
                <th className="p-2">Word</th>
                <th className="p-2">Checksum</th>
                <th className="p-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            {data.map((row) => (
                <tr key={row.number} className="border-t">
                    <td className="p-2">{row.number}</td>
                    <td className="p-2">{row.name}</td>
                    <td className="p-2">{row.word}</td>
                    <td className="p-2">
                        {row.checksum ? (
                            <div className="w-24 overflow-hidden">
                                <div className="whitespace-nowrap hover:animate-marquee text-sm">
                                    {row.checksum}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {row.checksum.slice(-6)}
                                </div>
                            </div>
                        ) : (
                            "-"
                        )}
                    </td>
                    <td className="p-2 space-x-2">
                        {!row.checksum && !showChart[row.number] && (
                            <button
                                onClick={() => handleDownload(row.number)}
                                className="bg-green-600 text-white px-2 py-1 rounded"
                                disabled={loadingDownload[row.number]}
                            >
                                {loadingDownload[row.number] ? (
                                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                    "Download"
                                )}
                            </button>
                        )}
                        {(row.checksum || showChart[row.number]) && (
                            <button
                                onClick={() => onRowSelect(row)}
                                className="bg-purple-600 text-white px-2 py-1 rounded"
                            >
                                Charts
                            </button>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default DataTable;


