"use client";

import * as React from "react";
import { X } from "lucide-react";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { TextHighlighter } from "./text-highlighter";
import { Checkbox } from "./ui/checkbox";
import { Skeleton } from "./ui/skeleton";

export interface Option {
  value: string;
  label: string;
  image?: string;
  description?: string;
}

export type OptionList = Option[];

interface AsyncMultiSelectProps {
  value?: OptionList;
  onSearch: (value: string) => Promise<OptionList>;
  onChange?: (options: OptionList) => void;
}

export interface AsyncMultiSelectRef {
  selectedValue: OptionList;
  input: HTMLInputElement;
}

const AsyncMultiSelect = React.forwardRef<
  AsyncMultiSelectRef,
  AsyncMultiSelectProps
>(
  (
    { value, onChange, onSearch }: AsyncMultiSelectProps,
    ref: React.Ref<AsyncMultiSelectRef>,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [selected, setSelected] = React.useState<OptionList>(value || []);
    const [options, setOptions] = React.useState<OptionList>([]);
    const [search, setSearch] = React.useState("");

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current as HTMLInputElement,
      }),
      [selected],
    );

    const handleUnselect = React.useCallback(
      (option: Option) => {
        const optionIndex = selected.findIndex((s) => s.value === option.value);
        if (optionIndex !== -1) {
          const newSelected = [
            ...selected.slice(0, optionIndex),
            ...selected.slice(optionIndex + 1),
          ];
          setSelected(newSelected);
          onChange?.(newSelected);
        }
      },
      [selected, onChange],
    );

    const handleSelect = React.useCallback(
      (option: Option) => {
        // setSearch(""); // May be useful to clear the search input after selecting an option
        const newSelected = [...selected, option];
        setSelected(newSelected);
        onChange?.(newSelected);
      },
      [selected, onChange],
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;

        if (!input) return;

        switch (e.key) {
          case "Delete":
          case "Backspace":
            if (input.value !== "") return;

            if (selected.length > 0) {
              handleUnselect(selected[selected.length - 1]);
            }
            break;
          case "Escape":
            input.blur();
            break;
          case "Tab":
            if (options.length > 0) {
              e.preventDefault();

              const hasFocusValue = document
                .querySelector("[aria-selected]")
                ?.getAttribute("data-value");

              if (!hasFocusValue) return;

              const focusedOption = options.find(
                (o) => o.value === hasFocusValue,
              );

              if (!focusedOption) return;

              const optionSelected = isSelected(focusedOption.value);

              if (optionSelected) {
                handleUnselect(focusedOption);
              } else {
                handleSelect(focusedOption);
              }
            }
            break;
          default:
            break;
        }
      },
      [selected, options],
    );

    const isSelected = (value: Option["value"]) => {
      return selected.findIndex((s) => s.value === value) !== -1;
    };

    useEffect(() => {
      const updateSelectedValueWhenValueChanged = () => {
        if (value) {
          setSelected(value);
        }
      };

      updateSelectedValueWhenValueChanged();
    }, [value]);

    useEffect(() => {
      const doSearch = async () => {
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 500)); // Simulate a delay
        const res = await onSearch(search);
        setOptions(res);
        setIsLoading(false);
      };

      const handleSearch = async () => {
        if (open) {
          await doSearch();
        }
      };

      void handleSearch();
    }, [search, open, onSearch]);

    const EmptyItem = React.useCallback(() => {
      if (isLoading) return null;

      const emptyIndicator = (
        <p className="w-full text-center text-muted">No options available</p>
      );

      if (options.length === 0) {
        return <CommandItem value="-">{emptyIndicator}</CommandItem>;
      }

      return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
    }, [options, isLoading]);

    return (
      <Command
        onKeyDown={handleKeyDown}
        shouldFilter={false}
        className={"overflow-visible bg-transparent"}>
        <div
          className={
            "group rounded border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          }>
          <div className="flex flex-wrap min-h-[42px]">
            {selected.length > 0 && (
              <div className="p-1 flex flex-wrap gap-1">
                {selected.map((option) => {
                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "inline-flex items-center rounded border bg-gray-100 px-2 py-1 gap-1",
                      )}>
                      <span className="px-1">{option.label}</span>
                      <button
                        className={"outline-none rounded p-1 bg-muted"}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUnselect(option);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={() => handleUnselect(option)}>
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <CommandPrimitive.Input
              ref={inputRef}
              value={search}
              onValueChange={setSearch}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              className={
                "px-2 py-1 flex-1 bg-transparent outline-none placeholder:text-muted"
              }
              placeholder="Search..."
            />
          </div>
        </div>
        <div className="relative mt-2">
          {open && (
            <CommandList className="absolute top-0 z-10 w-full rounded border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              {isLoading ? (
                <div className="divide-y">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div className="p-2 flex gap-2 items-center" key={i}>
                      <Skeleton className="w-4 h-4 rounded-sm" />
                      <Skeleton className="w-10 h-10 rounded" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-[160px]" />
                        <Skeleton className="h-4 w-[80px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {EmptyItem()}
                  {options.length > 0 ? (
                    <CommandGroup className="h-full overflow-auto">
                      {options.map((option) => {
                        const optionSelected = isSelected(option.value);

                        return (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onSelect={() => {
                              if (optionSelected) {
                                handleUnselect(option);
                              } else {
                                handleSelect(option);
                              }
                            }}
                            className={"cursor-pointer"}>
                            <div className="flex items-center gap-2">
                              <Checkbox checked={optionSelected} />
                              {option.image && (
                                <img
                                  src={option.image}
                                  alt={option.label}
                                  className="w-10 h-10 rounded"
                                />
                              )}
                              <div>
                                <p>
                                  <TextHighlighter
                                    text={option.label}
                                    searchText={search}
                                  />
                                </p>
                                {option.description && (
                                  <p className="text-sm text-muted">
                                    {option.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  ) : null}
                </>
              )}
            </CommandList>
          )}
        </div>
      </Command>
    );
  },
);

AsyncMultiSelect.displayName = "AsyncMultiSelect";

export { AsyncMultiSelect };
