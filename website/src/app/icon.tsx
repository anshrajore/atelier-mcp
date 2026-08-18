import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#090d16",
          borderRadius: 12,
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: 42,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
          }}
        >
          A
        </span>
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#ff7a00",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
