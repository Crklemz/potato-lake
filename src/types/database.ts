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
  heroTitle: string
  heroSubtitle: string | null
  heroImageUrl: string | null
  ctaText: string | null
  ctaLink: string | null
  introHeading: string
  introText: string
  footerHeading: string | null
  footerSubheading: string | null
  footerLinkText: string | null
  footerLinkUrl: string | null
  resorts: Resort[]
  updatedAt: Date
}

export interface FishSpecies {
  id: number
  name: string
  order: number
  fishingPageId: number | null
  description: string | null
  bait: string | null
  timeOfDay: string | null
  weather: string | null
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface FishingGalleryImage {
  id: number
  fishingPageId: number
  imageUrl: string
  altText: string
  caption: string | null
  order: number
  createdAt: Date
}

export interface FishingRegulationLink {
  text: string
  url: string
}

export interface FishingTip {
  id: number
  text: string
  submittedBy: string | null
  order: number
  fishingPageId: number
  createdAt: Date
  updatedAt: Date
}

export interface FishingPage {
  id: number
  fishHeading: string
  fishText: string
  heroTitle: string
  heroSubtitle: string | null
  heroImageUrl: string | null
  ctaText: string | null
  ctaLink: string | null
  regulationsHeading: string | null
  regulationsText: string | null
  regulationsCtaText: string | null
  regulationsCtaLink: string | null
  fishingReportHeading: string | null
  fishingReportText: string | null
  fishingReportDate: Date | null
  fishingCtaHeading: string | null
  fishingCtaText: string | null
  fishingCtaButtonText: string | null
  fishingCtaButtonLink: string | null
  infoSectionHeading: string | null
  infoSectionSubheading: string | null
  regulationsLabel: string | null
  regulationsTextNew: string | null
  regulationsLinkText: string | null
  regulationsLinkUrl: string | null
  reportLabel: string | null
  reportTextNew: string | null
  reportLastUpdated: Date | null
  fishingRegulationLinks: FishingRegulationLink[] | null
  fishSpecies: FishSpecies[]
  galleryImages: FishingGalleryImage[]
  fishingTips: FishingTip[]
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

export interface News {
  id: number
  newsPageId: number
  title: string
  content: string
  date: Date
  imageUrl: string | null
}

export interface NewsPage {
  id: number
  mainHeading: string
  events: Event[]
  news: News[]
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

export interface Member {
  id: number
  name: string
  tier: string
  isHighlighted: boolean
  updatedAt: Date
}

export interface CommunityStory {
  id: number
  title: string
  content: string
  authorName: string
  authorEmail: string
  imageUrl?: string | null
  isApproved: boolean
  createdAt: Date
  updatedAt: Date
} 