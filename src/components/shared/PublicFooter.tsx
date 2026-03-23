import { Link } from "react-router-dom";

export function PublicFooter({ theme = "light" }: { theme?: "light" | "dark" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "text-white/40" : "text-slate-400";
  
  return (
    <div className={`w-full mt-24 pb-12 pt-12 border-t border-border/10 flex flex-row flex-wrap items-center justify-center gap-4 relative z-10 ${textColor}`}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.2em]">
        <span>Powered by</span>
        <a href="/" target="_blank" rel="noreferrer" className="font-black">
          Vouchy
        </a>
      </div>
      
      <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-white/20' : 'bg-slate-300'}`} />
      
      <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-[0.2em]">
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
      </div>
    </div>
  );
}
