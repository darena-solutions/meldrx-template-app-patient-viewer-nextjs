import React from "react";
import { AllergyIntoleranceReaction, CodeableConcept } from "fhir/r4";
import CodeableConceptView from "./CodeableConceptView";

export interface IAllergyIntoleranceReactionViewProps { reaction?: AllergyIntoleranceReaction; }
export const AllergyIntoleranceReactionView: React.FC<IAllergyIntoleranceReactionViewProps> = (props) => {
    if (!props.reaction) { return <div />; }

    // Manifestation(s)...
    const elManifestations = props.reaction.manifestation.map((manifestation: CodeableConcept, index: number) => {
        return (
            <div className="AllergyIntoleranceReactionView_manifestation" key={`AllergyIntoleranceReactionView_manifestation_${index}`}>
                <CodeableConceptView key={index} codeableConcept={manifestation} />
            </div>
        );
    });

    return (
        <div className="AllergyIntoleranceReactionView_container">
            {elManifestations}
            {props.reaction.description ? <span className="AllergyIntoleranceReactionView_description">{props.reaction.description}</span> : null}
            {props.reaction.severity ? <span className="AllergyIntoleranceReactionView_severity">{props.reaction.severity}</span> : null}
        </div>
    );
}

export default AllergyIntoleranceReactionView;