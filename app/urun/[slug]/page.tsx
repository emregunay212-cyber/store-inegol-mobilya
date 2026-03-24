import { getStore, getProduct } from "@/lib/supabase";
import StoreShell from "@/components/StoreShell";
import AddToCartButton from "@/components/AddToCartButton";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

function formatPrice(p: number) {
  return new Intl.NumberFormat("tr-TR").format(p);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStore();
  if (!store) return notFound();

  const product = await getProduct(slug);
  if (!product) return notFound();

  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;

  return (
    <StoreShell store={store}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-sm text-[var(--color-muted)] mb-6">
          <Link href="/" className="hover:text-[var(--color-accent)]">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--color-border)]/40 to-[var(--color-border)]/10">
            {product.images && product.images[0] ? (
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl">🛋️</div>
            )}
            {discount > 0 && (
              <span className="absolute top-4 right-4 bg-[var(--color-accent)] text-white text-sm font-bold px-3 py-1 rounded">%{discount}</span>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-sm tracking-widest uppercase text-[var(--color-muted)] mb-2">{product.categories?.name || "Genel"}</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            {product.description && <p className="text-[var(--color-muted)] mb-6 leading-relaxed">{product.description}</p>}

            <div className="mb-6">
              {product.old_price && <span className="price-old text-lg text-[var(--color-muted)] mr-3">{formatPrice(product.old_price)} ₺</span>}
              <span className="text-3xl font-bold text-[var(--color-accent)]">{formatPrice(product.price)} ₺</span>
            </div>

            <p className={`text-sm font-semibold mb-6 ${product.in_stock ? "text-green-600" : "text-red-500"}`}>
              {product.in_stock ? "✓ Stokta" : "✕ Stokta Yok"}
            </p>

            <AddToCartButton product={product} />

            {store.whatsapp && (
              <a href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(`Merhaba, ${product.name} hakkında bilgi almak istiyorum.`)}`} target="_blank" rel="noopener noreferrer" className="mt-4 w-full py-3.5 rounded-xl border-2 border-green-600 text-green-700 font-bold text-sm text-center block hover:bg-green-50 transition-colors">
                💬 WhatsApp ile Bilgi Al
              </a>
            )}
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
