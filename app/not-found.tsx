import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold text-cyan-400 mb-2">404 - Página no encontrada</h2>
      <p className="text-slate-400 text-sm mb-4">La ruta solicitada no existe o ha sido movida.</p>
      <Link href="/" className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-cyan-400 transition">
        Volver al inicio
      </Link>
    </div>
  );
}
