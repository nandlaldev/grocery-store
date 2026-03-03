import { useState, useEffect } from 'react';
import type { BannerItem } from '../lib/api';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function BannerSlider({ banners }: { banners: BannerItem[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const src = (url: string) =>
    url.startsWith('http') ? url : `${API_BASE}${url}`;

  return (
    <section className="mb-6 rounded-xl overflow-hidden bg-gray-100 relative">
      <div className="relative aspect-[3/1] min-h-[140px] w-full overflow-hidden">
        {banners.map((b, i) => (
          <div
            key={b.id}
            className="absolute inset-0 transition-opacity duration-500 ease-out"
            style={{
              opacity: i === index ? 1 : 0,
              zIndex: i === index ? 1 : 0,
            }}
          >
            <img
              src={src(b.imageUrl)}
              alt={b.title || 'Banner'}
              className="w-full h-full object-cover"
            />
            {(b.title || b.subtitle) && (
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/30 text-white px-4 text-center">
                {b.title && (
                  <h2 className="text-2xl md:text-3xl font-bold">{b.title}</h2>
                )}
                {b.subtitle && (
                  <p className="mt-1 text-lg opacity-90">{b.subtitle}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + banners.length) % banners.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-800 hover:bg-white"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % banners.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-800 hover:bg-white"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === index ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
