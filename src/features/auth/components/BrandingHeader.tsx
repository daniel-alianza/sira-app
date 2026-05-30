interface BrandingHeaderProps {
  variant: 'desktop' | 'mobile';
}

export function BrandingHeader({ variant }: BrandingHeaderProps) {
  const isDesktop = variant === 'desktop';

  return (
    <div className={isDesktop ? 'text-center' : 'flex flex-1 flex-col items-center justify-center px-8 pb-2'}>
      <img
        src="https://grupo-fg.com/assets/Grupo%20FG%20Blanco.svg"
        alt="Grupo FG"
        className={isDesktop ? 'mx-auto mb-1 h-12 w-auto' : 'h-16 w-auto'}
      />
      <div className={isDesktop ? 'mx-auto mt-4 mb-3 h-px w-12 bg-gradient-to-r from-transparent via-[#FF4D00]/50 to-transparent' : 'mx-auto mt-3 mb-2 h-px w-12 bg-gradient-to-r from-transparent via-[#FF4D00]/40 to-transparent'} />
      <h1
        className={
          isDesktop
            ? 'text-2xl font-bold tracking-tight text-white'
            : 'text-2xl font-bold tracking-tight text-white'
        }
      >
        SIRA
      </h1>
      <p
        className={
          isDesktop
            ? 'mt-1 text-xs font-light tracking-wide text-[#898A8D] uppercase'
            : 'mt-1 text-center text-xs font-light tracking-wide text-[#898A8D] uppercase'
        }
      >
        {isDesktop ? (
          'Sistema de Inspección y Recorridos de Áreas'
        ) : (
          <>
            Sistema de Inspección<br />y Recorridos de Áreas
          </>
        )}
      </p>
    </div>
  );
}
