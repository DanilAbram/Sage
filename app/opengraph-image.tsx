import { ImageResponse } from "next/og";

export const alt = "Sage: turn what you love into a career";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#141B12",
          color: "#F7F5EF",
          borderBottom: "6px solid #9CAF88",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 30, fontWeight: 400, letterSpacing: 10 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 4,
              background: "#9CAF88",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 64 64">
              <path d="M32 50C20 44 15 34 17 20c11-1 20 3 24 11 3 6 1 14-9 19z" fill="#141B12" />
            </svg>
          </div>
          SAGE
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 300, lineHeight: 1.08, letterSpacing: 4, maxWidth: 1000 }}>
            TURN WHAT YOU LOVE INTO A CAREER.
          </div>
          <div style={{ fontSize: 34, color: "#9CAF88", maxWidth: 900 }}>
            Type your hobbies. Get careers that fit, why they fit, and your first step.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
