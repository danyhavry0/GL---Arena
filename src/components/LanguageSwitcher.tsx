"use client";

import { useTranslation } from "@/contexts/LocaleContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { GB, IT } from "country-flag-icons/react/3x2";

const flagClass = "h-4 w-6 rounded-sm object-cover shrink-0";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 flex items-center" aria-label="Change language">
          <Languages className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline-flex flex-row items-center gap-1.5">
            {locale === "en" ? (
              <>
                <GB className={`${flagClass} shrink-0`} title="English" />
                <span>EN</span>
              </>
            ) : (
              <>
                <IT className={`${flagClass} shrink-0`} title="Italiano" />
                <span>IT</span>
              </>
            )}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLocale("en")}
          className={locale === "en" ? "bg-accent" : ""}
        >
          <span className="inline-flex flex-row items-center gap-2">
            <GB className={flagClass} title="English" />
            <span>English</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale("it")}
          className={locale === "it" ? "bg-accent" : ""}
        >
          <span className="inline-flex flex-row items-center gap-2">
            <IT className={flagClass} title="Italiano" />
            <span>Italiano</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
