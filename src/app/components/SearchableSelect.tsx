import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "./ui/utils";

export type SearchableSelectItem = {
  id: number;
  name: string;
};

type SearchableSelectProps = {
  id?: string;
  options?: readonly string[];
  items?: readonly SearchableSelectItem[];
  value: string;
  onValueChange: (value: string) => void;
  onItemChange?: (value: number) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export function SearchableSelect({
  id,
  options = [],
  items,
  value,
  onValueChange,
  onItemChange,
  placeholder = "Выберите значение",
  searchPlaceholder = "Поиск...",
  emptyText = "Ничего не найдено",
  required,
  disabled,
  loading,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const displayPlaceholder = loading ? "Загрузка..." : placeholder;
  const selectedItem = items?.find((item) => String(item.id) === value);
  const displayValue = selectedItem?.name ?? (items ? "" : value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-required={required}
          disabled={disabled || loading}
          className={cn(
            "w-full justify-between font-normal h-9 transition-colors",
            "hover:border-ring/50",
            !displayValue && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">{displayValue || displayPlaceholder}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0 z-[100]",
          "opacity-100 data-[state=open]:animate-none data-[state=closed]:animate-none",
        )}
        align="start"
        side="bottom"
        sideOffset={4}
        collisionPadding={8}
      >
        <Command shouldFilter>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList className="max-h-[240px]">
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items
                ? items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.name} ${item.id}`}
                      keywords={[item.name, String(item.id)]}
                      onSelect={() => {
                        onValueChange(String(item.id));
                        onItemChange?.(item.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          value === String(item.id) ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {item.name}
                    </CommandItem>
                  ))
                : options.map((option) => (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={() => {
                        onValueChange(option);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          value === option ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {option}
                    </CommandItem>
                  ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
