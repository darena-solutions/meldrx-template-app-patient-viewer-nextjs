import React from 'react';
import { useTable, useSortBy, Column } from "react-table";
import { Resources } from "@meldrx/meldrx-fhir-client";

/**
 * Definition of columns for the table
 * Property names should match the "accessor" in the table columns
*/
export interface FamilyMemberHistoryTableColumns {
    delete: JSX.Element;
    edit: JSX.Element;
    relationship: JSX.Element;
    name: string;
    sex: string;
    age: string;
    conditions: string;
};

/** Props for the table component */
export interface ITableProps {
    data: FamilyMemberHistoryTableColumns[];
}

export default function FamilyMemberHistoryTable({ data }: ITableProps) {
    // Sort a column by codeable concept value...
    const sortCode = React.useMemo(() => {
        return (rowA: any, rowB: any, columnId: string, desc: boolean) => {
            const cca = rowA.values[columnId].props.codeableConcept;
            const ccb = rowB.values[columnId].props.codeableConcept;
            return Resources.r4.CodeableConcept.sortByDisplayText(cca, ccb);
        };
    }, []);

    const columns: Column<FamilyMemberHistoryTableColumns>[] = React.useMemo(() => { 
        return [
            { Header: '', accessor: 'delete', canSort: false },
            { Header: '', accessor: 'edit', canSort: false },
            { Header: 'Relationship', accessor: 'relationship', sortType: sortCode },
            { Header: 'Name', accessor: 'name', sortType: "string" },
            { Header: 'Sex', accessor: 'sex', sortType: "string" },
            { Header: 'Age', accessor: 'age', sortType: "string" },
            { Header: 'Conditions', accessor: 'conditions', sortType: "string" },
        ];
    }, []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useSortBy);

    return (
        <table {...getTableProps()} className="FamilyHistoryTable">
            <thead>
                {headerGroups.map((headerGroup: any, rowIndex: number) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={`FamilyHistoryHeaderRow_${rowIndex}`}>
                    {headerGroup.headers.map((column: any, headerIndex: number) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} key={`FamilyHistoryHeaderCell_${headerIndex}`}>
                        {column.render('Header')}
                        <span key={`ColumnHeaderSort_${headerIndex}`}>{column.isSorted ? column.isSortedDesc ? ' ▾' : ' ▴' : ''}</span>
                    </th>
                    ))}
                </tr>
                ))}
            </thead>


            <tbody {...getTableBodyProps()}>
                {rows.map((row: any, i: number) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()} key={`FamilyHistorBodyrRow_${i}`}>
                    {row.cells.map((cell: any, cellIndex: number) => {
                        return <td {...cell.getCellProps()} key={`FamilyHistoryBodyCell_${cellIndex}`}>{cell.render('Cell')}</td>
                    })}
                    </tr>
                )
                })}
            </tbody>
        </table>
    );
}