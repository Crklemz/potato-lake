import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get or create fishing page
  let fishingPage = await prisma.fishingPage.findFirst()
  if (!fishingPage) {
    fishingPage = await prisma.fishingPage.create({
      data: {
        fishHeading: 'Excellent Fishing Opportunities',
        fishText: 'Potato Lake is renowned for its excellent fishing opportunities. The lake is home to a variety of fish species including walleye, northern pike, bass, and panfish. Whether you\'re an experienced angler or just starting out, you\'ll find plenty of great spots to cast your line.',
        imageUrl: null
      }
    })
  }

  const fishSpeciesData = [
    {
      name: 'Muskellunge (Musky)',
      icon: '🐟',
      order: 1,
      description: 'A large, elusive predator prized by sport anglers.',
      bait: 'Large crankbaits, live suckers, jerkbaits',
      timeOfDay: 'Early morning or late evening',
      weather: 'Overcast days or after a cold front',
      imageUrl: null
    },
    {
      name: 'Northern Pike',
      icon: '🐟',
      order: 2,
      description: 'Aggressive ambush predators with sharp teeth.',
      bait: 'Spinnerbaits, spoons, live bait',
      timeOfDay: 'Morning and afternoon',
      weather: 'Cool, overcast, or slightly windy',
      imageUrl: null
    },
    {
      name: 'Walleye',
      icon: '🐟',
      order: 3,
      description: 'Popular eating fish known for being finicky biters.',
      bait: 'Jigs with minnows, crankbaits, nightcrawlers',
      timeOfDay: 'Dusk and nighttime',
      weather: 'Cloudy or low-light conditions',
      imageUrl: null
    },
    {
      name: 'Largemouth Bass',
      icon: '🐟',
      order: 4,
      description: 'Hard-fighting fish often found near cover.',
      bait: 'Plastic worms, topwater lures, crankbaits',
      timeOfDay: 'Early morning or late afternoon',
      weather: 'Warm, partly cloudy',
      imageUrl: null
    },
    {
      name: 'Smallmouth Bass',
      icon: '🐟',
      order: 5,
      description: 'Pound for pound, one of the strongest fighters.',
      bait: 'Tube baits, jigs, spinnerbaits',
      timeOfDay: 'Mid-morning to afternoon',
      weather: 'Clear water, moderate temps',
      imageUrl: null
    },
    {
      name: 'Bluegill',
      icon: '🐟',
      order: 6,
      description: 'Abundant and easy to catch—great for kids.',
      bait: 'Worms, crickets, small jigs',
      timeOfDay: 'Midday',
      weather: 'Sunny, calm days',
      imageUrl: null
    },
    {
      name: 'Crappie',
      icon: '🐟',
      order: 7,
      description: 'Schooling panfish known for great taste.',
      bait: 'Minnows, small jigs',
      timeOfDay: 'Dawn and dusk',
      weather: 'Overcast or stable pressure',
      imageUrl: null
    },
    {
      name: 'Pumpkinseed Sunfish',
      icon: '🐟',
      order: 8,
      description: 'Colorful, aggressive fish found near shore.',
      bait: 'Worms, small flies, beetle spins',
      timeOfDay: 'Late morning to early evening',
      weather: 'Warm and sunny',
      imageUrl: null
    },
    {
      name: 'Yellow Perch',
      icon: '🐟',
      order: 9,
      description: 'Tasty schooling fish often found near structure.',
      bait: 'Minnows, worms, ice jigs',
      timeOfDay: 'Morning and evening',
      weather: 'Mild, partly cloudy',
      imageUrl: null
    },
    {
      name: 'Catfish',
      icon: '🐟',
      order: 10,
      description: 'Bottom dwellers with a keen sense of smell.',
      bait: 'Stink bait, cut bait, chicken liver',
      timeOfDay: 'Nighttime',
      weather: 'Warm, humid, low-light',
      imageUrl: null
    },
    {
      name: 'Bullheads',
      icon: '🐟',
      order: 11,
      description: 'Small catfish species, great for beginners.',
      bait: 'Worms, doughballs, cut bait',
      timeOfDay: 'Evening or night',
      weather: 'Warm and calm',
      imageUrl: null
    }
  ]

  // Clear existing fish species
  await prisma.fishSpecies.deleteMany({
    where: {
      fishingPageId: fishingPage.id
    }
  })

  // Create fish species
  for (const speciesData of fishSpeciesData) {
    await prisma.fishSpecies.create({
      data: {
        ...speciesData,
        fishingPageId: fishingPage.id
      }
    })
  }

  console.log('Fish species seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 