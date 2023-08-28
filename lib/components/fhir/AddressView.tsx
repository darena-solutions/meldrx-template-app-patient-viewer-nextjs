import React from 'react';
import { Address } from '@/lib/utils/fhir/Address';

export interface IAddressViewProps { address?: Address };
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
function getCityStateZipElement(address: Address): JSX.Element
{
    return (
        <div className="AddressView_cityStateContainer">
            {Address.toString(address)}
        </div>
    );
}

export default AddressView;