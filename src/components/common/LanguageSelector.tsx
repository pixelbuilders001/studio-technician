"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Globe className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => setLanguage("en")}
                    disabled={language === "en"}
                >
                    English
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage("hi")}
                    disabled={language === "hi"}
                >
                    हिंदी (Hindi)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
