"use client";

import React, { useState, useContext, useEffect, useCallback } from "react";
import * as r4 from "fhir/r4";
import { Button, Card, Code, Container, Grid, Select, LoadingOverlay, Space, Text, TextInput, Textarea } from "@mantine/core";
import { AppContext } from "@/lib/hooks/AppContext/AppContext";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface IPageProps { }
export default function Page(props: IPageProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [method, setMethod] = useState<HttpMethod>("GET");
    const [query, setQuery] = useState("");
    const [fullUrl, setFullUrl] = useState("");``
    const [jsonResponse, setJsonResponse] = useState("");
    const appContext = useContext(AppContext);

    // Update URL when the query changes...
    useEffect(() => {
        const url = `${appContext.fhirUrl}/${query}`;
        setFullUrl(url);
    }, [query, setFullUrl]);

    const onRunQueryClick = useCallback(async () => {
        setIsLoading(true);

        // Run a GET request on the fullUrl and attach the bearer token...
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${appContext.accessToken}`);
        const body = (method === "GET" || method == "DELETE")
            ? undefined
            : jsonResponse;
        const response = await fetch(fullUrl, { headers, method, body });
        const jResponse = await response.json();

        setJsonResponse(JSON.stringify(jResponse, null, 2));
        setIsLoading(false);
    }, [fullUrl, method, setIsLoading, setJsonResponse]);

    return (
        <Container fluid>
            <LoadingOverlay visible={isLoading} />

            {/* Title */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text weight="bold" size="xl" py={10}>Playground</Text>
            </div>
            <hr style={{ paddingTop: "20px" }} />
            <div ></div>

            {/* FHIR Tester */}
            <Text>Enter a FHIR query below and click the "Run Query" button to execute the query.</Text>
            <Grid>
                <Grid.Col span={1}>
                    <Select
                        data={[
                            { value: "GET", label: "GET" },
                            { value: "POST", label: "POST" },
                            { value: "PUT", label: "PUT" },
                            { value: "DELETE", label: "DELETE" },
                        ]}
                        value={method}
                        onChange={(value) => setMethod(value as HttpMethod)}
                    />
                </Grid.Col>
                <Grid.Col span={8}>
                    <TextInput placeholder="Patient?given=john&family=doe" value={query} onChange={(e) => setQuery(e.target.value)} />
                </Grid.Col>
                <Grid.Col span={3}>
                    <Button onClick={onRunQueryClick}>Run Query</Button>
                </Grid.Col>
            </Grid>
            <Text size="xs" color="gray" style={{ paddingTop: "5px" }}>{fullUrl}</Text>

            {/* Results */}
            <Space h="md" />
            <Card p={0}>
                <Text weight="bold">Results</Text>
                <Textarea ff="monospace" minRows={100} value={jsonResponse}></Textarea>
            </Card>
        </Container>
    );
}