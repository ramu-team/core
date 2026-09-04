import AppClient from './app-client';

export default async function AppPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ session?: string, machineId?: string }> 
}) {
  const params = await searchParams;
  const { session, machineId } = params;

  return (
    <main className="min-h-screen bg-stone-950 text-white">
      <AppClient urlSessionId={session} urlMachineId={machineId} />
    </main>
  );
}
