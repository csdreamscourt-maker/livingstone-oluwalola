import Image from 'next/image';

type FounderPortraitProps = {
  src: string;
  alt: string;
  aspect?: 'portrait' | 'tall' | 'square';
  priority?: boolean;
  caption?: string;
  eyebrow?: string;
  className?: string;
  sizes?: string;
};

const aspectClass: Record<NonNullable<FounderPortraitProps['aspect']>, string> = {
  portrait: 'aspect-[4/5]',
  tall: 'aspect-[3/4.2]',
  square: 'aspect-square',
};

export function FounderPortrait({
  src,
  alt,
  aspect = 'portrait',
  priority = false,
  caption,
  eyebrow,
  className = '',
  sizes = '(min-width: 1024px) 480px, 90vw',
}: FounderPortraitProps) {
  return (
    <figure className={`group relative w-full overflow-hidden rounded-2xl border border-midnight-950/10 bg-midnight-950 shadow-xl ${aspectClass[aspect]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, rgba(15,27,61,0) 55%, rgba(15,27,61,0.35) 100%), linear-gradient(to top, rgba(15,27,61,0.55) 0%, rgba(15,27,61,0) 32%)',
        }}
      />
      {(caption || eyebrow) && (
        <figcaption className="absolute inset-x-0 bottom-0 p-5">
          {eyebrow && (
            <span className="mb-1 block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-gold-300">
              {eyebrow}
            </span>
          )}
          {caption && (
            <span className="block text-[13.5px] font-medium leading-5 text-white/90">
              {caption}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
