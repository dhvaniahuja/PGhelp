import Image from 'next/image'

const POINTS = [
  {
    title: 'Campus first',
    body: 'Every search begins with your college, so results stay relevant to the commute you actually make.',
  },
  {
    title: 'PGs, hostels and flats',
    body: 'Compare food-included PGs, budget hostels and shared flats side by side, with the filters students ask for.',
  },
  {
    title: 'Honest by default',
    body: 'Until listings are verified, we label everything as sample content. No invented reviews, ever.',
  },
]

export function CitySection() {
  return (
    <section aria-labelledby="city-heading" className="bg-secondary/60 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-8 lg:gap-20">
        <figure className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="/images/bangalore-temple-skyline.png"
              alt="A painted temple gopuram beside a high-rise under construction and a coconut palm in Bangalore"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="scale-[1.05] object-cover"
            />
          </div>
          <figcaption className="mt-3 text-xs text-muted-foreground">
            Old and new Bangalore, side by side.
          </figcaption>
        </figure>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Made for this city</p>
          <h2 id="city-heading" className="mt-2 text-balance font-serif text-4xl font-medium tracking-tight md:text-5xl">
            A city that keeps changing. A home that shouldn&apos;t be hard to find.
          </h2>
          <ul className="mt-10 flex flex-col gap-8">
            {POINTS.map((point, i) => (
              <li key={point.title} className="flex gap-5">
                <span className="font-serif text-2xl text-primary" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-semibold">{point.title}</h3>
                  <p className="mt-1 text-pretty leading-relaxed text-muted-foreground">{point.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
