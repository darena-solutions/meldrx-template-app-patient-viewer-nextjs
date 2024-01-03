import React, { useState, useCallback } from "react";
import * as r4 from "fhir/r4";
import { formatRange, parseRange } from "@/lib/utils/fhir-utils";

export interface IAgeRangeEditProps {
    placeholder?: string;

    value?: r4.Range | undefined;
    onChange?: (text: string, value: r4.Range | undefined) => void;
}

const AgeRangeEdit: React.FC<IAgeRangeEditProps> = (props: IAgeRangeEditProps) => {
    const [, setRangeValue] = useState<r4.Range | undefined>(props.value);
    const [rangeText, setRangeText] = useState<string>((props.value) ? formatRange(props.value) : "");

    const onChange = useCallback((e: any) => {
        const s = e.target.value;

        // Try to parse the range. If we can, then update the value and reformat.
        // If we can't, erase the value and leave the format as-is.
        const range = parseRange(s);
        let text = (range) ? formatRange(range) : s;

        // Update state...
        setRangeValue(range);
        setRangeText(text);

        // Call client onChange...
        if (props.onChange) { props.onChange(text, range); }

    }, [props.onChange, setRangeValue, setRangeText]);

    return (
        <input type="text" className="AgeRangeEdit"
            placeholder={props.placeholder ?? ""}
            value={rangeText}
            onChange={onChange}
        />
    );
}

export default AgeRangeEdit;