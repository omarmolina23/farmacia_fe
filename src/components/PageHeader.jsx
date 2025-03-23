import React from "react";

const PageHeader = ({ title }) => {
  return (
    <div className="w-full bg-[#D0F25E] p-3 flex justify-between items-center">
      <h2 className="w-full text-lg md:text-xl text-left pl-4 font-semibold">{title}</h2>
    </div>
  );
};

export default PageHeader;
