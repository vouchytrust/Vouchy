import { motion } from 'framer-motion';
import { Sparkles, Layout, Rows3, Quote, MessageCircle, Users, GalleryHorizontalEnd, Layers3, ArrowRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import { TbStarFilled } from 'react-icons/tb';

const mockData = {
  clean: {
    name: "Alex Rivera",
    role: "Product at Linear",
    content: "Vouchy is the first tool that actually makes our customers WANT to leave a review. The video experience is seamless.",
    avatar: "https://i.pravatar.cc/150?u=alex"
  },
  minimal: {
    name: "Elena de Luca",
    role: "Growth Lead @ Vercel",
    content: "Clean, fast, and high-converting. We saw a 20% increase in trust-badge engagement within 48 hours of embedding.",
    avatar: "https://i.pravatar.cc/150?u=elena"
  },
  editorial: {
    name: "Julianna Smalls",
    role: "Founder of SmallCo",
    content: "As a solo founder, I don't have time to chase clients. Vouchy's automation handles everything while I focus on building.",
    avatar: "https://i.pravatar.cc/150?u=julia"
  },
  bubble: {
    name: "Marcus Chen",
    role: "Software Engineer",
    content: "The recording flow is brilliant. My clients feel like they're just having a quick chat, and I get a high-quality video review.",
    avatar: "https://i.pravatar.cc/150?u=marcus"
  },
  'avatar-wall': {
    name: "Sarah Jenkins",
    role: "CEO, Streamline",
    content: "Our testimonial wall is now the highest-converting section on our landing page. It's transformed our brand's authority.",
    avatar: "https://i.pravatar.cc/150?u=sarahj"
  },
  masonry: {
    name: "David Park",
    role: "Architect @ Frame",
    content: "The masonry layout looks incredible on our portfolio. It organizes differently sized reviews into a beautiful, cohesive wall.",
    avatar: "https://i.pravatar.cc/150?u=david"
  },
  marquee: {
    name: "Lila Rose",
    role: "Creative Director",
    content: "The marquee adds a dynamic energy to our site. It shows potential clients that we have a constant stream of happy customers.",
    avatar: "https://i.pravatar.cc/150?u=lila"
  }
};

const BlueprintCard = ({ layoutId }: { layoutId: string }) => {
  const data = mockData[layoutId as keyof typeof mockData] || mockData.clean;

  const Stars = () => (
    <div className="flex gap-0.5 mb-2">
      {[...Array(5)].map((_, i) => <TbStarFilled key={i} className="w-3 h-3 text-yellow-500" />)}
    </div>
  );

  switch (layoutId) {
    case 'clean':
      return (
        <div className="p-6 bg-card/40 border border-border/50 rounded-2xl h-full flex flex-col group/card transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <img src={data.avatar} className="h-10 w-10 rounded-full object-cover border border-border" alt={data.name} loading="lazy" />
            <div>
              <p className="text-xs font-bold text-foreground leading-none mb-1">{data.name}</p>
              <p className="text-[10px] text-muted-foreground">{data.role}</p>
            </div>
          </div>
          <p className="text-xs font-medium text-foreground/80 leading-relaxed mb-4">"{data.content}"</p>
          <div className="mt-auto pt-4 border-t border-border/10">
            <Stars />
          </div>
        </div>
      );
    case 'minimal':
      return (
        <div className="p-6 bg-card/40 border-b border-border/50 h-full flex flex-col rounded-b-none">
          <div className="flex items-start gap-4">
            <img src={data.avatar} className="h-10 w-10 rounded-full object-cover border border-border" alt={data.name} loading="lazy" />
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground mb-1">{data.name}</p>
              <Stars />
              <p className="text-xs font-medium text-foreground/70 leading-relaxed mt-2">"{data.content}"</p>
            </div>
          </div>
        </div>
      );
    case 'editorial':
      return (
        <div className="p-8 bg-card/40 border-l-4 border-primary/50 h-full flex flex-col relative rounded-r-2xl">
          <Quote className="absolute top-6 right-6 text-primary/10 w-12 h-12" />
          <Stars />
          <p className="text-sm font-bold text-foreground/90 leading-tight my-4">
            "Vouchy's automation handles everything while I focus on building."
          </p>
          <div className="mt-auto flex items-center gap-3 pt-4 border-t border-border/10">
            <img src={data.avatar} className="h-8 w-8 rounded-full border border-border" alt={data.name} loading="lazy" />
            <p className="text-[10px] font-bold text-foreground/60">{data.name}</p>
          </div>
        </div>
      );
    case 'bubble':
      return (
        <div className="p-6 bg-card/40 border border-border/50 rounded-3xl h-full flex flex-col relative shadow-xl shadow-primary/5">
          <div className="flex justify-between items-center mb-6">
            <Stars />
            <div className="px-2 py-0.5 rounded-full bg-vouchy-success/10 border border-vouchy-success/20 text-[8px] font-bold text-vouchy-success uppercase tracking-wider">Verified</div>
          </div>
          <p className="text-xs font-medium text-foreground/80 leading-relaxed mb-4">"{data.content}"</p>
          <div className="mt-auto pt-4 border-t border-border/10 flex items-center gap-3">
            <img src={data.avatar} className="h-8 w-8 rounded-full border border-border" alt={data.name} loading="lazy" />
            <div>
              <p className="text-[10px] font-bold text-foreground leading-none">{data.name}</p>
              <p className="text-[8px] text-muted-foreground mt-0.5">{data.role}</p>
            </div>
          </div>
          <div className="absolute -bottom-2 left-10 w-4 h-4 bg-card border-r border-b border-border/50 rotate-45" />
        </div>
      );
    case 'avatar-wall':
      return (
        <div className="p-4 sm:p-6 bg-card/40 border border-border/50 rounded-2xl h-full flex flex-col items-center text-center overflow-y-auto scrollbar-hide">
          <img src={data.avatar} className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-4 border-background shadow-lg mb-3 sm:mb-4 shrink-0" alt={data.name} loading="lazy" />
          <p className="text-[11px] sm:text-xs font-bold text-foreground mb-0.5 sm:mb-1">{data.name}</p>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-3 sm:mb-4">{data.role}</p>
          <div className="shrink-0"><Stars /></div>
          <p className="text-[10px] font-medium text-foreground/70 leading-relaxed mt-3 sm:mt-4 pb-2">"{data.content}"</p>
        </div>
      );
    case 'masonry':
      return (
        <div className="p-5 bg-card/40 border border-border/50 rounded-xl h-full flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img src={data.avatar} className="h-8 w-8 rounded-full" alt={data.name} loading="lazy" />
            <div>
              <p className="text-[10px] font-bold text-foreground">{data.name}</p>
              <Stars />
            </div>
          </div>
          <p className="text-[11px] font-medium text-foreground/80 leading-snug">"{data.content}"</p>
          <div className="mt-auto h-24 w-full rounded-xl bg-gradient-to-br from-primary/5 to-primary/20 border border-primary/10 flex items-center justify-center">
            <div className="text-[10px] font-black text-primary opacity-40 uppercase tracking-[0.2em]">Video Testimonial</div>
          </div>
        </div>
      );
    case 'marquee':
      return (
        <div className="p-4 bg-card/40 border border-border/50 rounded-2xl h-full flex items-center gap-4 overflow-hidden">
          <img src={data.avatar} className="h-12 w-12 rounded-full flex-shrink-0" alt={data.name} loading="lazy" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{data.name}</p>
            <p className="text-[10px] text-foreground/60 truncate">"{data.content}"</p>
          </div>
          <div className="flex-shrink-0 opacity-20">
            <GalleryHorizontalEnd className="w-6 h-6" />
          </div>
        </div>
      );
    default:
      return null;
  }
};

const layouts = [
  { id: "clean", name: "Clean Grid", icon: Layout, desc: "Architectural precision" },
  { id: "minimal", name: "Minimal List", icon: Rows3, desc: "High performance flow" },
  { id: "editorial", name: "Editorial", icon: Quote, desc: "Storytelling spotlight" },
  { id: "bubble", name: "Social Bubble", icon: MessageCircle, desc: "Familiar engagement" },
  { id: "avatar-wall", name: "Avatar Wall", icon: Users, desc: "Profile-first focus" },
  { id: "marquee", name: "Marquee", icon: GalleryHorizontalEnd, desc: "Infinite motion ribbons" },
  { id: "masonry", name: "Masonry Grid", icon: Layers3, desc: "Variable density flow" },
];

export default function TestimonialDesigns() {
  return (
    <section id="design-showcase" className='py-12 lg:py-16 bg-background relative overflow-hidden min-h-screen flex flex-col justify-center'>
      {/* Blueprint Grid Background - Slightly more visible for the "architect" feel */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      <div className='container mx-auto px-6 relative z-10 max-w-7xl font-sans'>

        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 lg:mb-10'>
          <div className='max-w-xl'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/[0.03] border border-primary/10 mb-4'
            >
              <span className='text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]'>Display styles</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-foreground leading-[1.1]'
            >
              Pick a style that <br />
              <span className='text-primary font-medium'>fits your brand.</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base text-muted-foreground font-medium max-w-sm leading-relaxed lg:text-right"
          >
            Seven ready-to-use layouts. Slide through them and drop your favourite on any page.
          </motion.p>
        </div>

        {/* Slidable Blueprints */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-6" viewportClassName="overflow-visible">
              {layouts.map((layout, index) => (
                <CarouselItem key={layout.id} className="pl-6 basis-full md:basis-1/2 lg:basis-1/3 h-[450px] sm:h-[420px] lg:h-[400px]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col h-full group pb-4"
                  >
                    <div className="flex-1 relative rounded-2xl p-8 flex items-center justify-center transition-all duration-500 group">

                      {/* Precision Corners Reverted */}
                      <div className="absolute -top-px -left-px w-10 h-10 border-t-[1.5px] border-l-[1.5px] border-primary/40 rounded-tl-2xl group-hover:border-primary transition-all duration-500" />
                      <div className="absolute -top-px -right-px w-10 h-10 border-t-[1.5px] border-r-[1.5px] border-primary/40 rounded-tr-2xl group-hover:border-primary transition-all duration-500" />
                      <div className="absolute -bottom-px -left-px w-10 h-10 border-b-[1.5px] border-l-[1.5px] border-primary/40 rounded-bl-2xl group-hover:border-primary transition-all duration-500" />
                      <div className="absolute -bottom-px -right-px w-10 h-10 border-b-[1.5px] border-r-[1.5px] border-primary/40 rounded-br-2xl group-hover:border-primary transition-all duration-500" />

                      {/* Metric lines - Purely decorative architect feel */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-primary/[0.04]" />
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-primary/[0.04]" />

                      <div className="relative z-10 w-full h-[280px] sm:h-[260px] transform transition-all duration-500 group-hover:scale-[1.02]">
                        <BlueprintCard layoutId={layout.id} />
                      </div>


                    </div>

                    <div className="mt-6 px-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                          <layout.icon className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-black text-foreground tracking-tight">{layout.name}</h3>
                      </div>
                      <p className="text-muted-foreground text-xs font-medium pl-11 leading-relaxed">{layout.desc}</p>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex justify-center md:justify-end gap-3 mt-12 md:-mt-12 md:relative md:z-20">
              <CarouselPrevious className="static translate-y-0 h-12 w-12 border-border/50 bg-card/40 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-all rounded-xl group flex items-center justify-center" />
              <CarouselNext className="static translate-y-0 h-12 w-12 border-border/50 bg-card/40 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-all rounded-xl group flex items-center justify-center" />
            </div>
          </Carousel>
        </div>

        {/* Action Bar — Dark Branded Blueprint CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 group relative"
        >
          <div className="relative rounded-2xl border border-white/5 bg-card/40 backdrop-blur-sm">
            {/* Branded Green Corners Reverted */}
            <div className="absolute -top-px -left-px w-14 h-14 border-t-[2px] border-l-[2px] border-primary/40 rounded-tl-2xl group-hover:border-primary transition-all duration-500" />
            <div className="absolute -top-px -right-px w-14 h-14 border-t-[2px] border-r-[2px] border-primary/40 rounded-tr-2xl group-hover:border-primary transition-all duration-500" />
            <div className="absolute -bottom-px -left-px w-14 h-14 border-b-[2px] border-l-[2px] border-primary/40 rounded-bl-2xl group-hover:border-primary transition-all duration-500" />
            <div className="absolute -bottom-px -right-px w-14 h-14 border-b-[2px] border-r-[2px] border-primary/40 rounded-br-2xl group-hover:border-primary transition-all duration-500" />

            {/* Crosshair lines — Subtle light accents on dark */}
            <div className="absolute top-0 right-[28%] h-full w-[1px] bg-white/[0.03]" />
            <div className="absolute bottom-[38%] left-0 w-full h-[1px] bg-white/[0.03]" />

            <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="text-center md:text-left">
                <h4 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter text-foreground leading-[1.05]">
                  Make it look <br className="hidden md:block" />
                  <span className="text-primary">exactly yours.</span>
                </h4>
                <p className="text-muted-foreground font-medium text-base md:text-lg max-w-sm leading-relaxed">
                  Tweak colours, fonts, and layout in the Widget Lab until it feels like it was built for your brand.
                </p>
              </div>

              <div className="relative group/btn">
                {/* Glow for button */}
                <div className="absolute -inset-2 bg-primary/10 blur-xl group-hover/btn:bg-primary/20 transition-colors" />
                <button className="relative h-16 px-10 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 shadow-2xl">
                  Start Building
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
