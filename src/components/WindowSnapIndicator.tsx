interface WindowSnapIndicatorProps {
  zone: "left" | "right" | "top" | "bottom-left" | "bottom-right" | "top-left" | "top-right" | null;
}

export const WindowSnapIndicator = ({ zone }: WindowSnapIndicatorProps) => {
  if (!zone) return null;

  // Taskbar is at TOP (h-12 = 48px), so we need top offset of ~56px
  // Bottom has power button area, so leave ~80px margin
  const getZoneStyles = () => {
    switch (zone) {
      case "left":
        return "left-2 top-14 bottom-20 w-[49%]";
      case "right":
        return "right-2 top-14 bottom-20 w-[49%]";
      case "top":
        return "left-2 right-2 top-14 bottom-20";
      case "top-left":
        return "left-2 top-14 w-[49%] h-[calc(50%-68px)]";
      case "top-right":
        return "right-2 top-14 w-[49%] h-[calc(50%-68px)]";
      case "bottom-left":
        return "left-2 bottom-20 w-[49%] h-[calc(50%-68px)]";
      case "bottom-right":
        return "right-2 bottom-20 w-[49%] h-[calc(50%-68px)]";
      default:
        return "";
    }
  };

  return (
    <div
      className={`fixed ${getZoneStyles()} rounded-xl border-2 border-primary/50 bg-primary/10 backdrop-blur-sm z-[9998] pointer-events-none animate-scale-in`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl" />
    </div>
  );
};
