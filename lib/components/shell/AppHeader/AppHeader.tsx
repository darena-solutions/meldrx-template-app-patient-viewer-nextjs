import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { createStyles, Loader, Group, Header, Menu, Stack, Text, UnstyledButton, Center } from '@mantine/core';
import { IconChevronDown, IconUser } from '@tabler/icons-react';
import { AppContext } from '@/lib/hooks/AppContext/AppContext';
import Logo from '@/lib/components/logo/Logo';
import { formatName, getOfficialNameForPatient } from '@/lib/utils/fhir-utils';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const isTestMode = baseUrl.indexOf("localhost") > -1;

const useStyles = createStyles((theme) => ({
  logoButton: {
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background as string,
        0.8
      ),
    },
  },

  user: {
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background as string,
        0.8
      ),
    },
  },

  userName: {
    fontWeight: 500,
    lineHeight: 1,
    marginRight: 3,

    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  userActive: {
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background as string,
      0.8
    ),
  },
}));

interface AppHeaderProps {
    navbarToggle: () => void;
}

export default function AppHeader({ navbarToggle }: AppHeaderProps): JSX.Element {
    const { classes, cx } = useStyles();
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const appContext = useContext(AppContext);

    const patientName = (appContext.patient)
      ? getOfficialNameForPatient(appContext.patient)
      : null;
    const patientNameDisplay = (patientName) ? formatName(patientName) : "Unknown";

    return (
    <Header height={80} p={8} style={{ zIndex: 101 }}>
      <Group position="apart">
        <Group spacing="xs">
          <UnstyledButton className={classes.logoButton} onClick={navbarToggle}>
            <Logo />
          </UnstyledButton>
        </Group>

        <Menu
          width={260}
          shadow="xl"
          position="bottom-end"
          transitionProps={{ transition: 'pop-top-right' }}
          opened={userMenuOpened}
          onClose={() => setUserMenuOpened(false)}
        >
          <Menu.Target>
            <UnstyledButton
              className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
              onClick={() => setUserMenuOpened((o) => !o)}
            >
              <Group spacing={7}>
                <Text size="sm" className={classes.userName}>
                  {patientNameDisplay}
                </Text>
                <IconChevronDown size={12} stroke={1.5} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Stack align="center" p="xl">
                <IconUser />
                {patientNameDisplay}
                <Text color="dimmed" size="xs" style={{ textAlign: "center" }}>{appContext.patientFhirId}</Text>
                {isLoading && <Loader size={24} color="blue" />}
            </Stack>

            {isTestMode && <Text size="xs" color="red" align="center">TEST MODE</Text>}
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Header>
  );
}