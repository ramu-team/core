import Link from "next/link";
import { buttonVariants } from "@ramu/ui/components/button";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="rounded-full bg-primary/10 p-6">
          <SearchX className="h-16 w-16 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            404
          </h1>
          <h2 className="text-2xl font-semibold tracking-tight">
            Halaman Tidak Ditemukan
          </h2>
          <p className="max-w-125 text-muted-foreground">
            Maaf, kami tidak dapat menemukan halaman yang Anda cari. Halaman mungkin telah dipindahkan atau dihapus.
          </p>
        </div>
        <Link href="/dashboard" className={buttonVariants({ size: "lg", className: "mt-4" })}>
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
