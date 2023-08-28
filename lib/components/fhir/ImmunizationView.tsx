import React from "react";
import { Immunization } from "fhir/r4";
import CodeableConceptView from "./CodeableConceptView";

export interface IImmunizationViewProps { immunization?: Immunization; }
export const ImmunizationView: React.FC<IImmunizationViewProps> = (props) => {
    if (!props.immunization) { return <div />; }
    if (!props.immunization.vaccineCode) { return <div />; }

    return (
        <div className="ImmunizationView_container">
            <div>
                <div className="ImmunizationView_vaccineCode">
                    <CodeableConceptView codeableConcept={props.immunization.vaccineCode} />
                </div>
                <p className="ImmunizationView_status">
                    Status: {props.immunization.status}
                </p>
                {
                    props.immunization.occurrenceDateTime && <p className="ImmunizationView_occurrenceDateTime">
                        Date: {new Date(props.immunization.occurrenceDateTime).toLocaleDateString()}
                    </p>
                }
            </div>
        </div>
    );
}

export default ImmunizationView;