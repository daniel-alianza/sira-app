import { FileText, Headphones } from 'lucide-react';
import logoAlianza from '@/assets/logo_alianza.png';
import logoFge from '@/assets/logo_fge.png';
import logoTableros from '@/assets/logo_tableros.png';
import logoValmac from '@/assets/logo_valmac.png';
import { cn } from '@/lib/utils';

type AppFooterProps = {
  mounted?: boolean;
  transitionDelayClass?: 'delay-500' | 'delay-700';
};

const footerPartnerLogos: ReadonlyArray<{ src: string; alt: string }> = [
  { src: logoAlianza, alt: 'Alianza Eléctrica' },
  { src: logoFge, alt: 'FG Electrical' },
  { src: logoTableros, alt: 'Tableros y Arrancadores' },
  { src: logoValmac, alt: 'Valmact' },
];

const footerLinkClassName =
  'inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-[#0A2240] shadow-sm transition-all duration-200 hover:border-[#00C4B3]/40 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C4B3]/30';

export function AppFooter({
  mounted = true,
  transitionDelayClass = 'delay-500',
}: AppFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'relative z-10 mt-8 w-full overflow-hidden border-t border-slate-200 transition-all duration-1000',
        'bg-gradient-to-b from-[#eef2f6] via-[#f4f6f9] to-white',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]',
        transitionDelayClass,
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00C4B3]/35 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[#00C4B3]/6 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-32 w-32 rounded-full bg-[#0A2240]/5 blur-2xl"
        aria-hidden
      />

      <div className="relative w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14 xl:px-10 2xl:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-14 xl:gap-20">
          <div className="flex min-w-0 flex-col gap-8">
            <div
              className="flex max-w-full flex-nowrap items-center gap-x-4 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-x-7 md:gap-x-9 [&::-webkit-scrollbar]:hidden"
              role="list"
              aria-label="Marcas del grupo"
            >
              {footerPartnerLogos.map((item) => (
                <div
                  key={item.alt}
                  role="listitem"
                  className="flex h-11 shrink-0 items-center justify-center sm:h-14"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="max-h-9 w-auto max-w-[min(100%,9rem)] object-contain object-center opacity-90 transition duration-300 hover:opacity-100 sm:max-h-12 sm:max-w-none md:max-h-[3.25rem]"
                  />
                </div>
              ))}
            </div>

            <div className="max-w-xl space-y-1.5 border-l-2 border-[#00C4B3]/40 pl-4">
              <p className="text-sm font-medium leading-snug text-[#0A2240]">
                © {year} Grupo FG. Todos los derechos reservados.
              </p>
              <p className="text-xs leading-relaxed text-slate-600">
                Desarrollado por el departamento de Sistemas.
              </p>
            </div>
          </div>

          <nav
            className="flex w-full flex-col items-center gap-3 lg:min-w-48 lg:items-end lg:gap-4 lg:pt-1"
            aria-label="Enlaces del pie de página"
          >
            <div className="flex w-full max-w-md flex-col items-center gap-2 lg:max-w-none lg:items-end">
              <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 lg:text-right">
                Enlaces útiles
              </p>
              <span
                className="h-px w-10 rounded-full bg-gradient-to-r from-transparent via-[#00C4B3]/40 to-transparent lg:w-14"
                aria-hidden
              />
            </div>
            <div className="flex min-w-0 max-w-full flex-row flex-nowrap items-center justify-center gap-3 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] lg:justify-end [&::-webkit-scrollbar]:hidden">
              <a
                href="https://grupo-fg.com/politicas/assets/grupofg/Politica%20de%20Viaticos%20y%20Gastos%20de%20Viaje.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={footerLinkClassName}
              >
                <FileText className="size-4 shrink-0 text-[#00a896]" aria-hidden />
                Políticas
              </a>
              <a href="#" className={footerLinkClassName}>
                <Headphones className="size-4 shrink-0 text-[#00a896]" aria-hidden />
                Soporte
              </a>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
