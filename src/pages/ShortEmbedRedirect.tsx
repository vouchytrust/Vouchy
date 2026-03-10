import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const DEFAULT_CONFIG = {
  layout: "editorial",
  darkMode: "true",
  radius: "12",
  padding: "16",
  font: "system",
  accent: "%233b82f6",
  cardBg: "%23121212",
  nameColor: "%23f5f5f7",
  companyColor: "%238e8e93",
  bodyColor: "%23aeaeb2",
  starColor: "%230aa939",
  showStars: "true",
  showAvatar: "true",
  showCompany: "true",
  shadow: "sm",
  displayMode: "grid",
  carouselVisible: "3",
  navStyle: "arrows",
  autoPlay: "false",
  autoPlaySpeed: "3000",
  navIconColor: "%23ffffff",
  navBgColor: "%232c2c2e",
  primaryBtnColor: "%23ffffff",
};

export default function ShortEmbedRedirect() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;

    const layout = searchParams.get("layout") || DEFAULT_CONFIG.layout;
    const darkMode = searchParams.get("darkMode") || DEFAULT_CONFIG.darkMode;
    const accent = searchParams.get("accent") || DEFAULT_CONFIG.accent;
    const cardBg = searchParams.get("cardBg") || DEFAULT_CONFIG.cardBg;
    const nameColor = searchParams.get("nameColor") || DEFAULT_CONFIG.nameColor;
    const companyColor = searchParams.get("companyColor") || DEFAULT_CONFIG.companyColor;
    const bodyColor = searchParams.get("bodyColor") || DEFAULT_CONFIG.bodyColor;
    const starColor = searchParams.get("starColor") || DEFAULT_CONFIG.starColor;
    const radius = searchParams.get("radius") || DEFAULT_CONFIG.radius;
    const padding = searchParams.get("padding") || DEFAULT_CONFIG.padding;
    const font = searchParams.get("font") || DEFAULT_CONFIG.font;
    const showStars = searchParams.get("showStars") || DEFAULT_CONFIG.showStars;
    const showAvatar = searchParams.get("showAvatar") || DEFAULT_CONFIG.showAvatar;
    const showCompany = searchParams.get("showCompany") || DEFAULT_CONFIG.showCompany;
    const shadow = searchParams.get("shadow") || DEFAULT_CONFIG.shadow;
    const displayMode = searchParams.get("displayMode") || DEFAULT_CONFIG.displayMode;
    const carouselVisible = searchParams.get("carouselVisible") || DEFAULT_CONFIG.carouselVisible;
    const navStyle = searchParams.get("navStyle") || DEFAULT_CONFIG.navStyle;
    const autoPlay = searchParams.get("autoPlay") || DEFAULT_CONFIG.autoPlay;
    const autoPlaySpeed = searchParams.get("autoPlaySpeed") || DEFAULT_CONFIG.autoPlaySpeed;
    const navIconColor = searchParams.get("navIconColor") || DEFAULT_CONFIG.navIconColor;
    const navBgColor = searchParams.get("navBgColor") || DEFAULT_CONFIG.navBgColor;
    const primaryBtnColor = searchParams.get("primaryBtnColor") || DEFAULT_CONFIG.primaryBtnColor;

    const params = new URLSearchParams({
      layout,
      darkMode,
      radius,
      padding,
      font,
      accent,
      cardBg,
      nameColor,
      companyColor,
      bodyColor,
      starColor,
      showStars,
      showAvatar,
      showCompany,
      shadow,
      displayMode,
      carouselVisible,
      navStyle,
      autoPlay,
      autoPlaySpeed,
      navIconColor,
      navBgColor,
      primaryBtnColor,
    });

    navigate(`/embed/${slug}?${params.toString()}`, { replace: true });
  }, [slug, searchParams, navigate]);

  return null;
}
