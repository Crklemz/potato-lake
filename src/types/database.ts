// Database model types for TypeScript
export interface HomePageImage {
  id: number
  homePageId: number
  url: string
  altText: string | null
  caption: string | null
  order: number
  createdAt: Date
}

export interface HomePage {
  id: number
  heroTitle: string
  heroSubtitle: string | null
  heroImageUrl: string | null
  introHeading: string
  introText: string
  subHeading: string | null
  carouselImages: HomePageImage[]
  alertBanner: string | null
  alertBannerActive: boolean
  latestNewsHeading: string | null
  upcomingEventsHeading: string | null
  membershipHeading: string | null
  membershipText: string | null
  membershipButtonText: string | null
  communityHeading: string | null
  communityText: string | null
  updatedAt: Date
}

export interface Resort {
  id: number
  resortsPageId: number
  name: string
  address: string
  phone: string
  description: string | null
  websiteUrl: string | null
  imageUrl: string | null
}

export interface ResortsPage {
  id: number
  sectionHeading: string
  sectionText: string
  resorts: Resort[]
  updatedAt: Date
}

export interface FishingPage {
  id: number
  fishHeading: string
  fishText: string
  imageUrl: string | null
  updatedAt: Date
}

export interface DnrPage {
  id: number
  dnrHeading: string
  dnrText: string
  mapUrl: string | null
  updatedAt: Date
}

export interface Event {
  id: number
  newsPageId: number
  title: string
  date: Date
  description: string
  imageUrl: string | null
}

export interface NewsPage {
  id: number
  mainHeading: string
  events: Event[]
  updatedAt: Date
}

export interface Sponsor {
  id: number
  areaServicesPageId: number
  name: string
  logoUrl: string | null
  link: string | null
}

export interface AreaServicesPage {
  id: number
  heading: string
  description: string
  sponsors: Sponsor[]
  updatedAt: Date
}

export interface AssociationPage {
  id: number
  heading: string
  description: string
  meetingNotes: string | null
  contactEmail: string | null
  updatedAt: Date
} 