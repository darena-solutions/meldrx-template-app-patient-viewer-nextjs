import React from 'react';
import * as r4 from "fhir/r4";
import { formatAddress } from '@/lib/utils/fhir-utils';

export interface IAddressViewProps { address?: r4.Address };
export function AddressView(props: IAddressViewProps) {
    // Check if data is available...
    if (!props.address) { return <div />; }

    const elCityStateZip = getCityStateZipElement(props.address);
    return (
        <div className="AddressView_container">
            {elCityStateZip}
        </div>
    );
}

// Returns a <div> containing the city/state data...
function getCityStateZipElement(address: r4.Address): JSX.Element
{
    return (
        <div className="AddressView_cityStateContainer">
            {formatAddress(address)}
        </div>
    );
}

export default AddressView;