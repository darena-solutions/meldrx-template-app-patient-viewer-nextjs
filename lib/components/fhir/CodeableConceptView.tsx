import React from 'react';
import { Coding, CodeableConcept } from 'fhir/r4';
import CodingView from './CodingView';

export enum CodeableConceptViewDisplayMode {
  normal = "normal",
  inline = "inline"
}

export interface ICodeableConceptViewProps { 
  codeableConcept?: CodeableConcept,
  displayMode?: CodeableConceptViewDisplayMode
  style?: React.CSSProperties;
};

export default function CodeableConceptView(props: ICodeableConceptViewProps) {
    // Default values...
    const displayMode = props.displayMode ?? CodeableConceptViewDisplayMode.normal;

    // Check if data is available...
    if (!props.codeableConcept) { return <div />; }
    if (!props.codeableConcept.coding && !props.codeableConcept.text) { return <div />; }

    const getCodings = (coding: Coding | Coding[]) => {

      // Convert to array if not an array...
      if (!Array.isArray(coding)) { coding = [coding]; }

      // Get list of CodingViews...
      const elCoding = coding.map((coding: Coding, idx: number, array: Coding[]) => {
          // For inline, we separate everything by a comma...
          if (displayMode === CodeableConceptViewDisplayMode.inline) {
            return (
              <div key={idx} style={{ display: "inline" }} className="CodeableConceptView_codingElementContainer">
                  <CodingView coding={coding} />
                  {idx < array.length - 1 ? <span>, </span> : null}
              </div>
            );
          // For normal, everything is on a new line...
          } else {
            return (
              <div key={idx} className="CodeableConceptView_codingElementContainer">
                  <CodingView coding={coding} />
              </div>
            );
          }
      });

      return elCoding;
    }

    const getText = (text: string) => {
      const isInlineMode = displayMode === CodeableConceptViewDisplayMode.inline;
      const styles = {
        display: isInlineMode ? 'inline' : 'unset'
      }

      return (
        <div style={styles} className="CodeableConceptView_codingElementContainer">
            <span>{text}</span>
        </div>
      );
    }

    let display = <></>;
    if (props.codeableConcept.text) { display = <span>{getText(props.codeableConcept.text)}</span>; }
    else if (props.codeableConcept.coding) { display = <>{getCodings(props.codeableConcept.coding)}</>; }

    return (
        <div className="CodeableConceptView_container" style={props.style}>
            {display}
        </div>
    );
}