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
    <section className="relative py-24 lg:py-32 px-6 overflow-hidden bg-background border-y border-border" ref={containerRef}>
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Minimal Copy */}
          <div className="max-w-md">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-foreground"
            >
              Build trust <br />
              <span className="text-primary">on autopilot.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground leading-relaxed font-medium"
            >
              Forget chasing clients for reviews. Vouchy automates the entire process so you can focus on building.
            </motion.p>
          </div>

          {/* Right: Storytelling Visual */}
          <div className="relative h-[450px] flex items-center justify-center">

            {/* The Dashboard Card */}
            <motion.div
              style={{ y }}
              className="relative w-full max-w-[400px] bg-card rounded-3xl shadow-2xl border border-border overflow-hidden"
            >

              {/* Header */}
              <div className="border-b border-border p-4 flex items-center justify-between bg-muted/40 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/40" />
                  <div className="w-3 h-3 rounded-full bg-primary/40" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  AUTOPILOT ON
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6">

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

            </motion.div>

            {/* Floating Elements */}
            <div className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none overflow-hidden">
              {[1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  className="absolute bg-card p-2 rounded-xl shadow-lg border border-border text-yellow-500"
                  initial={{
                    x: Math.random() > 0.5 ? 400 : -400,
                    y: Math.random() * 200 - 100,
                    opacity: 0,
                    scale: 0.5
                  }}
                  whileInView={{
                    x: Math.random() * 40 - 20,
                    y: Math.random() * 40 - 20,
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.8,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  <TbStarFilled className="w-4 h-4" />
                </motion.div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
