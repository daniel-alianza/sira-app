import type { CommitmentDateCellProps } from '../interfaces';

export function CommitmentDateCell({ date }: CommitmentDateCellProps) {
  if (date) {
    return (
      <div className="space-y-0.5">
        <p className="font-medium text-[#0A2240]">{date}</p>
        <span className="inline-flex rounded-full bg-[#00C4B3]/15 px-2 py-0.5 text-[10px] font-medium text-[#007a70]">
          Con fecha compromiso
        </span>
      </div>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
      Sin fecha compromiso
    </span>
  );
}
