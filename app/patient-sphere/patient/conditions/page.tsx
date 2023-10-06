"use client";

import React, { useState, useEffect, useCallback, useContext } from "react";
import * as r4 from "fhir/r4";
import { Card, Container, LoadingOverlay, Title, Text } from "@mantine/core";
import Head from "next/head";
import { AppContext } from "@/lib/hooks/AppContext/AppContext";
import ConditionView from "@/lib/components/fhir/ConditionView";

export interface IPageProps { }
export default function Page(props: IPageProps) {
    const appContext = useContext(AppContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [conditions, setConditions] = useState<r4.Condition[]>([]);

    useEffect(() => {
        const load = async() => {
            if (!appContext.accessToken) { return; }
            if (!appContext.fhirClient) { return; }

            setIsLoading(true);

            const patientId = appContext.patientFhirId;
            const conditions = await appContext.fhirClient.request(`Condition?patient=${patientId}&category=problem-list-item&clinical-status=active`, { flat: true });
            setConditions(conditions);

            setIsLoading(false);
        }

        load();

    }, [setIsLoading, setConditions]);


    return (
        <Container fluid={true}>
            <Head><title>Conditions</title></Head>
            <LoadingOverlay visible={isLoading} />
            <Title>Conditions</Title>

            {!isLoading && conditions.length > 0 ?
            <div className="g-4">
            {
                conditions.map((condition: r4.Condition, idx: number) => {
                    return (
                        <div className="py-2" key={"ConditionView_" + idx.toString()}>
                            <Card shadow="sm" className="border">
                                <ConditionView condition={condition} />
                            </Card>
                        </div>
                    );
                })
            }
            </div> : <Text>No conditions found</Text>}
        </Container>
    );
}