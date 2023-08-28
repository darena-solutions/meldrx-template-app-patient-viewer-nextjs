import React from "react";
import { Condition } from "fhir/r4";
import CodeableConceptView from "./CodeableConceptView";
import DateView from "./DateView";

export interface IConditionViewProps { condition?: Condition; }
export const ConditionView: React.FC<IConditionViewProps> = (props) => {
    if (!props.condition) { return <div />; }
    if (!props.condition.code) { return <div />; }
    if (!props.condition.code.coding) { return <div />; }
    if (!props.condition.code.coding[0]) { return <div />; }

    return (
        <div className="ConditionView_container">
            <div>
                <div className="ConditionView_code">
                    <CodeableConceptView codeableConcept={props.condition.code} />
                </div>
                <div className="ConditionView_content">
                    {!!props.condition.clinicalStatus ? <div className="ConditionView_clinicalStatus">
                        <CodeableConceptView codeableConcept={props.condition.clinicalStatus} />
                    </div> : null}

                    {!!props.condition.onsetDateTime ? <div className="ConditionView_onsetDate">
                        Onset Date: <DateView date={props.condition.onsetDateTime} />
                    </div> : null}

                    {!!props.condition.recordedDate ? <div className="ConditionView_recordedDate">
                        Recorded Date: <DateView date={props.condition.recordedDate} />
                    </div> : null}
                </div>
            </div>
        </div>
    );
}

export default ConditionView;