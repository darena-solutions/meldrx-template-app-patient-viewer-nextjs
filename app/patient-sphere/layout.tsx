"use client";
import '@/app/globals.css';
import '@/app/styles/App.scss';
import React, { useState } from "react";
import { useMediaQuery } from '@mantine/hooks';
import { MantineProvider, AppShell, useMantineTheme, createEmotionCache } from "@mantine/core";
import AppHeader from "@/lib/components/shell/AppHeader/AppHeader";
import AppNavbar from "@/lib/components/shell/AppNavbar/AppNavbar";
import AppFooter from "@/lib/components/shell/AppFooter/AppFooter";

const meldRxColorScheme: any = { 'meldrx': ["#00926c", "#00926c", "#00926c", "#00926c", "#00926c", "#00926c", "#00926c", "#00926c", "#00926c", "#00926c"] };

export default function App({ children }: { children: React.ReactNode }) {
    const minWidth = useMediaQuery('(min-width: 600px)');
    const theme = useMantineTheme();
    const [navbarOpen, setNavbarOpen] = useState<boolean>(!minWidth);
    const isRootPage = false;

    function closeNavbar(): void { setNavbarOpen(false); }
    function toggleNavbar(): void { setNavbarOpen(!navbarOpen); }

    const myCache = createEmotionCache({ key: 'mantine', prepend: false });

    // You can also set primaryColor = "meldrx"
    return (
        <MantineProvider emotionCache={myCache} theme={{ colorScheme: "light", primaryColor: "meldrx", colors: meldRxColorScheme }}>
            <AppShell
                styles={{ main: { background: theme.colors.white, } }}
                padding={0}
                fixed={true}
                navbar={(!isRootPage && navbarOpen && <AppNavbar closeNavbar={closeNavbar} />) as React.ReactElement | undefined}
                header={(!isRootPage && <AppHeader navbarToggle={toggleNavbar} />) as React.ReactElement | undefined}
                footer={<AppFooter />}
            >
                {/*<Notifications />*/}
                {children}
            </AppShell>
        </MantineProvider>
    );
}