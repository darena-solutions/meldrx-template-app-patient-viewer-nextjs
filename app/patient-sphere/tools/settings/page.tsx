"use client";

import React, { useState, useContext } from "react";
import * as r4 from "fhir/r4";
import { Container, LoadingOverlay, Text, Grid, Textarea, Space, } from "@mantine/core";
import { AppContext } from "@/lib/hooks/AppContext/AppContext";

export interface IPageProps { }
export default function Page(props: IPageProps) {
    const [isLoading, setIsLoading] = useState(false);
    const appContext = useContext(AppContext);

    // Calculate when token will expire...
    let sTokenExpiration = "";
    if (appContext.fhirClient?.state.expiresAt) {
        const tokenExpiration = new Date(appContext.fhirClient?.state.expiresAt * 1000);
        sTokenExpiration = tokenExpiration.toLocaleString();
    }

    return (
        <Container fluid>
            <LoadingOverlay visible={isLoading} />

            {/* Title */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text weight="bold" size="xl" py={10}>Settings</Text>
            </div>

            {/* Display key/values in a nice grid */}
            <Grid style={{ padding: "20px" }}>
                <Grid.Col span={3}><Text align="left" weight="bold">Access Token:</Text></Grid.Col>
                <Grid.Col span={9}><Text style={{ overflowWrap: "break-word" }}>{appContext.accessToken}</Text></Grid.Col>

                <Grid.Col span={3}><Text align="left" weight="bold">ID Token:</Text></Grid.Col>
                <Grid.Col span={9}><Text style={{ overflowWrap: "break-word" }}>{appContext.idToken}</Text></Grid.Col>

                <Grid.Col span={3}><Text align="left" weight="bold">Patient:</Text></Grid.Col>
                <Grid.Col span={9}><Text>{appContext.patientFhirId}</Text></Grid.Col>

                <Grid.Col span={3}><Text align="left" weight="bold">Encounter:</Text></Grid.Col>
                <Grid.Col span={9}><Text>{appContext.encounterId}</Text></Grid.Col>

                <Grid.Col span={3}><Text align="left" weight="bold">User:</Text></Grid.Col>
                <Grid.Col span={9}><Text>{appContext.fhirUser}</Text></Grid.Col>

                <Grid.Col span={3}><Text align="left" weight="bold">FHIR URL:</Text></Grid.Col>
                <Grid.Col span={9}><Text>{appContext.fhirUrl}</Text></Grid.Col>

                <Grid.Col span={3}><Text align="left" weight="bold">Token Expiration:</Text></Grid.Col>
                <Grid.Col span={9}><Text>{sTokenExpiration}</Text></Grid.Col>
            </Grid>

            {/* Patient */}
            {!!appContext.patient &&
                <>
                    <Textarea label="Patient" minRows={20}>{JSON.stringify(appContext.patient, null, 2)}</Textarea>
                    <Space h="md" />
                </>
            }

            {/* User */}
            {!!appContext.user &&
                <>
                <Textarea label="User" minRows={20}>{JSON.stringify(appContext.user, null, 2)}</Textarea>
                <Space h="md" />
                </>
            }

            <div style={{ paddingBottom: "200px" }} />
        </Container>
    );
}