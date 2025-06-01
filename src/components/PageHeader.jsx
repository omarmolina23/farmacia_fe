import React from "react";
import { Separator } from "../components/ui/separator"
import { SidebarTrigger } from "../components/ui/sidebar"

const PageHeader = ({ title, rightButton = null }) => {
  return (
    <header className="bg-[#D0F25E] p-3 flex justify-between items-center">
      <div className="flex items-center gap-1 lg:gap-2 flex-1">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4 bg-black" />
        <h1 className="text-base font-bold">{title}</h1>
      </div>

      {rightButton && (
        <div className="flex items-center ml-auto">
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4 bg-black" />
          {rightButton}
        </div>
      )}
    </header>

  );
};

export default PageHeader;


