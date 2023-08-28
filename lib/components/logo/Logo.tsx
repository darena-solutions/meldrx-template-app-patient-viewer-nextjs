import React from 'react';
import Image from 'next/image';
import { Center, Text } from "@mantine/core";

export default function Logo(props: any) {
    return (
        <Center style={{ display: "flex" }}>
            <img src="/images/darena-logo.png" className="rounded-lg" style={{ maxHeight: "50px" }} />
            <Text weight={500} style={{ paddingLeft: "10px" }} size="lg">Patient Sphere</Text>
        </Center>
    );
}
