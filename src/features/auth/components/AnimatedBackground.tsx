export function AnimatedBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-drift absolute -left-32 -top-32 h-[35rem] w-[35rem] rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 40%, rgba(255,77,0,0.2) 0%, transparent 65%)',
          }}
        />
        <div
          className="animate-drift-slow absolute -bottom-40 -right-40 h-[40rem] w-[40rem] rounded-full"
          style={{
            background: 'radial-gradient(circle at 70% 60%, rgba(0,196,179,0.15) 0%, transparent 65%)',
          }}
        />
        <div
          className="animate-drift absolute left-1/4 top-1/3 h-72 w-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,77,0,0.08) 0%, transparent 60%)',
            animationDelay: '-8s',
          }}
        />
        <div
          className="animate-pulse-glow absolute left-2/3 top-1/2 h-96 w-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,196,179,0.08) 0%, transparent 60%)',
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </>
  );
}
