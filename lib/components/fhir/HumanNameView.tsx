import React from 'react';
import * as r4 from "fhir/r4";
import { formatName } from '@/lib/utils/fhir-utils';

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

export default HumanNameView;