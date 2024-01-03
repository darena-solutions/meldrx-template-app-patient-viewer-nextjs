import React from "react";
import { Card, Text } from "@mantine/core";
import HumanNameView from "./HumanNameView";
import AddressView from "./AddressView";
import * as r4 from "fhir/r4";
import { getOfficialNameForPatient, getHomeAddressForPatient, getBirthDateForPatient, getAgeFromBirthDate } from "@/lib/utils/fhir-utils";

export interface IPatientHeaderProps { patient?: r4.Patient };
export default function PatientHeader(props: IPatientHeaderProps) {
    // Check if data is available...
    if (!props.patient) { return <div />; }
    if (!props.patient.name) { return <div />; }

    const officialName = getOfficialNameForPatient(props.patient);
    const homeAddress = getHomeAddressForPatient(props.patient);

    return (
        <Card shadow="lg">
            <div className="PatientHeader_container">
                <div>
                    <HumanNameView humanName={officialName} />

                    <div className="PatientHeader_sexAgeDOB">
                        <SexAgeDOB patient={props.patient} />
                    </div>

                    <div className="PatientHeader_patientId">
                        <div>
                            <Text size="xs" color="gray" italic={true}>{props.patient.id}</Text>
                        </div>
                    </div>

                    {homeAddress &&
                    <>
                        <div className="PatientHeader_address">
                            <label>Address</label>
                        </div>
                        <AddressView address={homeAddress} />
                    </>
                    }

                </div>
            </div>
        </Card>
    );
}


interface ISexAgeDOBProps { patient?: r4.Patient };
function SexAgeDOB(props: ISexAgeDOBProps) {
    // Check if data is available...
    if (!props.patient) { return <div />; }

    // If patient has DOB, build that element...
    let elAgeDOB = null;
    if (props.patient.birthDate) {
        const dob = getBirthDateForPatient(props.patient);
        const age = (dob) ? getAgeFromBirthDate(dob) : "Unknown";

        elAgeDOB = (
            <>{', '}
                <label className="SexAgeDOB_age">{age + "y"}</label>{', '}
                <label className="SexAgeDOB_dob">{(dob) ? dob.toLocaleDateString() : "Unknown"}</label>
            </>
        );
    }

    // Get patient's sex...
    const elSex = <label className="SexAgeDOB_gender">{props.patient.gender}</label>;

    return (
        <div className="SexAgeDOB_container">
            {elSex}
            {elAgeDOB}
        </div>
    );
}