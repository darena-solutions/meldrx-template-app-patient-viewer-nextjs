import React from 'react';
import * as r4 from "fhir/r4";
import { Resources } from "@meldrx/meldrx-fhir-client";

export interface IHumanNameViewProps { humanName?: r4.HumanName };
export function HumanNameView(props: IHumanNameViewProps) {
    // Check if data is available...
    if (!props.humanName) { return <div />; }

    return (
        <div className="HumanNameView_container">
            <span className="HumanNameView_formattedName">{formatName(props.humanName)}</span>
        </div>
    );
}

function formatName(name?: r4.HumanName): string {
    // Check if name exists...
    if (!name) { return "Unknown"; }
    return Resources.r4.HumanName.toString(name);
}

export default HumanNameView;