import HomeClient from './home-client';

export default async function HomePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ session?: string, machineId?: string }> 
}) {
  const params = await searchParams;
  const { session, machineId } = params;

  return (
    <main className="min-h-screen bg-stone-950 text-white">
      <HomeClient urlSessionId={session} urlMachineId={machineId} />
    </main>
  );
}
