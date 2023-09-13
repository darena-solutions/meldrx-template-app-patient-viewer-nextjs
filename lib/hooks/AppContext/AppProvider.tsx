import { useState } from "react";
import { EHRTypes, IAppContext, AppContext } from "./AppContext";
import Client from "fhirclient/lib/Client";

export interface IAppProviderProps {
    children: React.ReactNode;
}

const DEFAULT_APP_CONTEXT: IAppContext = {
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
    setPatient: (patient: any) => {},
    setEncounterId: (encounterId: string) => {},
    setFhirUser: (fhirUser: string) => {},
    setUser: (user: any) => {},
    setFhirUrl: (fhirUrl: string) => {},
    setFhirClient: (fhirClient: Client | null) => {}
}

export function AppProvider(props: IAppProviderProps) {
    const [accessToken, setAccessToken] = useState<string>(DEFAULT_APP_CONTEXT.accessToken);
    const [idToken, setIdToken] = useState<string>(DEFAULT_APP_CONTEXT.idToken);
    const [ehrType, setEhrType] = useState<EHRTypes | "">(DEFAULT_APP_CONTEXT.ehrType);
    const [patientFhirId, setPatientFhirId] = useState<string>(DEFAULT_APP_CONTEXT.patientFhirId);
    const [patient, setPatient] = useState<any>(DEFAULT_APP_CONTEXT.patient);
    const [encounterId, setEncounterId] = useState<string>(DEFAULT_APP_CONTEXT.encounterId);
    const [fhirUser, setFhirUser] = useState<string>(DEFAULT_APP_CONTEXT.fhirUser);
    const [user, setUser] = useState<any>(DEFAULT_APP_CONTEXT.user);
    const [fhirUrl, setFhirUrl] = useState<string>(DEFAULT_APP_CONTEXT.fhirUrl);
    const [fhirClient, setFhirClient] = useState<Client | null>(DEFAULT_APP_CONTEXT.fhirClient);

    return (
        <AppContext.Provider value={{
            accessToken, idToken, ehrType, patientFhirId, patient, encounterId, fhirUser, user, fhirUrl, fhirClient,
            setAccessToken, setIdToken, setEhrType, setPatientFhirId, setPatient, setEncounterId, setFhirUser, setUser, setFhirUrl, setFhirClient
        }}>
            {props.children}
        </AppContext.Provider>
    );
}