import { UserCheck, UserX, Users } from 'lucide-react';
import { UsersStatCard } from './UsersStatCard';
import type { UsersStatsSectionProps } from '../interfaces';

export function UsersStatsSection({ total, active, inactive }: UsersStatsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <UsersStatCard label="Total usuarios" value={total} icon={Users} tone="default" />
      <UsersStatCard label="Activos" value={active} icon={UserCheck} tone="success" />
      <UsersStatCard label="Inactivos" value={inactive} icon={UserX} tone="muted" />
    </div>
  );
}
