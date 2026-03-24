import { getStore, getProducts, getCategories } from "@/lib/supabase";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import StoreShell from "@/components/StoreShell";

export const revalidate = 60;

export default async function HomePage({ searchParams }: { searchParams: Promise<{ kategori?: string }> }) {
  const params = await searchParams;
  const store = await getStore();
  if (!store) return <div className="p-20 text-center">Mağaza bulunamadı</div>;

  const kategori = params.kategori || null;
  const [products, categories] = await Promise.all([
    getProducts(kategori),
    getCategories(),
  ]);

  return (
    <StoreShell store={store}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
          <p className="text-sm font-bold tracking-[0.25em] uppercase text-[var(--color-accent)] mb-4">
            Balıkesir
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">{store.name}</h1>
          <p className="text-lg text-[var(--color-muted)] max-w-lg mx-auto mb-8">
            Kaliteli mobilya, uygun fiyat
          </p>
          <a href={`https://wa.me/905301234567`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm tracking-wide transition-colors">
            💬 WhatsApp ile Bilgi Al
          </a>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="/" className={!kategori ? "px-4 py-2 rounded-full text-sm font-semibold bg-[var(--color-brand)] text-white" : "px-4 py-2 rounded-full text-sm font-semibold border border-[var(--color-border)] hover:border-[var(--color-brand)] transition-colors"}>
            Tümü
          </Link>
          {categories.map((cat: { id: string; name: string; slug: string }) => (
            <Link key={cat.id} href={`/?kategori=${cat.slug}`} className={kategori === cat.slug ? "px-4 py-2 rounded-full text-sm font-semibold bg-[var(--color-brand)] text-white" : "px-4 py-2 rounded-full text-sm font-semibold border border-[var(--color-border)] hover:border-[var(--color-brand)] transition-colors"}>
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <ProductGrid products={products} />
      </section>

      {/* Trust Bar */}
      <section className="border-t border-[var(--color-border)] py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="text-center">
              <div className="text-2xl mb-2">🚚</div>
              <div className="font-semibold text-sm">Ücretsiz Kargo</div>
              <div className="text-xs text-[var(--color-muted)]">Türkiye geneli</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔧</div>
              <div className="font-semibold text-sm">Ücretsiz Montaj</div>
              <div className="text-xs text-[var(--color-muted)]">Profesyonel ekip</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">↩️</div>
              <div className="font-semibold text-sm">14 Gün İade</div>
              <div className="text-xs text-[var(--color-muted)]">Koşulsuz değişim</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💳</div>
              <div className="font-semibold text-sm">9 Taksit</div>
              <div className="text-xs text-[var(--color-muted)]">Tüm kartlara</div>
            </div>
        </div>
      </section>
    </StoreShell>
  );
}
