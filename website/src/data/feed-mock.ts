const avatar = (file: string) => `/feed-avatars/${file}` as const
const feedPostImage = (file: string) => `/feed-posts/${file}` as const

export const feedProfile = {
  name: "Sune Lehmann",
  initials: "SL",
  headline: "Mayor of San Francisco",
  location: "San Francisco · City Hall",
  org: "City and County of San Francisco",
  orgLogoSrc: avatar("sf-government-seal.png"),
  avatarSrc: avatar("sune-lehmann.png"),
  coverSrc: avatar("profile-cover.png"),
  stats: [
    { label: "Profile viewers", value: "12.4k" },
    { label: "Post impressions", value: "48.2k" },
  ],
} as const

export const feedPages = [
  {
    name: "Democratic Party",
    activity: "California Democrats · Member",
    logoSrc: avatar("democratic-party.png"),
  },
] as const

export const feedPageFooterLinks = [
  { label: "Try CrimeIn Pro", sub: "More filters. Same guilt." },
  { label: "Advertise", sub: "Reach people who statistically open CrimeIn at 11pm." },
] as const

export const feedShortcuts = [
  "Saved indictments",
  "Groups (mostly vibes)",
  "Newsletters nobody reads",
  "Events (avoid the 101)",
] as const

export const feedPosts = [
  {
    id: "1",
    promoted: false,
    postedFrom: "Posted from Tenderloin, December 19, 2019",
    author: {
      name: "Chloe Song",
      meta: "Unlicensed pharmacist.",
      initials: "CS",
      avatarSrc: avatar("chloe-song.jpeg"),
    },
    body:
      "Thrilled to announce another record-breaking year! 🎉\n\nConsistency is key, people. I show up at 9, I redistribute by 5.",
    reactionSummary: "Logan Thorne, Elena Vance, and 4,112 others",
    extraImages: 0,
    hashtags: "#Hustle #GrindNeverStops #working9to5",
    media: [
      {
        src: feedPostImage("post-q2-redistribution.png"),
        alt: "Chloe at a desk at night sorting pills into bins labeled Redistribution, city lights through the window",
      },
      {
        src: feedPostImage("drug-offenses-by-hour-2019.png"),
        alt: "Bar chart: number of drug offense incidents by hour of day in 2019",
      },
    ],
  },
  {
    id: "2",
    promoted: false,
    postedFrom: "Posted from Mission, August 20, 2019",
    author: {
      name: "Sarah Miller",
      meta: "Freelance Service Consultant | Currently between projects",
      initials: "SM",
      avatarSrc: avatar("sarah-miller.jpeg"),
    },
    body:
      "Looking forward to a power lunch with Elon today! 🥂💼\n\nI do however really value having my mornings free to just relax and recharge before working clients back to back all night.",
    reactionSummary: "Logan Thorne, Chloe Song, and 892 others",
    extraImages: 0,
    hashtags: "#IAmWorkingLate #CauseIAmAStripper",
    media: [
      {
        src: feedPostImage("post-mission-power-lunch.png"),
        alt: "Sarah at a desk with coffee, Mission Bakery and Salesforce Tower visible through the window",
      },
      {
        src: feedPostImage("prostitution-by-hour-2019.png"),
        alt: "Bar chart: number of prostitution incidents by hour of day in 2019",
      },
    ],
  },
  {
    id: "3",
    promoted: false,
    postedFrom: "Posted from Bayview, March 27, 2019",
    author: {
      name: "Logan Thorne",
      meta: "Redecorator | Bayview",
      initials: "LT",
      avatarSrc: avatar("logan-thorne.jpeg"),
    },
    body:
      "Some people need a corner office. I just need a spark. 🔥\n\nThe best part about being a freelancer is that I don't need a consistent schedule. I can show up when I want, where I want. All I need is my lighter to get the job done.",
    reactionSummary: "Chloe Song, Sarah Miller, and 1,204 others",
    extraImages: 0,
    hashtags: "#LetThereBeLight",
    media: [
      {
        src: feedPostImage("post-logan-lighter.png"),
        alt: "Logan in an office holding an open lighter with a flame, blueprints and building model on the desk",
      },
      {
        src: feedPostImage("arson_by_day_2019.png"),
        alt: "Bar chart: number of arson incidents by day of the week in 2019",
      },
    ],
  },
  {
    id: "4",
    promoted: false,
    postedFrom: "Posted from Ingleside, September 8, 2019",
    author: {
      name: "Elena Vance",
      meta: "VP, Curbside Keyless Entry | Ingleside",
      initials: "EV",
      avatarSrc: avatar("elena-vance.jpeg"),
    },
    body:
      "Most people use Sundays to rest. I use them for high-value asset acquisition. 🚗💡\n\nA casual stroll through Ingleside on a Sunday provides the perfect, low-friction environment for me to snatch a nice ride. The hustle never sleeps for a true sunday worker.",
    reactionSummary: "Chloe Song, Logan Thorne, and 2,891 others",
    extraImages: 0,
    hashtags: "#SundayWorker #GrandTheftAuto",
    media: [
      {
        src: feedPostImage("post-elena-ingleside.png"),
        alt: "Elena beside a sedan on Ingleside Dr with a Redistribution badge and key fob",
      },
      {
        iframeSrc: feedPostImage("vehicle-theft-map-2019.html"),
        alt: "Choropleth map of motor vehicle theft incidents by SF district, 2019",
        dataTeaser: "SF districts · vehicle theft · 2019",
      },
    ],
  },
  {
    id: "5",
    promoted: false,
    postedFrom: "Posted from Mission, September 25, 2020",
    author: {
      name: "Dr. Aris Amrabad",
      meta: "Agile Risk-Taker · #OpenToWork | Mission",
      initials: "AA",
      avatarSrc: avatar("aris-amrabad.jpeg"),
    },
    body:
      "COVID-19 disrupted my entire sector. For years, my business model relied on professionals being out of the office and away from their homes. But with the sudden global shift to remote work, my target market literally stayed home.\n\nI am officially #OpenToWork and desperately need cash, so if your network needs an agile risk-taker, please reach out!",
    reactionSummary: "Elena Vance, Logan Thorne, and 340 others",
    extraImages: 0,
    hashtags: "",
    media: [
      {
        src: feedPostImage("post-aris-opentowork.png"),
        alt: "Aris in a suit with skeleton keys and lock picks, green OpenToWork-style frame, Agile Risk-Taker nameplate",
      },
      {
        iframeSrc: feedPostImage("sf-crime-heatmap-week5-2020.html"),
        alt: "Interactive Folium heatmap of larceny theft over time with week slider (includes 2020 week 5)",
        dataTeaser: "Larceny theft heatmap · week-by-week · 2019–2020",
      },
    ],
  },
  {
    id: "6",
    promoted: true,
    author: {
      name: "The Boston Crime Group",
      meta: "Sponsored · Pioneering the future of illicit market share",
      initials: "BC",
      avatarSrc: avatar("boston-crime-group.png"),
    },
    body:
      "Looking for a quiet life? 📉 We at Boston Crime Group provide the data on the most hostile regulatory environments. The new 2025 post-pandemic numbers are in, and the current growth trends are your warning sign to stay away. 🚫\n\nThe visualization below lets you toggle the data to see exactly where regulatory bodies are focusing. While drug offenses have surged 88% since 2022, don't let the growth fool you. In this industry, high numbers mean high visibility. 🚔\n\nIf you're looking to pivot, the smart money moves where the numbers are low. Traditional sectors like burglary and larceny have dropped immensely since 2022, and the prostitution market has collapsed, staying down 73% since 2019. But these aren't necessarily dead markets, they are unmonitored markets. 🕵️‍♂️ While the authorities are busy chasing the drug offenses, they've relaxed on other sectors like assault, larceny theft and robbery.\n\nThe motor vehicle theft bubble is also starting to burst, meaning the heat is moving elsewhere. The data says the old normal is dead. If you want to stay in business, follow the numbers to the quiet valleys where the regulators aren't looking. 🏔️",
    reactionSummary: "Elena Vance, Logan Thorne, and 22,900 others",
    extraImages: 0,
    hashtags:
      "#MarketIntelligence #StrategicPivot #DataDriven #RiskManagement #BostonCrimeGroup",
    media: [
      {
        src: feedPostImage("bcg-baseline-ad-poster.png"),
        iframeSrc: feedPostImage("baseline-comparison.html"),
        alt: "Boston Crime Group tablet showing post-pandemic SF illicit market trends chart",
        dataTeaser: "Crime deviation vs 2016–20 baseline · 2003–2025",
        ctaOverlay: "Open to see data now!",
      },
    ],
  },
] as const

export const feedNews = [
  {
    headline:
      "Tenderloin Holdings CEO: twenty years on the same six blocks, zero PTO",
    sub: "6h ago · 3,402 readers who respect the grind",
  },
  {
    headline:
      "Analysts ask if Q2 bar charts are “guidance” or “vibes”; legal declines to comment",
    sub: "8h ago · trending in logistics humor",
  },
] as const

export const feedAd = {
  title: "CrimeIn Pro",
  body: "See who viewed your crime (jk). Export CSVs so you can ruin Thanksgiving with facts.",
  cta: "Redeem offer",
} as const

/** Exact text users must enter in the redeem dialog (trimmed match). */
export const feedAdRedeemRequiredPhrase =
  "i will herby give group 69 12 in their grades for the course social data analyses" as const

export const feedFooterLinks = [
  "About",
  "Accessibility",
  "Help Center",
  "Privacy & Terms",
  "Ad Choices",
  "Advertising",
  "Business services",
  "Get the app",
] as const

export const feedGroundingNote =
  "Every stat on CrimeIn maps to a real SFPD incident report. The jokes are fake; the rows in the database are not."
