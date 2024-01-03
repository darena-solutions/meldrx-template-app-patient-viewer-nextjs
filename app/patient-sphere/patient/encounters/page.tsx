"use client";

import React, { useState, useEffect, useCallback, useContext } from "react";
import * as r4 from "fhir/r4";
import { Container, LoadingOverlay, Title, Table as MantineTable } from "@mantine/core";
import Head from "next/head";
import { useTable, useSortBy, Column } from "react-table";
import { AppContext } from "@/lib/hooks/AppContext/AppContext";
import CodeableConceptView from "@/lib/components/fhir/CodeableConceptView";
import DateView from "@/lib/components/fhir/DateView";
import { sortCodeableConceptByDisplayText } from "@/lib/utils/fhir-utils";

export interface IPageProps { }
export default function Page(props: IPageProps) {
    const appContext = useContext(AppContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [encounters, setEncounters] = useState<r4.Encounter[]>([]);

    useEffect(() => {
        const load = async() => {
            if (!appContext.accessToken) { return; }
            if (!appContext.fhirClient) { return; }

            setIsLoading(true);

            const patientId = appContext.patientFhirId;
            const encounters = await appContext.fhirClient.request(`Encounter?patient=${patientId}`, { flat: true });
            setEncounters(encounters);

            setIsLoading(false);
        }

        load();

    }, [setIsLoading, setEncounters]);

    const sortDateTimeView = React.useMemo(() => {
        return (rowA: any, rowB: any, columnId: string, desc: boolean) => {
            const sa = rowA.values[columnId].props.datetime;
            const sb = rowB.values[columnId].props.datetime;
            const da = new Date(sa);
            const db = new Date(sb);
            return da.getTime() - db.getTime();
        };
    }, []);

    const sortEncounterType = React.useMemo(() => {
        return (rowA: any, rowB: any, columnId: string, desc: boolean) => {
            const cca = rowA.values[columnId].props.codeableConcept;
            const ccb = rowB.values[columnId].props.codeableConcept;
            return sortCodeableConceptByDisplayText(cca, ccb);
        };
    }, []);

    const data = React.useMemo(() => {
        return encounters.map((encounter, idx) => {
            return {
                date: (encounter.period && encounter.period.start) ? <DateView date={encounter.period.start} /> : <span>{"Unknown"}</span>,
                type: (encounter.type && encounter.type.length > 0) ? <CodeableConceptView codeableConcept={encounter.type[0]} /> : <span>{"Unknown"}</span>,
                reason: "N/A"
            };
        });
    }, [encounters]);

    const columns: Column<TableColumns>[] = React.useMemo(() => {
        return [
            { Header: 'Date', accessor: 'date', sortType: sortDateTimeView },
            { Header: 'Type', accessor: 'type', sortType: sortEncounterType },
            { Header: 'Reason', accessor: 'reason', sortType: "string" }
        ];
    }, [sortDateTimeView, sortEncounterType]);

    return (
        <Container fluid={true}>
            <Head><title>Encounters</title></Head>
            <LoadingOverlay visible={isLoading} />
            <Title>Encounters</Title>

            {!isLoading ?
            <div className="g-4">
                <Table columns={columns} data={data} />
            </div> : null}
        </Container>
    );
}

/**
 * Definition of columns for the table
 * Property names should match the "accessor" in the table columns
*/
type TableColumns = {
    date: JSX.Element;
    type: JSX.Element;
    reason: string;
};

/** Props for the table component */
interface ITableProps {
    columns: Column<TableColumns>[];
    data: TableColumns[];
}

function Table({ columns, data }: ITableProps) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useSortBy);

    return (
        <MantineTable striped highlightOnHover {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup: any, headerIdx: number) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={`EncountersHeader_${headerIdx}`}>
                    {headerGroup.headers.map((column: any, idx: number) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} key={`SubHeader_${idx}`}>
                        {column.render('Header')}
                        <span key={`column_header_icon_${idx}`}>{column.isSorted ? column.isSortedDesc ? ' ▾' : ' ▴' : ''}</span>
                    </th>
                    ))}
                </tr>
                ))}
            </thead>


            <tbody {...getTableBodyProps()}>
                {rows.map((row: any, i: number) => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()} key={`EncounterRow_${i}`}>
                    {row.cells.map((cell: any, idx: number) => {
                        return <td {...cell.getCellProps()} key={`EncounterCell_${idx}`}>{cell.render('Cell')}</td>
                    })}
                    </tr>
                )
                })}
            </tbody>
        </MantineTable>
    );
}
