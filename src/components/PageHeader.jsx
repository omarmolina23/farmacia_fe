import React from "react";
import { Separator } from "../components/ui/separator"
import { SidebarTrigger } from "../components/ui/sidebar"

const PageHeader = ({ title }) => {
  return (
    <header className="w-full bg-[#D0F25E] p-3 flex justify-between items-center">
      <div className="flex w-full items-center gap-1 lg:gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4 bg-black" />
        <h1 className="text-base font-bold">{title}</h1>
      </div>
    </header>
  );
};

export default PageHeader;
