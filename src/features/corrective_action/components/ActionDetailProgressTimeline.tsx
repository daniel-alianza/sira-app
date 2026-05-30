import { PenLine } from 'lucide-react';
import { MediaImage } from '@/components/MediaImage';
import { cn } from '@/lib/utils';
import {
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { CorrectiveActionDetail } from '../interfaces';
import {
  buildActionProgressSteps,
  resolveActionProgressEvidence,
  shouldShowActionProgress,
  type ActionProgressStep,
} from '../utils/build-action-progress-steps';

interface ActionDetailProgressTimelineProps {
  readonly detail: CorrectiveActionDetail;
}

function StepConnector({
  state,
}: {
  readonly state: ActionProgressStep['state'];
}) {
  return (
    <div
      className={cn(
        'h-0.5 min-w-6 flex-1',
        state === 'upcoming' ? 'bg-slate-200' : 'bg-[#0A2240]',
      )}
      aria-hidden
    />
  );
}

function StepDot({ state }: { readonly state: ActionProgressStep['state'] }) {
  return (
    <div
      className={cn(
        'relative z-10 flex shrink-0 items-center justify-center rounded-full border-2 bg-white',
        state === 'completed' && 'size-3.5 border-[#0A2240] bg-[#0A2240]',
        state === 'current' && 'size-5 border-[#0A2240]',
        state === 'upcoming' && 'size-3.5 border-slate-300',
      )}
    >
      {state === 'current' && (
        <span className="size-2 rounded-full bg-[#0A2240]" aria-hidden />
      )}
    </div>
  );
}

function EvidenceThumbnail({
  label,
  mediaPath,
  alt,
  variant,
}: {
  readonly label: string;
  readonly mediaPath: string;
  readonly alt: string;
  readonly variant: 'signature' | 'resolution';
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div
        className={cn(
          'relative w-full bg-slate-50',
          variant === 'signature' ? 'aspect-[3/1]' : 'aspect-[4/3]',
        )}
      >
        <MediaImage
          mediaPath={mediaPath}
          alt={alt}
          className={cn(
            'h-full w-full',
            variant === 'signature' ? 'object-contain p-2' : 'object-cover',
          )}
          fallbackClassName="h-full w-full"
        />
      </div>
      <figcaption className="border-t border-slate-100 px-3 py-2 text-xs font-medium text-[#0A2240]">
        {label}
      </figcaption>
    </figure>
  );
}

export function ActionDetailProgressTimeline({
  detail,
}: ActionDetailProgressTimelineProps) {
  if (!shouldShowActionProgress(detail)) {
    return null;
  }

  const steps = buildActionProgressSteps(detail);
  const currentStep = steps.find((step) => step.state === 'current') ?? steps.at(-1);
  const evidence = resolveActionProgressEvidence(detail);

  return (
    <section className={cn(dashboardCard(), 'overflow-hidden p-0')}>
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3.5 md:px-6 md:py-4">
        <h2 className={cn(dashboardHeadingClass, 'text-sm md:text-base')}>
          Avance de la acción
        </h2>
        <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
          Estado del compromiso y evidencias del responsable
        </p>
      </div>

      <div className="overflow-x-auto px-4 py-5 md:px-6">
        <ol className="flex min-w-[880px] items-start">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;

            return (
              <li
                key={step.id}
                className={cn('flex min-w-0 flex-1 items-start', !isLast && 'pr-1')}
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center">
                    <StepDot state={step.state} />
                    {!isLast && (
                      <StepConnector
                        state={
                          step.state === 'upcoming' ? 'upcoming' : 'completed'
                        }
                      />
                    )}
                  </div>

                  <div className="mt-3 pr-3">
                    <p
                      className={cn(
                        'text-sm leading-snug',
                        step.state === 'current' &&
                          'font-semibold text-[#0A2240]',
                        step.state === 'completed' && 'font-medium text-slate-600',
                        step.state === 'upcoming' && 'text-slate-400',
                      )}
                    >
                      {step.title}
                    </p>
                    {step.state !== 'upcoming' && step.timestamp && (
                      <p className="mt-1 text-[11px] tabular-nums text-slate-400">
                        {step.timestamp}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {currentStep && (
        <div className="border-t border-slate-100 bg-slate-50/40 px-4 py-4 md:px-6 md:py-5">
          <div className="flex items-start gap-2">
            <PenLine className="mt-0.5 size-4 shrink-0 text-[#00a896]" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#0A2240]">
                {currentStep.title}
              </p>
              <p className={cn(dashboardSubtextClass, 'mt-1 text-sm leading-relaxed')}>
                {currentStep.description}
              </p>
              {currentStep.timestamp && (
                <p className="mt-1.5 text-xs tabular-nums text-slate-500">
                  {currentStep.timestamp}
                </p>
              )}
            </div>
          </div>

          {(evidence.showSignature || evidence.showResolution) && (
            <div
              className={cn(
                'mt-4 grid gap-3',
                evidence.showSignature && evidence.showResolution
                  ? 'sm:grid-cols-2'
                  : 'max-w-md',
              )}
            >
              {evidence.showSignature && detail.signatureUrl && (
                <EvidenceThumbnail
                  label="Firma del responsable"
                  mediaPath={detail.signatureUrl}
                  alt="Firma del responsable"
                  variant="signature"
                />
              )}
              {evidence.showResolution && detail.resolutionPhotoUrl && (
                <EvidenceThumbnail
                  label="Evidencia de resolución"
                  mediaPath={detail.resolutionPhotoUrl}
                  alt="Evidencia de resolución del responsable"
                  variant="resolution"
                />
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
