/*
A styled select drop down. Note that unlike some other form components in this dir
this is not in any way tailored to work well with Formik. Should harmonize that at
some point.
*/

import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../common/functions";

type SelectOption = {
  id: string | number;
  value: any;
  name: string;
};

type SelectProps = {
  options: SelectOption[];
  placeholderText?: string;
  defaultValue?: SelectOption;
  onChange: (selected: SelectOption) => void;
  label?: string;
  selectClassName?: string;
};

export default function Select(props: SelectProps) {
  const [selectedOption, setSelectedOption] = useState<
    SelectOption | undefined
  >(props.defaultValue);

  const handleChange = (option: SelectOption) => {
    setSelectedOption(option);
    props.onChange(option);
  };

  return (
    <Listbox value={selectedOption} onChange={handleChange}>
      {({ open }) => (
        <>
          {props.label && (
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
              {props.label}
            </Listbox.Label>
          )}
          <div className={`relative mt-2 ${props.selectClassName}`}>
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="block truncate">
                {selectedOption?.name ||
                  props.placeholderText ||
                  "Please select"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {props.options.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9",
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate",
                          )}
                        >
                          {option.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4",
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
