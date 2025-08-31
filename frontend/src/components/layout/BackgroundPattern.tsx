import React from "react";

export function BackgroundPattern() {
  return (
    <div className="w-full h-full">
      <img
        src="../../public/6931402.jpg" // 👈 put your image path here (public folder or CDN)
        alt="Background"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
