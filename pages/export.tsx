import type { ReactNode } from "react"
import Head from "next/head"
import { ActionBar, SidebarLayout } from "@/layout"

export default function Export() {
  return (
    <>
      <Head>
        <title>Export Contacts | Address Book</title>
        <meta name="description" content="Export your contacts to vCards." />
      </Head>

      <ActionBar title="Export Contacts" />
    </>
  )
}

Export.getLayout = function getLayout(page: ReactNode) {
  return <SidebarLayout>{page}</SidebarLayout>
}
