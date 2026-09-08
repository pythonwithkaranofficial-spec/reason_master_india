import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  count?: number;
}

export function Skeleton({
  width = "100%",
  height = "20px",
  borderRadius = "var(--radius-sm)",
  className = "",
  count = 1,
}: SkeletonProps) {
  const elements = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {elements.map((key) => (
        <div
          key={key}
          className={`skeleton-pulse ${className}`}
          style={{
            width,
            height,
            borderRadius,
            backgroundColor: "var(--bg-subtle)",
            marginBottom: count > 1 ? "var(--space-2)" : 0,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .skeleton-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="rm-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <Skeleton height="28px" width="60%" />
      <Skeleton height="16px" width="90%" count={2} />
      <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
        <Skeleton height="24px" width="70px" borderRadius="var(--radius-full)" />
        <Skeleton height="24px" width="90px" borderRadius="var(--radius-full)" />
      </div>
    </div>
  );
}
