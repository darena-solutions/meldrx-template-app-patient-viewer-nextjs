import React from "react";
import { Coding } from "fhir/r4";

export interface ICodingViewProps { coding?: Coding };
export default function CodingView(props: ICodingViewProps) {
    // Check if data is available...
    if (!props.coding) { return <div />; }

    let display = "";
    if (props.coding.display) { display = props.coding.display; }
    else if (props.coding.code) { display = props.coding.code; }

    return <span className="CodingView_container">{display}</span>;
}