import type {
  ActiveTourSession,
  RegisterWalkthroughPayload,
} from '../interfaces';

export function mapSessionToRegisterPayload(
  session: ActiveTourSession,
): RegisterWalkthroughPayload {
  return {
    folio: session.folio,
    startedAt: session.startedAtIso,
    detections: session.detections.map((detection) => ({
      folio: detection.folio,
      companyId: detection.companyId,
      branchId: detection.branchId,
      areaId: detection.areaId,
      detectionType: detection.detectionType,
      description: detection.description,
      responsibleId: detection.responsibleId,
      evidencePhotoDataUrl: detection.evidencePhotoDataUrl,
    })),
  };
}
