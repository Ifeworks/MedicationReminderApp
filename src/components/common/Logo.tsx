import React from "react";
import Icon from "./Icon";

export function Logo({
  light = false,
  badgeText,
  size = "md",
}: {
  light?: boolean;
  badgeText?: string;
  size?: "sm" | "md" | "lg";
}) {
  const iconSize = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-11 h-11" : "w-9 h-9";
  const iconPixel = size === "sm" ? 16 : size === "lg" ? 22 : 18;
  const titleSize = size === "sm" ? "text-base" : size === "lg" ? "text-xl" : "text-lg";

  return (
    <div className="flex items-center gap-2.5 select-none text-left">
      <div
        className={`${iconSize} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105`}
        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
      >
        <Icon name="chef" size={iconPixel} />
      </div>
      <div className="leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif ${titleSize} font-bold tracking-tight`}
            style={{ color: light ? "#fff7ee" : "var(--brown)" }}
          >
            PB DELICACIES
          </span>
          {badgeText && (
            <span
              className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full"
              style={{ background: "var(--secondary)", color: "var(--secondary-foreground)" }}
            >
              {badgeText}
            </span>
          )}
        </div>
        <div
          className="text-[10px] tracking-[0.2em] uppercase font-medium mt-0.5"
          style={{ color: light ? "rgba(255,247,238,0.7)" : "var(--muted-foreground)" }}
        >
          Delicacies at your disposal
        </div>
      </div>
    </div>
  );
}

export default Logo;
