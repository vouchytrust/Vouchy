import { memo } from "react";
import HeroComponent from "./Hero";
import BentoGridComponent from "./BentoGrid";
import CTAComponent from "./CTA";
import HowItWorksComponent from "./HowItWorks";
import PricingComponent from "./Pricing";
import ProductShowcaseComponent from "./ProductShowcase";
import TestimonialDesignsComponent from "./TestimonialDesigns";

export const Hero = memo(HeroComponent);
export const BentoGrid = memo(BentoGridComponent);
export const CTA = memo(CTAComponent);
export const HowItWorks = memo(HowItWorksComponent);
export const Pricing = memo(PricingComponent);
export const ProductShowcase = memo(ProductShowcaseComponent);
export const TestimonialDesigns = memo(TestimonialDesignsComponent);
