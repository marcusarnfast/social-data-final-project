const CRIMES = [
  {
    slug: "arson",
    title: "ARSON",
    titleClass: "text-2xl",
    blurb: "Redecorating with fire. No permit, no problem.",
  },
  {
    slug: "assault",
    title: "ASSAULT",
    titleClass: "text-xl",
    blurb: "Conflict resolution for people who skipped the seminar.",
  },
  {
    slug: "burglary",
    title: "BURGLARY",
    titleClass: "text-xl",
    blurb: "The original unannounced home visit.",
  },
  {
    slug: "drug-offense",
    title: "DRUG OFFENSE",
    titleClass: "text-xl",
    blurb: "Unlicensed pharmacist. Excellent customer retention.",
  },
  {
    slug: "larceny",
    title: "LARCENY",
    titleClass: "text-xl",
    blurb: "Borrows things. Has never heard of giving them back.",
  },
  {
    slug: "motor-vehicle-theft",
    title: "VEHICLE THEFT",
    titleClass: "text-xl",
    blurb: "Free test drive. One-way trip. No Yelp review.",
  },
  {
    slug: "prostitution",
    title: "PROSTITUTION",
    titleClass: "text-xl",
    blurb: "Oldest profession. Still no pension plan.",
  },
  {
    slug: "robbery",
    title: "ROBBERY",
    titleClass: "text-xl",
    blurb: "Why be subtle when you can just ask aggressively?",
  },
] as const

export function FocusCrimesSection() {
  return (
    <section className="w-full px-4 py-12">
      <div className="mx-auto w-full max-w-7xl bg-stone-200 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-3xl font-bold text-stone-950">
            Focus crimes
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CRIMES.map((crime) => (
            <div
              key={crime.slug}
              className="group flex cursor-pointer flex-col items-center bg-stone-300 p-5 text-center text-balance transition-all duration-300 hover:bg-stone-900"
            >
              <img
                src={`/focus-crimes/${crime.slug}.svg`}
                alt=""
                className="mb-3 size-32 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
              />
              <p
                className={`font-heading tracking-wide transition-colors duration-300 group-hover:text-white ${crime.titleClass}`}
              >
                {crime.title}
              </p>
              <p className="mt-1 font-sans text-sm text-stone-600 transition-colors duration-300 group-hover:text-stone-400">
                {crime.blurb}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
