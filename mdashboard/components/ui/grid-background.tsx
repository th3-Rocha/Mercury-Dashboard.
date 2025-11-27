export default function GridBackground() {
  return (
    <div
      // h-full w-full: Garante tamanho mesmo se o posicionamento falhar
      // absolute inset-0: Tenta colar nas bordas do pai
      // -z-10: Garante que fique atrás de tudo (segurança extra)
      className="absolute inset-0 h-full w-full bg-black -z-10"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px", // Tamanho dos quadrados
      }}
    />
  );
}
