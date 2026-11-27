import { requireSandboxSession } from '@/lib/sandbox/guard';
import ProposalsClient from '@/components/ProposalsClient';

export const dynamic = 'force-dynamic';

export default async function ProposalsPage() {
  await requireSandboxSession('/proposals');
  return <ProposalsClient />;
}
