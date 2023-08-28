import React from "react";
import { Table } from "@mantine/core";
import { ColumnDef, Row, SortingState, useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";

export interface IDataTableProps<TData, TColumns> {
    data: TData[];
    toTableData: (item: TData) => TColumns;
    columns: ColumnDef<TColumns>[];
    renderRow: (row: Row<TColumns>) => JSX.Element;
    tableClassName: string;

    onEditClick?: (id?: string) => void;
    onDeleteClick?: (id?: string) => void;
    onAddPersonClick?: (id?: string) => void;
    onAddEncounterClick?: (id?: string) => void;
}

export default function DataTable<TData, TColumns>(props: IDataTableProps<TData, TColumns>) {
    const [sorting, setSorting] = React.useState<SortingState>([])

    // Get data...
    const { data: tableData, toTableData } = props;
    const data = React.useMemo((): TColumns[] => {
        return tableData.map((item: TData) => toTableData(item));
    }, [tableData, toTableData]);

    // Setup columns...
    const columns = React.useMemo(() => { return props.columns; }, [props.columns]);

    const table = useReactTable({
        data,
        columns,
        filterFns: { },
        state: { sorting, },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    });

    return (
        <Table className={props.tableClassName}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                        {header.isPlaceholder
                            ? null
                            : <div { ... { onClick: header.column.getToggleSortingHandler() }}>
                                <span>{header.column.getIsSorted() ? header.column.getIsSorted() === 'desc' ? ' ▾' : ' ▴' : ' '}</span>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </div>
                        }
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map(props.renderRow)}
            </tbody>
        </Table>
    );
}