"use client";

import { RxTriangleDown } from "react-icons/rx";
import { useEffect, useMemo, useRef, useState } from "react";

const MultiSelectDropdown = ({ values, setter, options, placeholder }) => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggle = (item) => {
    if (values.includes(item)) {
      setter(values.filter((val) => val != item));
    } else {
      setter([...values, item]);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredOptions = useMemo(() => {
    return options?.filter((i) =>
      i?.toLowerCase().includes(search?.toLowerCase())
    );
  }, [options, search]);

  return (
    <div className="relative inline-flex flex-col" ref={dropdownRef}>
      <div
        className="relative cursor-pointer flex items-center bg-gradient-to-b from-black/0 to-black/20 p-[10px] w-full rounded-[10px] border border-gray-300"
        role="button"
        onClick={() => {
          setIsOpen((p) => !p);
          setSearch("");
        }}
      >
        <span className="text-sm leading-0">{placeholder}</span>
        <RxTriangleDown
          className={`${isOpen ? "rotate-180" : "rotate-0"} transition-transform duration-300 ml-3 leading-0`}
        />
      </div>
      {isOpen && (
        <div className="absolute top-full z-100 min-w-28">
          <div className="mt-[2px] overflow-y-auto bg-white border shadow-sm border-black/20 max-h-40 rounded-lg">
            <input
              type="search"
              className="text-xs bg-white outline-none border border-black/15 w-fit m-1 p-1 rounded-md"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {filteredOptions?.map((item, i) => {
              return (
                <p
                  key={i}
                  className={`w-full py-1 whitespace-nowrap px-2 last:rounded-b-lg first:rounded-t-lg cursor-pointer text-xs hover:bg-black/15 ${values.includes(item) ? "bg-[#E9F5F0]" : "bg-white"}`}
                  onClick={() => toggle(item)}
                >
                  {item?.charAt(0)?.toUpperCase() + item?.slice(1)}
                </p>
              );
            })}

            {filteredOptions?.length === 0 && (
              <p className="text-xs text-black/70 p-2">
                No matching search found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
