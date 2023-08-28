import IMeldRxLaunchData from "./IMeldRxLaunchData";

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL ?? "";
const MELDRX_AUTH_URL = process.env.NEXT_PUBLIC_MELDRX_AUTH_URL ?? "";
const MELDRX_CLIENT_ID = process.env.NEXT_PUBLIC_MELDRX_CLIENT_ID ?? "";
const MELDRX_WORKSPACE_ID = process.env.NEXT_PUBLIC_MELDRX_WORKSPACE_ID ?? "";

// Configure all the different workspaces you want to launch...
export const launchOptions: IMeldRxLaunchData[] = [
    {
        clientId: MELDRX_CLIENT_ID,
        workspaceId: MELDRX_WORKSPACE_ID,
        scope: "openid profile patient/*.read launch launch/patient",
        authorityUrl: MELDRX_AUTH_URL,
        redirectUrl: `${APP_BASE_URL}/login-callback`,
    },
];