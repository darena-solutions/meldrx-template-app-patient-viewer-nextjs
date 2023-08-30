"use client";

import React, { useState, useEffect, useCallback, useContext } from "react";
import * as r4 from "fhir/r4";
import { Card, Container, LoadingOverlay, Title, Text, Button, Space, TextInput, Checkbox } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import Head from "next/head";
import { AppContext } from "@/lib/hooks/AppContext/AppContext";
import { AdministrativeGender, FamilyMemberHistory } from "@/lib/utils/fhir/FamilyMemberHistory";
import { Age } from "@/lib/utils/fhir/Age";
import { Range } from "@/lib/utils/fhir/Range";
import { fhirclient } from "fhirclient/lib/types";
import FamilyMemberHistoryTable, { FamilyMemberHistoryTableColumns } from "@/lib/components/fhir/FamilyMemberHistoryTable";
import CodeableConceptView from "@/lib/components/fhir/CodeableConceptView";
import FamilyMemberHistoryEditDialog from "@/lib/components/fhir/FamilyMemberHistoryEditDialog";
import { CodeableConcept } from "@/lib/utils/fhir/CodeableConcept";

export interface IPageProps { }
export default function Page(props: IPageProps) {
    const appContext = useContext(AppContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [familyMemberHistory, setFamilyMemberHistory] = useState<r4.FamilyMemberHistory[]>([]);
    const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
    const [activeFamilyMember, setActiveFamilyMember] = useState<r4.FamilyMemberHistory | null>(null);

    // Load Family History...
    const loadFamilyHistory = useCallback(async () => {
        if (!appContext.accessToken) { return; }
        if (!appContext.fhirClient) { return; }

        setIsLoading(true);

        const patientId = appContext.patientFhirId;
        const familyHistory = await appContext.fhirClient.request(`FamilyMemberHistory?patient=${patientId}`, { flat: true });
        setFamilyMemberHistory(familyHistory);
        console.log(familyHistory);

        setIsLoading(false);
    }, [appContext, setIsLoading, setFamilyMemberHistory]);

    // Load Family History when page opens...
    useEffect(() => { loadFamilyHistory(); }, [loadFamilyHistory]);

    // Creates a new FamilyMemberHistory...
    const createFamilyMember = useCallback(async (familyMember: r4.FamilyMemberHistory) => {
        if (!appContext.fhirClient) { return; }

        // Try to create it...
        const result = await appContext.fhirClient.create(familyMember as fhirclient.FHIR.Resource);
        console.log("Created family member", result);
    }, [appContext]);

    // Updates the given FamilyMemberHistory...
    const updateFamilyMember = useCallback(async (famMember: r4.FamilyMemberHistory) => {
        if (!appContext.fhirClient) { return; }

        const result = await appContext.fhirClient.update(famMember as fhirclient.FHIR.Resource);
        console.log("Updated family member", result);
    }, [appContext]);

    // Deletes the FamilyMemberHistory with the given ID...
    const deleteFamilyMember = useCallback(async (famMemberId: string) => {
        if (!appContext.fhirClient) { return; }

        const result = await appContext.fhirClient.delete(`FamilyMemberHistory/${famMemberId}`);
        console.log("Deleted family member", result);
    }, [appContext]);

    // "Add Family Member"...
    const onAddFamilyMemberPress = useCallback(async () => {
        if (!appContext.accessToken) { return; }
        if (!appContext.fhirClient) { return; }

        setShowEditDialog(true);
        setActiveFamilyMember(null);
    }, [appContext, setIsLoading]);

    // Create a family member...
    const onCreateFamilyMemberPress = useCallback(async (famMember: r4.FamilyMemberHistory) => {
        setIsLoading(true);

        const patientId = appContext.patientFhirId;
        const familyMember = new FamilyMemberHistory(patientId, "Father");  // TODO: Pass relationship
        familyMember.name = "John";
        familyMember.sex = AdministrativeGender.Male;
        familyMember.ageAge = Age.fromYears(60);
        await createFamilyMember(familyMember);

        await loadFamilyHistory();

        setIsLoading(false);
    }, []);

    // "Edit" a family member...
    const onUpdateFamilyMemberPress = useCallback(async (famMember: r4.FamilyMemberHistory) => {
        setShowEditDialog(true);
        setActiveFamilyMember(famMember);
    }, [appContext, setIsLoading, setActiveFamilyMember]);

    // "Save" a family member...
    const onSaveFamilyMemberPress = useCallback(async (famMember: r4.FamilyMemberHistory) => {

        // Determine if this is a new family member or existing...
        const isNew = !famMember.id;

        // If not new, just update it...
        if (!isNew) {
            setIsLoading(true);
            await updateFamilyMember(famMember);
            await loadFamilyHistory();
            setIsLoading(false);
        } else {
            const patientId = appContext.patientFhirId;
            famMember.patient = { reference: `Patient/${patientId}` };

            setIsLoading(true);
            await createFamilyMember(famMember);
            await loadFamilyHistory();
            setIsLoading(false);
        }

        // TODO:
        //const familyMember = new FamilyMemberHistory(patientId, "Father");  // TODO: Pass relationship
        //familyMember.name = "John";
        //familyMember.sex = AdministrativeGender.Male;
        //familyMember.ageAge = Age.fromYears(60);

        setShowEditDialog(false);
    }, [appContext, setIsLoading]);

    // "Delete" a family member...
    const onDeleteFamilyMemberPress = useCallback(async (famMember: r4.FamilyMemberHistory) => {
        setIsLoading(true);
        await deleteFamilyMember(famMember.id ?? "");
        await loadFamilyHistory();
        setIsLoading(false);
    }, [appContext, setIsLoading]);

    // Occurs when "Cancel" is clicked on the Add/Edit form...
    const onCancelEditFamilyMemberClick = useCallback(() => {
        setShowEditDialog(false);
        setActiveFamilyMember(null);
    }, [setShowEditDialog, setActiveFamilyMember]);

    // Format table data...
    const tableData = React.useMemo((): FamilyMemberHistoryTableColumns[] => {
        if (!familyMemberHistory || !familyMemberHistory.map) { return []; }

        return familyMemberHistory.map((familyMemberHistory, idx) => {
            const sConditions = (familyMemberHistory.condition)
                ? familyMemberHistory.condition.map((c: any) => { return c.code.text; }).join(", ")
                : "";

            let age = "";
            if (familyMemberHistory.ageAge) { age = familyMemberHistory.ageAge.value?.toString() || ""; }
            else if (familyMemberHistory.ageRange) { age = Range.toString(familyMemberHistory.ageRange); }

            let sex = "";
            if (familyMemberHistory.sex?.text) { sex = familyMemberHistory.sex?.text; }
            else if (familyMemberHistory.sex) { sex = CodeableConcept.getDisplayText(familyMemberHistory.sex); }

            return {
                delete: <Button color="red" variant="subtle" onClick={() => onDeleteFamilyMemberPress(familyMemberHistory)}>Delete</Button>,
                edit: <Button variant="outline" onClick={() => onUpdateFamilyMemberPress(familyMemberHistory)}>Edit</Button>,
                relationship: <CodeableConceptView codeableConcept={familyMemberHistory.relationship} />,
                name: familyMemberHistory.name || "",
                sex: sex,
                age: age,
                conditions: sConditions
            };
        });
    }, [familyMemberHistory]);

    return (
        <Container fluid={true}>
            <Head><title>Family History</title></Head>
            <LoadingOverlay visible={isLoading} />
            <Title>Family History</Title>
            <Space h="md" />

            {/* Edit Modal */}
            <FamilyMemberHistoryEditDialog
                show={showEditDialog}
                onHide={() => setShowEditDialog(false)}
                onSaveClick={onSaveFamilyMemberPress}
                onCancelClick={onCancelEditFamilyMemberClick}
                title={"Family Member"}
                familyMemberHistory={activeFamilyMember}
                patientId={appContext.patientFhirId}
            />

            {/* Refresh Button */}
            <div style={{ float: "right" }}>
                <Button leftIcon={<IconRefresh />} variant="white" onClick={loadFamilyHistory}>Refresh</Button>
            </div>

            {/* Add Family Member */}
            <Button onClick={onAddFamilyMemberPress}>Add Family Member</Button>
            <Space h="md" />

            {/* Family History Table */}
            {!isLoading && familyMemberHistory.length > 0 ?
                <FamilyMemberHistoryTable data={tableData} />
                : <Text>No Family History found</Text>
            }
        </Container>
    );
}