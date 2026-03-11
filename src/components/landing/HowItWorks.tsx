import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AnimatedLink = () => (
    <div className="w-full h-24 flex items-center justify-center relative">
        <div className="w-full max-w-[140px] h-10 bg-muted/30 rounded-full border border-border/50 flex items-center px-3 gap-2 overflow-hidden shadow-sm">
            <div className="w-2 h-2 rounded-full bg-primary/40 flex-shrink-0" />
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                className="h-2 w-full bg-foreground/10 rounded-full relative"
            >
                <motion.div
                    animate={{ x: [0, 80] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute top-0 bottom-0 left-0 w-1 bg-primary/60"
                />
            </motion.div>
        </div>
        <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary/5 blur-2xl rounded-full"
        />
    </div>
);

const AnimatedCapture = () => (
    <div className="w-full h-24 flex items-center justify-center relative">
        <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 0.8, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 bg-primary rounded-sm"
                />
            </div>
            <motion.div
                animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 border-2 border-primary rounded-full"
            />
            <div className="absolute -top-4 -right-4 flex gap-1">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ height: [4, 12, 4] }}
                        transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
                        className="w-0.5 bg-primary/40 rounded-full"
                    />
                ))}
            </div>
        </div>
    </div>
);

const AnimatedAI = () => (
    <div className="w-full h-24 flex items-center justify-center relative">
        <div className="grid grid-cols-3 gap-2 relative">
            {[...Array(9)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        scale: [1, 1.5, 1],
                        backgroundColor: i === 4 ? ["rgba(var(--primary), 0.1)", "rgba(var(--primary), 1)", "rgba(var(--primary), 0.1)"] : "rgba(var(--foreground), 0.05)"
                    }}
                    transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                    className="w-2 h-2 rounded-full"
                />
            ))}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 border border-dashed border-primary/20 rounded-full"
            />
        </div>
    </div>
);

const AnimatedEmbed = () => (
    <div className="w-full h-24 flex items-center justify-center relative">
        <div className="w-20 h-16 bg-muted/20 border border-border rounded-lg relative overflow-hidden p-2">
            <div className="flex gap-1 mb-2">
                <div className="w-1 h-1 rounded-full bg-red-400" />
                <div className="w-1 h-1 rounded-full bg-amber-400" />
                <div className="w-1 h-1 rounded-full bg-emerald-400" />
            </div>
            <div className="space-y-1">
                <div className="w-full h-1 bg-foreground/10 rounded-full" />
                <div className="w-2/3 h-1 bg-foreground/10 rounded-full" />
            </div>
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: [40, -10, 40] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-0 bottom-0 flex justify-center"
            >
                <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm border border-primary/20 rounded-lg flex items-center justify-center shadow-lg shadow-primary/10">
                    <ArrowRight className="text-primary w-4 h-4 rotate-[-45deg]" />
                </div>
            </motion.div>
        </div>
    </div>
);

const steps = [
    { id: "01", title: "Generate", desc: "Launch your custom hub link.", visual: <AnimatedLink /> },
    { id: "02", title: "Record", desc: "Capture pure video magic.", visual: <AnimatedCapture /> },
    { id: "03", title: "Process", desc: "AI synthesizes every word.", visual: <AnimatedAI /> },
    { id: "04", title: "Deploy", desc: "Go live with a single snippet.", visual: <AnimatedEmbed /> },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">

                {/* Minimal Header */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-8"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">Workflow</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-4"
                    >
                        How <span className="text-primary italic font-medium">Vouchy</span> Works.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-muted-foreground text-lg font-medium"
                    >
                        Engineered for simplicity. Optimized for conversion.
                    </motion.p>
                </div>

                {/* 4-Column Minimal Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className="relative group h-full"
                        >
                            <div className="bg-card/40 border border-border/50 rounded-[40px] p-10 flex flex-col items-center text-center h-full transition-all duration-500 hover:bg-card hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden">

                                {/* Visual Area */}
                                <div className="mb-10 w-full">
                                    {step.visual}
                                </div>

                                {/* Content */}
                                <div className="space-y-3 relative z-10">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <span className="text-[10px] font-black text-primary/40 tracking-widest uppercase">sys_{step.id}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-foreground tracking-tight">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-[200px] mx-auto opacity-70">
                                        {step.desc}
                                    </p>
                                </div>

                                {/* Background Decor */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                            </div>

                            {/* Connecting Line (Desktop) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-[50%] right-[-10px] w-5 h-px bg-border/20 z-0" />
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Final CTA Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 pt-12 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 hover:opacity-100 transition-opacity"
                >
                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-4 border-background bg-muted overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-foreground">Join 400+ brands building trust.</p>
                    </div>
                    <button className="h-14 px-8 bg-foreground text-background rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-transform hover:scale-105 active:scale-95 flex items-center gap-3">
                        Start Collecting <ArrowRight size={14} />
                    </button>
                </motion.div>

            </div>
        </section>
    );
}
