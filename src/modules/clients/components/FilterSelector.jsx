import { MinusIcon } from "lucide-react";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";

export default function FilterSelector({
  title,
  options: optionsProp,
  type = "checkbox",
  onChange = () => {},
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(
      optionsProp.map((option) => ({
        ...option,
        checked: option.checked !== undefined ? option.checked : false,
      }))
    );
  }, [optionsProp]);

  function handleChange(e) {
    const { value, checked } = e.target;

    const updatedOptions = options.map((opt, i) => {
      if (i !== parseInt(value)) {
        return {
          ...opt,
          checked: type === "radio" ? false : opt.checked,
        };
      }

      return {
        ...opt,
        checked,
      };
    });

    onChange(updatedOptions);
    setOptions(updatedOptions);
  }
  return (
    <fieldset>
      <legend
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between cursor-pointer select-none"
      >
        {title}
        {open ? <MinusIcon /> : <PlusIcon />}
      </legend>

      <div className="h-[1px] bg-black"></div>

      {open && (
        <div className="mt-2 p-2 bg-[#D9D9D9] rounded">
          {options.map((opt, i) => {
            return (
              <div className="flex justify-between" key={i}>
                <label htmlFor={opt.label}>{opt.label}</label>
                <input
                  type={type}
                  id={opt.label}
                  name={type === "checkbox" ? opt.label : title}
                  value={i}
                  onChange={handleChange}
                  checked={options[i].checked}
                />
              </div>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
