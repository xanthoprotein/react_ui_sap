import React, { useState, useEffect } from "react";
import { convertToCSV } from "../../utils/CSVConverter";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { ButtonWithIcon } from "../common/ButtonWithIcon";
import { Download, Filter } from "lucide-react";
import ButtonWithTooltip from "../common/ButtonWithTooltip";

type Ledger = {
  [key: string]: any;
};

type LedgerGridProps = {
  ledgers: Ledger[];
};

const LedgerGrid: React.FC<LedgerGridProps> = ({ ledgers }) => {
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] =
    useState<boolean>(false);

  const allColumns = ledgers.length > 0 ? Object.keys(ledgers[0]) : [];

  useEffect(() => {
    const defaultColumns = allColumns.slice(0, 10);
    setVisibleColumns(defaultColumns);
  }, [ledgers]);

  const handleColumnToggle = (column: string) => {
    setIsToggled(true);
    setVisibleColumns((prevVisibleColumns) =>
      prevVisibleColumns.includes(column)
        ? prevVisibleColumns.filter((col) => col !== column)
        : [...prevVisibleColumns, column]
    );
  };

  const handleDownloadCSV = (columns: string[]) => {
    const filteredData = ledgers.map((ledger) =>
      columns.reduce((acc, column) => {
        acc[column] = ledger[column];
        return acc;
      }, {} as Ledger)
    );
    const csvData = convertToCSV(filteredData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "ledger_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-full">
      <ButtonWithIcon
        onClick={() => setIsColumnSelectorOpen((prev) => !prev)}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg mb-0 mt-1 hover:bg-gray-600"
        text={isColumnSelectorOpen ? "Hide Columns" : "Show Columns"}
        icon={<Filter />}
      />

      {isColumnSelectorOpen && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg my-2">
          {allColumns.map((column) => (
            <label key={column} className="block mb-2">
              <input
                type="checkbox"
                checked={visibleColumns.includes(column)}
                onChange={() => handleColumnToggle(column)}
                className="mr-2"
              />
              {column}
            </label>
          ))}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ledgers.map((ledger, index) => (
            <TableRow key={index}>
              {visibleColumns.map((column) => (
                <TableCell key={column}>{ledger[column]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-end">
        <ButtonWithIcon
          icon={<Download />}
          text="Download CSV"
          onClick={() =>
            handleDownloadCSV(isToggled ? visibleColumns : allColumns)
          }
          className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white active:bg-blue-600 active:border-blue-600"
        />
      </div>
    </div>
  );
};

export default LedgerGrid;
