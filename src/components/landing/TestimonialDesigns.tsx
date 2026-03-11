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
            <img src={data.avatar} className="h-10 w-10 rounded-full object-cover border border-border" alt={data.name} />
            <div>
              <p className="text-xs font-bold text-foreground leading-none mb-1">{data.name}</p>
              <p className="text-[10px] text-muted-foreground">{data.role}</p>
            </div>
          </div>
          <p className="text-xs font-medium text-foreground/80 leading-relaxed mb-4 italic">"{data.content}"</p>
          <div className="mt-auto pt-4 border-t border-border/10">
            <Stars />
          </div>
        </div>
      );
    case 'minimal':
      return (
        <div className="p-6 bg-card/40 border-b border-border/50 h-full flex flex-col rounded-b-none">
          <div className="flex items-start gap-4">
            <img src={data.avatar} className="h-10 w-10 rounded-full object-cover border border-border" alt={data.name} />
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground mb-1">{data.name}</p>
              <Stars />
              <p className="text-xs font-medium text-foreground/70 leading-relaxed italic mt-2">"{data.content}"</p>
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
            <img src={data.avatar} className="h-8 w-8 rounded-full border border-border" alt={data.name} />
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
          <p className="text-xs font-medium text-foreground/80 leading-relaxed mb-4 italic">"{data.content}"</p>
          <div className="mt-auto pt-4 border-t border-border/10 flex items-center gap-3">
            <img src={data.avatar} className="h-8 w-8 rounded-full border border-border" alt={data.name} />
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
        <div className="p-6 bg-card/40 border border-border/50 rounded-2xl h-full flex flex-col items-center text-center">
          <img src={data.avatar} className="h-16 w-16 rounded-full border-4 border-background shadow-lg mb-4" alt={data.name} />
          <p className="text-xs font-bold text-foreground mb-1">{data.name}</p>
          <p className="text-[10px] text-muted-foreground mb-4">{data.role}</p>
          <Stars />
          <p className="text-[10px] font-medium text-foreground/70 leading-relaxed mt-4">"{data.content}"</p>
        </div>
      );
    case 'masonry':
      return (
        <div className="p-5 bg-card/40 border border-border/50 rounded-xl h-full flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img src={data.avatar} className="h-8 w-8 rounded-full" alt={data.name} />
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
          <img src={data.avatar} className="h-12 w-12 rounded-full flex-shrink-0" alt={data.name} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{data.name}</p>
            <p className="text-[10px] text-foreground/60 truncate italic">"{data.content}"</p>
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
    <section id="design-showcase" className='py-32 bg-background relative overflow-hidden'>
      {/* Blueprint Grid Background - Slightly more visible for the "architect" feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.06)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.06)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_90%)]"></div>

      <div className='container mx-auto px-6 relative z-10 max-w-7xl font-sans'>

        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24'>
          <div className='max-w-xl'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/[0.03] border border-primary/10 mb-6'
            >
              <Sparkles className="w-3 h-3 text-primary" />
              <span className='text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]'>Reference Master</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-3xl md:text-5xl lg:text-5xl font-black tracking-tight text-foreground mb-6 leading-[1.2]'
            >
              Seven precision <br />
              <span className='text-primary italic font-medium'>layout archetypes.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground font-medium max-w-lg leading-relaxed"
            >
              Engineered for conversion. Every pixel is calculated to maximize trust
              and social proof efficiency across any interface.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="hidden lg:flex items-center gap-4 text-primary/40 text-[10px] font-black uppercase tracking-[0.4em]"
          >
            <span>v.1.0-alpha</span>
            <div className="w-12 h-px bg-primary/20" />
            <span>Blueprint Master</span>
          </motion.div>
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
            <CarouselContent className="-ml-6">
              {layouts.map((layout, index) => (
                <CarouselItem key={layout.id} className="pl-6 basis-full md:basis-1/2 lg:basis-1/3 h-[420px]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col h-full group"
                  >
                    <div className="flex-1 relative rounded-[40px] bg-card/20 border border-border/50 p-8 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-primary/40 group-hover:bg-card/30">

                      {/* Metric lines - Purely decorative architect feel */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-primary/[0.04]" />
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-primary/[0.04]" />

                      <div className="relative z-10 w-full transform transition-all duration-500 group-hover:scale-[1.02]">
                        <BlueprintCard layoutId={layout.id} />
                      </div>

                      {/* Layout Label */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-primary/40 uppercase tracking-[0.6em] whitespace-nowrap">
                        SYS_ARC_0{index + 1} // {layout.id.toUpperCase()}
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
              <CarouselPrevious className="static translate-y-0 h-12 w-12 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-all rounded-2xl group" />
              <CarouselNext className="static translate-y-0 h-12 w-12 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-all rounded-2xl group" />
            </div>
          </Carousel>
        </div>

        {/* Action Bar - Premium Dark Footer for the section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-32 p-1 bg-card/50 border border-border rounded-3xl"
        >
          <div className="bg-foreground text-background p-8 md:p-12 rounded-[22px] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group/action">
            {/* Gloss Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover/action:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10 text-center md:text-left">
              <h4 className="text-3xl md:text-4xl font-black mb-3 tracking-tighter text-background">Precision-engineered <br className="hidden md:block" /> for high-velocity trust.</h4>
              <p className="text-background/70 font-medium text-sm md:text-lg max-w-md">Every blueprint is designed to be fully adaptable via our signature Widget Lab.</p>
            </div>

            <button className="relative z-10 h-16 px-10 bg-background text-foreground rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all hover:scale-[1.05] active:scale-[0.95] flex items-center justify-center gap-3 group/btn shadow-2xl shadow-black/20">
              Start Building
              <ArrowRight className="w-4 h-4 transition-all group-hover/btn:translate-x-1 group-hover/btn:text-primary" />
            </button>

            {/* Subtle Reference lines in background - slightly more visible */}
            <div className="absolute top-0 right-1/4 h-full w-[1px] bg-background/10" />
            <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-background/10" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
