"use client";

import React, { useState, useEffect, useCallback, useContext } from "react";
import * as r4 from "fhir/r4";
import { Card, Container, LoadingOverlay, Title, Text } from "@mantine/core";
import Head from "next/head";
import { AppContext } from "@/lib/hooks/AppContext/AppContext";
import ImmunizationView from "@/lib/components/fhir/ImmunizationView";

export interface IPageProps { }
export default function Page(props: IPageProps) {
    const appContext = useContext(AppContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [immunizations, setImmunizations] = useState<r4.Immunization[]>([]);

    useEffect(() => {
        const load = async() => {
            if (!appContext.accessToken) { return; }
            if (!appContext.fhirClient) { return; }

            setIsLoading(true);

            const patientId = appContext.patientFhirId;
            const immunizations = await appContext.fhirClient.request(`Immunization?patient=${patientId}`, { flat: true });
            setImmunizations(immunizations);

            setIsLoading(false);
        }

        load();

    }, [setIsLoading, setImmunizations]);


    return (
        <Container fluid={true}>
            <Head><title>Immunizations</title></Head>
            <LoadingOverlay visible={isLoading} />
            <Title>Immunizations</Title>

            {!isLoading && immunizations.length > 0 ?
            <div className="g-4">
                {
                    immunizations.map((immunization, idx) => {
                        return (
                            <Card style={{ marginTop: "10px" }} key={`ImmunizationCard_${idx}`} shadow="sm" className="border">
                                <ImmunizationView immunization={immunization} />
                            </Card>
                        );
                    })
                }
            </div> : <Text>No immunizations found</Text>}
        </Container>
    );
}