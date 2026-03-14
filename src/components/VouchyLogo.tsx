import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface VouchyLogoProps {
  variant?: "header" | "icon" | "minimal";
  className?: string;
  link?: boolean;
}

export function VouchyLogo({ variant = "header", className = "", link = true }: VouchyLogoProps) {
  const content = (
    <div className={cn("flex items-center gap-2 md:gap-2.5 shrink-0 group", className)}>
      {variant === "header" && (
        <>
          <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/25 overflow-hidden transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_16px_rgba(10,169,57,0.3)]">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src="/logo-icon.svg"
              alt=""
              className="h-4.5 w-4.5 md:h-[20px] md:w-[20px] relative z-10 transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <span className="text-[14px] md:text-[15px] font-black tracking-[-0.03em] text-foreground group-hover:text-primary transition-colors duration-300">
            Vouch<span className="text-primary">y</span>
          </span>
        </>
      )}
      
      {variant === "icon" && (
        <img 
          src="/logo-icon.svg" 
          alt="Vouchy" 
          className="h-7 w-7 md:h-8 md:w-8 object-contain transition-transform duration-300 group-hover:scale-110" 
        />
      )}

      {variant === "minimal" && (
        <>
          <img src="/logo-icon.svg" alt="" className="h-4 w-4 md:h-5 md:w-5 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="text-[13px] md:text-[14px] font-black tracking-[-0.03em] text-foreground/80 group-hover:text-foreground transition-all duration-300">
            Vouch<span className="text-primary">y</span>
          </span>
        </>
      )}
    </div>
  );

  if (link) {
    return (
      <Link to="/" className="inline-block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
