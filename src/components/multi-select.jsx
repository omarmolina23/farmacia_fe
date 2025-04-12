import React, { useState, forwardRef } from "react";
import { cva } from "class-variance-authority";
import { CheckIcon, XCircle, ChevronDown, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";

const multiSelectVariants = cva("m-1", {
    variants: {
        variant: {
            default:
                "border-foreground/10 text-foreground bg-card hover:bg-card/80",
            secondary:
                "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
            destructive:
                "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
            inverted: "inverted",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export const MultiSelect = forwardRef(
    (
        {
            options,
            onValueChange,
            variant,
            defaultValue = [],
            placeholder = "Select options",
            modalPopover = false,
            asChild = false,
            className,
            ...props
        },
        ref
    ) => {
        const [selectedValues, setSelectedValues] = useState(defaultValue);
        const [isPopoverOpen, setIsPopoverOpen] = useState(false);

        const handleInputKeyDown = (event) => {
            if (event.key === "Enter") {
                setIsPopoverOpen(true);
            } else if (event.key === "Backspace" && !event.currentTarget.value) {
                const newSelectedValues = [...selectedValues];
                newSelectedValues.pop();
                setSelectedValues(newSelectedValues);
                onValueChange(newSelectedValues);
            }
        };

        const toggleOption = (option) => {
            const newSelectedValues = selectedValues.includes(option)
                ? selectedValues.filter((value) => value !== option)
                : [...selectedValues, option];
            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
        };

        const handleClear = () => {
            setSelectedValues([]);
            onValueChange([]);
        };

        const handleTogglePopover = () => {
            setIsPopoverOpen((prev) => !prev);
        };

        const clearExtraOptions = () => {
            const newSelectedValues = selectedValues.slice(0, 1);
            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
        };

        const toggleAll = () => {
            if (selectedValues.length === options.length) {
                handleClear();
            } else {
                const allValues = options.map((option) => option.value);
                setSelectedValues(allValues);
                onValueChange(allValues);
            }
        };

        return (
            <Popover
                open={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
                modal={modalPopover}
            >
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        {...props}
                        onClick={handleTogglePopover}
                        className={cn(
                            "flex w-full p-2 sm:p-1 rounded-md border min-h-[40px] sm:min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto min-w-[220px]",
                            className
                        )}
                    >
                        {selectedValues.length > 0 ? (
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-2 max-w-[calc(100%-40px)] overflow-hidden whitespace-nowrap">
                                    {selectedValues.slice(0, 1).map((value) => {
                                        const option = options.find((o) => o.value === value);
                                        const IconComponent = option?.icon;
                                        return (
                                            <Badge
                                                key={value}
                                                className={multiSelectVariants({ variant })}
                                            >
                                                {IconComponent && (
                                                    <IconComponent className="h-4 w-4 mr-1" />
                                                )}
                                                {option?.label}
                                            </Badge>
                                        );
                                    })}
                                    {selectedValues.length > 1 && (
                                        <Badge
                                            className={cn(
                                                "bg-muted text-muted-foreground border border-dashed hover:bg-muted/80",
                                                multiSelectVariants({ variant }),
                                                "sm:inline-flex"
                                            )}
                                        >
                                            +{selectedValues.length - 1}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center justify-end space-x-1">
                                    <XIcon
                                        className="h-4 cursor-pointer text-muted-foreground"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClear();
                                        }}
                                    />
                                    <Separator orientation="vertical" className="h-4" />
                                    <ChevronDown className="h-4 cursor-pointer text-muted-foreground" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between w-full mx-auto">
                                <span className="text-sm text-muted-foreground mx-3">
                                    {placeholder}
                                </span>
                                <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
                            </div>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-full sm:w-auto p-0"
                    align="start"
                    onEscapeKeyDown={() => setIsPopoverOpen(false)}
                >
                    <Command>
                        <CommandInput
                            placeholder="Buscar..."
                            onKeyDown={handleInputKeyDown}
                        />
                        <CommandList>
                            <CommandEmpty>Categoría no encontrada.</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    key="all"
                                    onSelect={toggleAll}
                                    className="cursor-pointer"
                                >
                                    <div
                                        className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            selectedValues.length === options.length
                                                ? "bg-primary text-primary-foreground"
                                                : "opacity-50 [&_svg]:invisible"
                                        )}
                                    >
                                        <CheckIcon className="h-4 w-4" />
                                    </div>
                                    <span>Todas</span>
                                </CommandItem>
                                {options.map((option) => {
                                    const isSelected = selectedValues.includes(option.value);
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() => toggleOption(option.value)}
                                            className="cursor-pointer"
                                        >
                                            <div
                                                className={cn(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground"
                                                        : "opacity-50 [&_svg]:invisible"
                                                )}
                                            >
                                                <CheckIcon className="h-4 w-4" />
                                            </div>
                                            {option.icon && (
                                                <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span>{option.label}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup>
                                <div className="flex items-center justify-between">
                                    {selectedValues.length > 0 && (
                                        <>
                                            <CommandItem
                                                onSelect={handleClear}
                                                className="flex-1 justify-center cursor-pointer"
                                            >
                                                Limpiar
                                            </CommandItem>
                                            <Separator
                                                orientation="vertical"
                                                className="flex min-h-6 h-full"
                                            />
                                        </>
                                    )}
                                    <CommandItem
                                        onSelect={() => setIsPopoverOpen(false)}
                                        className="flex-1 justify-center cursor-pointer max-w-full"
                                    >
                                        Cerrar
                                    </CommandItem>
                                </div>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    }
);

MultiSelect.displayName = "MultiSelect";
