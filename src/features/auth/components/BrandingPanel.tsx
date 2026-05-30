export function BrandingPanel() {
  return (
    <div className="relative hidden h-dvh w-full overflow-hidden bg-[#0A2240] md:flex md:w-[42%] lg:w-[45%] xl:w-[48%]">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="animate-drift absolute -left-40 -top-40 h-[40rem] w-[40rem] rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 40%, rgba(255,77,0,0.18) 0%, transparent 60%)',
          }}
        />
        <div
          className="animate-drift-slow absolute -bottom-48 -right-48 h-[45rem] w-[45rem] rounded-full"
          style={{
            background: 'radial-gradient(circle at 70% 60%, rgba(0,196,179,0.12) 0%, transparent 60%)',
          }}
        />
        <div
          className="animate-drift absolute left-1/3 top-1/4 h-80 w-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,77,0,0.06) 0%, transparent 55%)',
            animationDelay: '-10s',
          }}
        />
        <div
          className="animate-pulse-glow absolute left-1/2 top-1/2 h-96 w-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,196,179,0.06) 0%, transparent 55%)',
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-12">
        <div className="flex flex-col items-center text-center">
          <img
            src="https://grupo-fg.com/assets/Grupo%20FG%20Blanco.svg"
            alt="Grupo FG"
            className="mb-2 h-16 w-auto"
          />
          <div className="mx-auto mb-5 h-px w-16 bg-gradient-to-r from-transparent via-[#FF4D00]/60 to-transparent" />
          <h1 className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
            SIRA
          </h1>
          <p className="mt-2 max-w-xs text-sm font-light tracking-wide text-[#898A8D]/80 uppercase">
            Sistema de Inspección y Recorridos de Áreas
          </p>
          <div className="mt-10 flex items-center gap-3 text-[#898A8D]/40">
            <div className="h-px w-8 bg-[#898A8D]/20" />
            <span className="text-xs tracking-widest uppercase">Plataforma corporativa</span>
            <div className="h-px w-8 bg-[#898A8D]/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
