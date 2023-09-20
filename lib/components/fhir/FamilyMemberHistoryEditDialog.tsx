import React, { useState, useEffect } from "react";
import * as r4 from "fhir/r4";
import { Modal, Checkbox, Group, Space, TextInput, Button, Select } from '@mantine/core';
import { Resources } from "@meldrx/meldrx-fhir-client";
import QuantityEdit from "./QuantityEdit";
import AgeRangeEdit from "./AgeRangeEdit";
import { AnnotationEdit } from "./AnnotationEdit";

export interface IFamilyMemberHistoryEditDialogProps {
    familyMemberHistory: r4.FamilyMemberHistory | null;
    patientId: string;

    show: boolean;
    title: string;
    onSaveClick: (familyMember: r4.FamilyMemberHistory) => void;
    onCancelClick: () => void;
    onHide: () => void;
}

function getDefault(patientId: string): r4.FamilyMemberHistory {
    return new Resources.r4.FamilyMemberHistory(patientId, "FamilyMember");
}

function copy(familyMemberHistory: r4.FamilyMemberHistory): r4.FamilyMemberHistory {
    return structuredClone(familyMemberHistory);
}

export default function FamilyMemberHistoryEditDialog(props: IFamilyMemberHistoryEditDialogProps) {
    const [localFamilyMember, setLocalFamilyMember] = useState<r4.FamilyMemberHistory>(props.familyMemberHistory ? copy(props.familyMemberHistory) : getDefault(props.patientId));

    useEffect(() => {
        console.log("famhx", props.familyMemberHistory);
        setLocalFamilyMember(props.familyMemberHistory ? copy(props.familyMemberHistory) : getDefault(props.patientId));
    }, [props]);

    // Returns the "key" in the "FamilyMemberHistory_Relationship" object that matches the given relationship...
    const getFamilyMemberHistoryRelationshipKeyFromRelationship = (relationship: r4.CodeableConcept | undefined): string | undefined => {
        const key = Object.keys(Resources.r4.FamilyMemberHistory_Relationship).find(x =>
            ((Resources.r4.FamilyMemberHistory_Relationship as any)[x] as r4.Coding).code === props.familyMemberHistory?.relationship?.coding?.[0].code)
        return key;
    }

    const getSexKeyFromAdministrativeGender = (gender: r4.CodeableConcept | undefined): string | undefined => {
        const key = Object.keys(Resources.r4.AdministrativeGender).find(x =>
            ((Resources.r4.AdministrativeGender as any)[x] as r4.Coding).code === props.familyMemberHistory?.sex?.coding?.[0].code);
        return key;
    }

    return (
        <>
            <Modal opened={props.show} onClose={props.onHide} title={props.title}>
                <div className="FamilyMemberHistoryEditDialog_ModalBody w-full">
                    <div className="mb-4">

                        {/* Name */}
                        <TextInput placeholder="Name" label="Name" value={localFamilyMember.name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            console.log(event.currentTarget.value);
                            setLocalFamilyMember({ ...localFamilyMember, name: event.currentTarget.value });
                            console.log("Local fam", localFamilyMember);
                        }} />
                        <Space h="md" />

                        {/* Relationship */}
                        <Select label="Relationship" placeholder="Relationship" searchable
                            value={getFamilyMemberHistoryRelationshipKeyFromRelationship(localFamilyMember.relationship)}
                            data={
                                Object.keys(Resources.r4.FamilyMemberHistory_Relationship).map((key) => {
                                    const value = key;
                                    const label = key;
                                    return { value, label };
                                })
                            }
                            onChange={(key: string) => {
                                const code = (Resources.r4.FamilyMemberHistory_Relationship as any)[key] as r4.Coding;
                                const cc: r4.CodeableConcept = { coding: [code] };
                                setLocalFamilyMember({ ...localFamilyMember, relationship: cc });
                            }}
                        />
                        <Space h="md" />

                        <Group grow>
                            {/* Sex */}
                            <Select placeholder="Sex"
                                value={getSexKeyFromAdministrativeGender(localFamilyMember.sex)}
                                data={
                                    Object.keys(Resources.r4.AdministrativeGender).map((key) => {
                                        const value = key;
                                        const label = key;
                                        return { value, label };
                                    })
                                }
                                onChange={(key: string) => {
                                    const code = (Resources.r4.AdministrativeGender as any)[key] as r4.Coding;
                                    const cc: r4.CodeableConcept = { coding: [code] };
                                    setLocalFamilyMember({ ...localFamilyMember, sex: cc });
                                }}
                            />

                            {/* Is Deceased? */}
                            <Checkbox checked={localFamilyMember.deceasedBoolean} label="Deceased?" onChange={(event) => {
                                setLocalFamilyMember({ ...localFamilyMember, deceasedBoolean: event.currentTarget.checked });
                            }} />
                        </Group>
                        <Space h="md" />

                        {/* Age */}
                        {!localFamilyMember.deceasedBoolean ?
                            <>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Age</label>
                            <AgeRangeEdit value={localFamilyMember.ageRange} onChange={(text: string, range: r4.Range | undefined) => {
                                setLocalFamilyMember({ ...localFamilyMember, ageRange: range });
                            }} />
                            <Space h="md" />
                            </>
                        : null}

                        {/* Death Age */}
                        {localFamilyMember.deceasedBoolean ?
                            <>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Death age</label>
                            <QuantityEdit value={localFamilyMember.deceasedAge} onChange={(text: string, quantity: r4.Quantity | undefined) => {
                                setLocalFamilyMember({ ...localFamilyMember, deceasedAge: quantity });
                            }} />
                            <Space h="md" />
                            </>
                        : null}

                        {/* Note */}
                        <label className="block text-gray-700 text-sm font-bold mb-2 w-full">Note</label>
                        <AnnotationEdit annotation={localFamilyMember.note ? localFamilyMember.note[0] : undefined} onChange={(text: string) => {
                            setLocalFamilyMember({ ...localFamilyMember, note: [{ text: text }] });
                        }} />
                        <Space h="md" />

                    </div>

                    <Space h="md" />
                    <Button color="red" onClick={props.onCancelClick}>Cancel</Button>
                    {' '}
                    <Button onClick={() => props.onSaveClick(localFamilyMember)}>Save</Button>
                </div>
            </Modal>
        </>
    );
}