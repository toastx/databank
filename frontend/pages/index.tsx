import Head from "next/head";
import LoginPage from "@/components/Login";
import { Stack } from "@chakra-ui/react";
import InventoryPage from "@/components/Inventory";
import React from "react";


export default function Home() {
  return (
    <>
      <Head>
        <title>Databank</title>
      </Head>
      <Stack bgColor={"cobaltBlue"} w="full" h="calc(100vh)" justify="center">
        <InventoryPage />
      </Stack>
    </>
  );
}
