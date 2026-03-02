import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function FirstTimeGuide({ companyName }: { companyName?: string }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="relative rounded-xl border border-primary/20 bg-primary/[0.04] p-6 mb-8"
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl vouchy-gradient-bg flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold text-foreground mb-1">
              Welcome{companyName ? `, ${companyName}` : ""}! Let's get your first testimonials.
            </h3>
            <p className="text-[13px] text-muted-foreground mb-4">
              Create a collection space — it's a branded page where your customers can leave text or video testimonials. Share the link and start collecting social proof.
            </p>
            <Button size="sm" className="h-8 text-xs gap-1.5" asChild>
              <Link to="/dashboard/spaces">
                Create your first space <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
