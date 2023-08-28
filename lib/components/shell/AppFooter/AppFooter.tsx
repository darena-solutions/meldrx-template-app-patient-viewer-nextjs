import React, { useState } from 'react';
import { createStyles, Group, Footer, Text, Center, Anchor } from '@mantine/core';

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

interface AppFooterProps { }
export default function AppFooter(props: AppFooterProps): JSX.Element {
  const { classes, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <Footer height={70} p={8} style={{ zIndex: 101, background: "#002851", color: "white" }}>
        <Group position="left">
          <Center>
              <img src="/images/meldrx-logo.png" className="rounded-lg" style={{ maxHeight: "50px" }} />
              <Text style={{ display: "inline", paddingLeft: "10px" }}>Powered by&nbsp;
                  <Anchor href="https://meldrx.com" target="_blank" color="green">MeldRx</Anchor> | © 2023
              </Text>
          </Center>
        </Group>
    </Footer>
  );
}