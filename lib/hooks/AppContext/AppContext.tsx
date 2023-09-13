import { createContext } from "react";
import * as r4 from "fhir/r4";
import Client from "fhirclient/lib/Client";

export type EHRTypes = "smarthealthit" | "epic" | "cerner" | "athenahealth";

export interface IAppContext {
    // MeldRx Data...
    accessToken: string;
    idToken: string;

    ehrType: EHRTypes | "";
    patientFhirId: string;
    patient: r4.Patient | null;
    encounterId: string;
    fhirUser: string;   // Example: "Practitioner/12345678"
    user: r4.Patient | r4.Practitioner | r4.RelatedPerson | r4.Person | r4.PractitionerRole | null;
    fhirUrl: string;

    fhirClient: Client | null;

    setAccessToken: (accessToken: string) => void;
    setIdToken: (idToken: string) => void;
    setEhrType: (ehrType: EHRTypes) => void;
    setPatientFhirId: (patientFhirId: string) => void;
    setPatient: (patient: r4.Patient | null) => void;
    setEncounterId: (encounterId: string) => void;
    setFhirUser: (fhirUser: string) => void;
    setUser: (user: r4.Patient | r4.Practitioner | r4.RelatedPerson | r4.Person | r4.PractitionerRole | null) => void;
    setFhirUrl: (fhirUrl: string) => void;
    setFhirClient: (fhirClient: Client | null) => void;
}

export const AppContext = createContext<IAppContext>({
    accessToken: "",
    idToken: "",

    ehrType: "",
    patientFhirId: "",
    patient: null,
    encounterId: "",
    fhirUser: "",
    user: null,
    fhirUrl: "",
    fhirClient: null,

    setAccessToken: (accessToken: string) => {},
    setIdToken: (idToken: string) => {},
    setEhrType: (ehrType: string) => {},
    setPatientFhirId: (patientFhirId: string) => {},
    setPatient: (patient: r4.Patient | null) => {},
    setEncounterId: (encounterId: string) => {},
    setFhirUser: (fhirUser: string) => {},
    setUser: (user: r4.Patient | r4.Practitioner | r4.RelatedPerson | r4.Person | r4.PractitionerRole | null) => {},
    setFhirUrl: (fhirUrl: string) => {},
    setFhirClient: (fhirClient: Client | null) => {},
});