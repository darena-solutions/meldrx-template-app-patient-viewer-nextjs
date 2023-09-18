// Constructs the FHIR URL from the given Workspace ID
export function getWorkspaceFhirUrl(authorityUrl: string, workspaceId: string): string {
    return `${authorityUrl}/api/meldrxfhir/${workspaceId}`;
}