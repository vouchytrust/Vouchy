import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TbPlayerPlayFilled, TbHeartFilled, TbStarFilled } from "react-icons/tb";

const ProductShowcase = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section className="relative py-12 lg:py-16 px-6 overflow-hidden bg-background border-y border-border min-h-screen flex flex-col justify-center" ref={containerRef}>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Minimal Copy */}
          <div className="max-w-md">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" as const }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-4 text-foreground leading-[1.1]"
            >
              Stop chasing <br />
              <span className="text-primary font-medium">reviews.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base text-muted-foreground leading-relaxed font-medium max-w-xs"
            >
              Send a link, and Vouchy takes care of the rest — reminders, collection, and display, all handled for you.
            </motion.p>
          </div>

          {/* Right: Storytelling Visual */}
          <div className="relative h-[360px] flex items-center justify-center">

            {/* The Dashboard Card */}
            <motion.div
              style={{ y }}
              className="relative w-full max-w-[400px] rounded-2xl group/card bg-card/40 border border-border/50 backdrop-blur-sm shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="border-b border-primary/10 p-4 flex items-center justify-between bg-card/10 backdrop-blur-sm relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  AUTOPILOT ON
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-8 relative z-10">

                {/* Trust Score Gauge */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Trust Score</p>
                    <motion.h3
                      className="text-3xl font-black text-foreground"
                    >
                      100
                      <span className="text-sm font-bold text-muted-foreground ml-1">/ 100</span>
                    </motion.h3>
                  </div>
                  {/* Radial Graph */}
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="32" cy="32" r="28" className="stroke-muted" strokeWidth="6" fill="none" />
                      <motion.circle
                        cx="32" cy="32" r="28"
                        className="stroke-primary"
                        strokeWidth="6" fill="none"
                        strokeDasharray="175"
                        strokeDashoffset="175"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 175 }}
                        whileInView={{ strokeDashoffset: 0 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <TbHeartFilled className="w-5 h-5 text-destructive animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity List */}
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 ml-1">Live Activity</p>
                  <div className="space-y-3">
                    {[
                      { name: "Sarah J.", action: "New Video Review", icon: TbPlayerPlayFilled, color: "bg-blue-500", delay: 0.5 },
                      { name: "Mike T.", action: "5 Star Rating", icon: TbHeartFilled, color: "bg-destructive", delay: 1.2 },
                      { name: "Emily R.", action: "New Testimonial", icon: TbStarFilled, color: "bg-yellow-500", delay: 1.9 },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40 border border-border"
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: item.delay, duration: 0.5 }}
                      >
                        <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white shadow-sm ring-2 ring-background/10`}>
                          <item.icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{item.action}</p>
                          <p className="text-[10px] text-muted-foreground truncate">Just now • {item.name}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <motion.div
                className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Precision Corners - Perfectly aligned with brand radius and placed LAST to be on top */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t-[1.5px] border-l-[1.5px] border-primary/40 rounded-tl-2xl z-50 pointer-events-none group-hover/card:border-primary transition-all duration-500" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-[1.5px] border-r-[1.5px] border-primary/40 rounded-tr-2xl z-50 pointer-events-none group-hover/card:border-primary transition-all duration-500" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[1.5px] border-l-[1.5px] border-primary/40 rounded-bl-2xl z-50 pointer-events-none group-hover/card:border-primary transition-all duration-500" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[1.5px] border-r-[1.5px] border-primary/40 rounded-br-2xl z-50 pointer-events-none group-hover/card:border-primary transition-all duration-500" />

            </motion.div>

            {/* Floating Elements removed per request */}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
