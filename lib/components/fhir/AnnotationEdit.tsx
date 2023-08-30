import { useCallback } from "react";
import * as r4 from "fhir/r4";

export interface IAnnotationEditProps {
    placeholder?: string;

    annotation?: r4.Annotation | undefined;
    onChange?: (text: string) => void;
}
export const AnnotationEdit: React.FC<IAnnotationEditProps> = (props) => {
    const onChange = useCallback((e: any) => {
        const text = e.target.value;
        if (props.onChange) { props.onChange(text); }
    }, [props.onChange])

    return (
        <textarea className="AnnotationEdit"
            placeholder={props.placeholder ?? ""}
            onChange={onChange}
            value={props.annotation?.text ?? ""}
        ></textarea>
    );
}