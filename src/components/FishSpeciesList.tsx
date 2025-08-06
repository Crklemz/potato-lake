'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { FishSpecies } from '@/types/database'

interface FishSpeciesListProps {
  fishSpecies: FishSpecies[]
}

export default function FishSpeciesList({ fishSpecies }: FishSpeciesListProps) {
  const [selectedSpecies, setSelectedSpecies] = useState<FishSpecies | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Set the first fish as selected by default
  useEffect(() => {
    if (fishSpecies.length > 0 && !selectedSpecies) {
      setSelectedSpecies(fishSpecies[0])
    }
  }, [fishSpecies, selectedSpecies])

  const handleSpeciesClick = (species: FishSpecies) => {
    setSelectedSpecies(species)
  }

  if (fishSpecies.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-center text-neutral-dark">
            No fish species have been added yet. Check back soon!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Helper text */}
        <p className="text-sm text-neutral-dark mb-4 text-center">
          Click a fish to view details
        </p>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Fish Species List - Left Side */}
          <div className="lg:w-1/3">
            <h3 className="text-lg font-semibold text-primary mb-4">Fish Species</h3>
            <ul className="space-y-2">
              {fishSpecies.map((species) => (
                <li key={species.id}>
                  <button
                    onClick={() => handleSpeciesClick(species)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      selectedSpecies?.id === species.id
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-neutral-light hover:bg-neutral-dark hover:text-white text-neutral-dark'
                    }`}
                  >
                    <span className="font-medium">{species.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Detail Panel - Right Side */}
          <div className="lg:w-2/3">
            {selectedSpecies ? (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-primary">{selectedSpecies.name}</h3>
                
                {/* Fish Image */}
                {selectedSpecies.imageUrl && (
                  <div className="aspect-[4/3] rounded-lg overflow-hidden">
                    <Image 
                      src={selectedSpecies.imageUrl} 
                      alt={selectedSpecies.name}
                      width={600}
                      height={450}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                {/* Fish Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedSpecies.description && (
                    <div>
                      <h4 className="font-semibold text-neutral-dark mb-2">Description</h4>
                      <p className="text-neutral-dark leading-relaxed">{selectedSpecies.description}</p>
                    </div>
                  )}
                  
                  {selectedSpecies.bait && (
                    <div>
                      <h4 className="font-semibold text-neutral-dark mb-2">Recommended Bait</h4>
                      <p className="text-neutral-dark leading-relaxed">{selectedSpecies.bait}</p>
                    </div>
                  )}
                  
                  {selectedSpecies.timeOfDay && (
                    <div>
                      <h4 className="font-semibold text-neutral-dark mb-2">Best Time to Fish</h4>
                      <p className="text-neutral-dark leading-relaxed">{selectedSpecies.timeOfDay}</p>
                    </div>
                  )}
                  
                  {selectedSpecies.weather && (
                    <div>
                      <h4 className="font-semibold text-neutral-dark mb-2">Ideal Weather Conditions</h4>
                      <p className="text-neutral-dark leading-relaxed">{selectedSpecies.weather}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-neutral-dark">Select a fish species to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 