import React, { useState } from "react";
import DataTable from "./DataTable";
import BarChartContainer from "./BarChartContainer";

type RowData = {
    number: number;
    name: string;
    latest_amended_on: string;
    latest_issue_date: string;
    up_to_date_as_of: string;
    reserved: boolean;
    word: number;
    checksum: string;
};

const Dashboard: React.FC = () => {
    const [selectedRowData, setSelectedRowData] = useState<RowData | null>(null);

    const handleRowSelection = (data: any) => {
        setSelectedRowData(data);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
                <DataTable onRowSelect={handleRowSelection} />
            </div>
            <div className="col-span-1 space-y-4">
                <BarChartContainer path={selectedRowData?.number.toString() ?? null} />
            </div>
        </div>
    );
};

export default Dashboard;
