import { prisma } from '@ramu/db';
import AuditLogsClient from './audit-logs-client';

export const metadata = {
  title: "Audit Logs",
}

export const dynamic = 'force-dynamic';

export default async function AuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100, // Show last 100 logs for prototype
    include: {
      admin: {
        select: { name: true, email: true }
      }
    }
  });

  return <AuditLogsClient logs={logs} />;
}
