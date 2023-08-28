"use client";

import React, { useState, useEffect, useCallback, useContext } from "react";
import * as r4 from "fhir/r4";
import { Card, Container, Grid, LoadingOverlay, Title, Text } from "@mantine/core";
import Head from "next/head";
import { AppContext } from "@/lib/hooks/AppContext/AppContext";
import AllergyIntoleranceView from "@/lib/components/fhir/AllergyIntoleranceView";
import AllergyIntoleranceReactionView from "@/lib/components/fhir/AllergyIntoleranceReactionView";

export interface IPageProps { }
export default function Page(props: IPageProps) {
    const appContext = useContext(AppContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allergies, setAllergies] = useState<r4.AllergyIntolerance[]>([]);

    useEffect(() => {
        const load = async() => {
            if (!appContext.accessToken) { return; }
            if (!appContext.fhirClient) { return; }

            setIsLoading(true);

            const patientId = appContext.patientFhirId;
            const allergies = await appContext.fhirClient.request(`AllergyIntolerance?patient=${patientId}`, { flat: true });
            console.log(allergies);
            setAllergies(allergies);

            setIsLoading(false);
        }

        load();

    }, [setIsLoading, setAllergies, appContext]);

    return (
        <Container fluid={true}>
            <Head><title>Allergies</title></Head>
            <LoadingOverlay visible={isLoading} />
            <Title>Allergies</Title>

            {!isLoading && allergies.length > 0 ?
            <Grid>
            {
                allergies.map((allergy, idx) => {
                    return (
                        <Grid.Col md={4} key={"AllergyIntoleranceItem_" + idx.toString()}>
                            <Card className="border">
                                <div>
                                    <AllergyIntoleranceView allergyIntolerance={allergy} />
                                    {allergy.reaction ? allergy.reaction.map((reaction: any, idx: number) => {
                                        return <AllergyIntoleranceReactionView reaction={reaction} key={`AllergyIntoleranceReaction_${idx}`} />
                                    }) : null}
                                </div>
                            </Card>
                        </Grid.Col>
                    );
                })
            }
            </Grid> : <Text>No allergies found</Text>}
        </Container>
    );
}