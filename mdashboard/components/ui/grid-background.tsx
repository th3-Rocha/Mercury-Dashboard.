export default function GridBackground() {
  return (
    <div
      className="absolute inset-0 bg-black"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
      }}
    />
  );
}
