import { MinusIcon } from "lucide-react";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";

export default function FilterSelector({
  title,
  options: optionsProp,
  onChange = () => {},
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (options.length === 0) {
      setOptions(optionsProp.map((option) => ({ ...option, checked: false })));
    }
  }, [optionsProp]);

  function handleChange(e) {
    const { value, checked } = e.target;

    const updatedOptions = options.map((opt, i) => {
      if (i !== parseInt(value)) {
        return opt;
      }

      return {
        ...opt,
        checked,
      };
    });

    onChange(updatedOptions, title);
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
                  type="checkbox"
                  id={opt.label}
                  name={opt.label}
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
