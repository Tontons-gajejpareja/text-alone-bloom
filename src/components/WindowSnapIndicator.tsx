interface WindowSnapIndicatorProps {
  zone: "left" | "right" | "top" | "bottom-left" | "bottom-right" | "top-left" | "top-right" | null;
}

export const WindowSnapIndicator = ({ zone }: WindowSnapIndicatorProps) => {
  if (!zone) return null;

  // Taskbar is at TOP (h-12 = 48px + padding = 56px total)
  // Bottom just needs small margin (16px)
  const getZoneStyles = () => {
    switch (zone) {
      case "left":
        return "left-2 top-[60px] bottom-4 w-[calc(50%-12px)]";
      case "right":
        return "right-2 top-[60px] bottom-4 w-[calc(50%-12px)]";
      case "top":
        return "left-2 right-2 top-[60px] bottom-4";
      case "top-left":
        return "left-2 top-[60px] w-[calc(50%-12px)] h-[calc(50%-40px)]";
      case "top-right":
        return "right-2 top-[60px] w-[calc(50%-12px)] h-[calc(50%-40px)]";
      case "bottom-left":
        return "left-2 bottom-4 w-[calc(50%-12px)] h-[calc(50%-40px)]";
      case "bottom-right":
        return "right-2 bottom-4 w-[calc(50%-12px)] h-[calc(50%-40px)]";
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
