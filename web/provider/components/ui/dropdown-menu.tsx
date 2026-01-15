import * as React from "react"
import { cn } from "@/lib/utils"

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <div className="relative inline-block text-left" onMouseLeave={() => setOpen(false)}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    // @ts-ignore
                    return React.cloneElement(child, { open, setOpen });
                }
                return child;
            })}
        </div>
    );
};

export const DropdownMenuTrigger = ({ children, asChild, open, setOpen }: any) => {
    return (
        <div onClick={() => setOpen(!open)} className="cursor-pointer">
            {children}
        </div>
    );
}

export const DropdownMenuContent = ({ children, align = "center", open }: any) => {
    if (!open) return null;
    return (
        <div className={cn(
            "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
            align === "end" ? "right-0" : "left-0",
            "mt-2"
        )}>
            {children}
        </div>
    );
}

export const DropdownMenuItem = ({ children, className }: any) => {
    return (
        <div className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}>
            {children}
        </div>
    );
}
