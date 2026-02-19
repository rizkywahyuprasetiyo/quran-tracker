import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import * as Popover from "@radix-ui/react-popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "cmdk"
import { SURAH_DATA } from "../data/surahData"

interface SurahSelectProps {
  value: number
  onChange: (value: number) => void
}

export function SurahSelect({ value, onChange }: SurahSelectProps) {
  const [open, setOpen] = React.useState(false)
  
  const selectedSurah = SURAH_DATA.find(s => s[0] === value)

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white hover:bg-gray-50 transition-colors"
          aria-expanded={open}
        >
          <span className="truncate">
            {selectedSurah 
              ? `${selectedSurah[0]}. ${selectedSurah[1]} (${selectedSurah[2]} ayat)`
              : "Pilih Surah..."
            }
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content
          className="w-[--radix-popover-trigger-width] p-0 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[300px] overflow-hidden z-50"
          align="start"
          sideOffset={4}
        >
          <Command className="overflow-hidden">
            <div className="flex items-center border-b border-gray-100 px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Cari surah..."
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            
            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              Surah tidak ditemukan.
            </CommandEmpty>
            
            <CommandGroup className="overflow-auto max-h-[250px] p-1">
              {SURAH_DATA.map((surah) => (
                <CommandItem
                  key={surah[0]}
                  value={`${surah[1]} ${surah[0]}`}
                  onSelect={() => {
                    onChange(surah[0])
                    setOpen(false)
                  }}
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-gray-100 data-[selected=true]:bg-gray-100"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === surah[0] ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span className="flex-1">
                    {surah[0]}. {surah[1]}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {surah[2]} ayat
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}