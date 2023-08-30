import * as r4 from "fhir/r4";

export interface Reference extends r4.Reference {}
export class Reference {
    /**
     * Create a Reference
     * @param reference Reference in the form {resourceType}/{id}
     * @param display Display text
     */
    constructor(reference: string, display?: string) {
        this.reference = reference;
        this.display = display;
    }

    public static createReference(resource: string, id: string, display?: string): r4.Reference {
        return new Reference(resource + "/" + id, display);
    }

    public static fromResource(resource: r4.Resource, display?: string): r4.Reference {
        return Reference.createReference(resource.resourceType, resource.id || "", display);
    }

    public static toString(reference: r4.Reference): string {
        if (reference.display) { return reference.display; }
        return reference.reference || "";
    }

    /**
     * Returns the resource type from a reference string.
     */
    public static getResourceFromReferenceString(reference: string): string {
        const parts = reference.split("/");
        if (parts.length === 2) { return parts[0]; }
        return "";
    }

    /**
     * Returns the resource id from a reference string.
     */
    public static getIdFromReferenceString(reference: string): string {
        const parts = reference.split("/");
        if (parts.length === 2) { return parts[1]; }
        return "";
    }

    /**
     * Return true if the given reference is a reference to the given resource
     * @param reference
     * @param resource
     */
    public static isReferenceToResource(reference: r4.Reference, resource: r4.Resource): boolean {
        const sReference = Reference.toString(reference);
        const rReference = Reference.toString(Reference.fromResource(resource));
        return sReference === rReference;
    }
}