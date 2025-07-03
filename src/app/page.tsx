"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Play, SkipBack, SkipForward, Volume2, TrendingDown, DollarSign, StickyNote } from "lucide-react"

interface CardPosition {
  x: number
  y: number
}

interface Card {
  id: string
  type: "finance" | "music" | "notes"
  position: CardPosition
}

export default function HomePage() {
  const [cards, setCards] = useState<Card[]>([
    { id: "finance", type: "finance", position: { x: 0, y: 0 } },
    { id: "music", type: "music", position: { x: 0, y: 0 } },
    { id: "notes", type: "notes", position: { x: 0, y: 0 } },
  ])
  const [isDragging, setIsDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Track screen size
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight })
    }

    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [])

  // Position cards on initial load
  useEffect(() => {
    const positionCards = () => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      // Responsive spacing and card dimensions
      const getSpacing = () => {
        if (window.innerWidth < 640) return 150 // Mobile: increased from 120 to 150
        if (window.innerWidth < 1024) return 220 // Tablet: increased from 180 to 220
        return 300 // Desktop: increased from 250 to 300
      }

      const getCardWidth = () => {
        if (window.innerWidth < 640) return 180 // Mobile: small cards
        if (window.innerWidth < 1024) return 220 // Tablet: medium cards
        return 256 // Desktop: full size
      }

      const spacing = getSpacing()
      const cardWidth = getCardWidth()
      const cardOffset = cardWidth / 2

      // Adjust vertical positioning based on screen size
      const baseY = window.innerWidth < 640 ? centerY - 50 : centerY - 20

      setCards((prevCards) =>
        prevCards.map((card) => {
          switch (card.type) {
            case "finance":
              // Top of triangle (center)
              return { ...card, position: { x: centerX - cardOffset, y: baseY } }
            case "music":
              // Bottom left of triangle
              return {
                ...card,
                position: {
                  x: centerX - cardOffset - spacing,
                  y: baseY + (window.innerWidth < 640 ? 160 : 200), // Increased vertical spacing
                },
              }
            case "notes":
              // Bottom right of triangle
              return {
                ...card,
                position: {
                  x: centerX - cardOffset + spacing,
                  y: baseY + (window.innerWidth < 640 ? 160 : 200), // Increased vertical spacing
                },
              }
            default:
              return card
          }
        }),
      )
    }

    if (screenSize.width > 0) {
      positionCards()
    }
  }, [screenSize])

  const handleMouseDown = (e: React.MouseEvent, cardId: string) => {
    const cardElement = cardRefs.current[cardId]
    if (!cardElement) return

    const rect = cardElement.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(cardId)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    // Constrain dragging to screen bounds
    const cardElement = cardRefs.current[isDragging]
    if (!cardElement) return

    const rect = cardElement.getBoundingClientRect()
    const maxX = window.innerWidth - rect.width
    const maxY = window.innerHeight - rect.height

    const newX = Math.max(0, Math.min(maxX, e.clientX - dragOffset.x))
    const newY = Math.max(0, Math.min(maxY, e.clientY - dragOffset.y))

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === isDragging
          ? {
              ...card,
              position: { x: newX, y: newY },
            }
          : card,
      ),
    )
  }

  const handleMouseUp = () => {
    setIsDragging(null)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  const renderCard = (card: Card) => {
    const isMobile = screenSize.width < 640
    const isTablet = screenSize.width >= 640 && screenSize.width < 1024

    const cardWidthClass = isMobile ? "w-45" : isTablet ? "w-55" : "w-64"
    const paddingClass = isMobile ? "p-3" : "p-4"

    const baseClasses = `bg-white rounded-lg shadow-lg cursor-move select-none transition-shadow duration-200 fixed z-10 ${
      isDragging === card.id ? "shadow-2xl scale-105" : "hover:shadow-xl"
    } ${cardWidthClass} ${paddingClass}`

    switch (card.type) {
      case "finance":
        return (
          <div
            key={card.id}
            // @ts-expect-error - TODO: fix this
            ref={(el) => (cardRefs.current[card.id] = el)}
            className={baseClasses}
            style={{
              left: `${card.position.x}px`,
              top: `${card.position.y}px`,
              transition: isDragging === card.id ? "none" : "box-shadow 0.2s ease-out, transform 0.2s ease-out",
              width: isMobile ? "180px" : isTablet ? "220px" : "256px",
            }}
            onMouseDown={(e) => handleMouseDown(e, card.id)}
          >
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-green-600`} />
              <h3 className={`font-semibold text-gray-800 ${isMobile ? "text-sm" : "text-base"}`}>
                {isMobile ? "Balance" : "Account Balance"}
              </h3>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className={`${isMobile ? "text-xs" : "text-xs"} text-gray-500 mb-1`}>
                  {isMobile ? "Checking" : "Checking Account"}
                </div>
                <div className={`${isMobile ? "text-lg" : "text-xl"} font-bold text-gray-800`}>$4,250.32</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className={`${isMobile ? "text-xs" : "text-xs"} text-gray-500 mb-1`}>
                  {isMobile ? "Savings" : "Savings Account"}
                </div>
                <div className={`${isMobile ? "text-lg" : "text-xl"} font-bold text-gray-800`}>$12,847.65</div>
              </div>
              {!isMobile && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Monthly Spending</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">$2,340</span>
                    <TrendingDown className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">-12%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "music":
        return (
          <div
            key={card.id}
            // @ts-expect-error - TODO: fix this
            ref={(el) => (cardRefs.current[card.id] = el)}
            className={baseClasses}
            style={{
              left: `${card.position.x}px`,
              top: `${card.position.y}px`,
              transition: isDragging === card.id ? "none" : "box-shadow 0.2s ease-out, transform 0.2s ease-out",
              width: isMobile ? "180px" : isTablet ? "220px" : "256px",
            }}
            onMouseDown={(e) => handleMouseDown(e, card.id)}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`${isMobile ? "w-10 h-10" : "w-12 h-12"} bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center`}
                >
                  <span className={`text-white font-bold ${isMobile ? "text-base" : "text-lg"}`}>♪</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-gray-800 ${isMobile ? "text-xs" : "text-sm"} truncate`}>
                    {isMobile ? "Blinding Lights" : "Blinding Lights"}
                  </h3>
                  <p className={`${isMobile ? "text-xs" : "text-xs"} text-gray-600 truncate`}>The Weeknd</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <SkipBack
                  className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-gray-600 cursor-pointer hover:text-gray-800`}
                />
                <Play
                  className={`${isMobile ? "w-5 h-5" : "w-6 h-6"} text-gray-800 cursor-pointer hover:text-gray-600`}
                />
                <SkipForward
                  className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-gray-600 cursor-pointer hover:text-gray-800`}
                />
                <Volume2
                  className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-gray-600 cursor-pointer hover:text-gray-800`}
                />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-purple-500 h-1 rounded-full" style={{ width: "45%" }}></div>
              </div>
              <div className={`flex justify-between ${isMobile ? "text-xs" : "text-xs"} text-gray-500`}>
                <span>1:45</span>
                <span>3:52</span>
              </div>
            </div>
          </div>
        )

      case "notes":
        return (
          <div
            key={card.id}
            // @ts-expect-error - TODO: fix this
            ref={(el) => (cardRefs.current[card.id] = el)}
            className={baseClasses}
            style={{
              left: `${card.position.x}px`,
              top: `${card.position.y}px`,
              transition: isDragging === card.id ? "none" : "box-shadow 0.2s ease-out, transform 0.2s ease-out",
              width: isMobile ? "180px" : isTablet ? "220px" : "256px",
            }}
            onMouseDown={(e) => handleMouseDown(e, card.id)}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <StickyNote className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-yellow-600`} />
                <h3 className={`font-semibold text-gray-800 ${isMobile ? "text-sm" : "text-base"}`}>
                  {isMobile ? "Notes" : "Quick Notes"}
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  "Team meeting at 2 PM today",
                  "Review project proposal",
                  "Call dentist for appointment",
                  "Pick up dry cleaning",
                ]
                  .slice(0, isMobile ? 3 : 4)
                  .map((note, index) => (
                    <div key={index} className={`${isMobile ? "text-xs" : "text-sm"} text-gray-700`}>
                      • {isMobile ? note.substring(0, 20) + (note.length > 20 ? "..." : "") : note}
                    </div>
                  ))}
              </div>
              <div className="mt-3 pt-2 border-t border-gray-200">
                <input
                  type="text"
                  placeholder="Add a note..."
                  className={`w-full ${isMobile ? "text-xs" : "text-sm"} text-gray-600 bg-transparent border-none outline-none`}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className="min-h-screen bg-gray-800 relative overflow-hidden cursor-default"
      style={{
        backgroundImage: `
          radial-gradient(circle, #9ca3af 1px, transparent 1px)
        `,
        backgroundSize: `${screenSize.width < 640 ? "30px 30px" : "40px 40px"}`,
        backgroundPosition: "0 0",
      }}
    >
      {/* Title */}
      <div className="flex flex-col items-center pt-8 md:pt-20">
        <h1
          className={`${screenSize.width < 640 ? "text-4xl" : screenSize.width < 1024 ? "text-5xl" : "text-6xl"} font-bold text-white mb-8 md:mb-16 tracking-tight`}
        >
          P_Board
        </h1>

        {/* Coming Soon Tooltip with Sheen Animation */}
        <div className="mb-4 md:mb-8 relative">
          <div
            className={`bg-gray-700 text-gray-300 px-3 py-1 rounded-full ${screenSize.width < 640 ? "text-xs" : "text-sm"} font-medium border border-gray-600 relative overflow-hidden`}
          >
            Coming soon
            {/* Animated sheen effect - thin but travels full width */}
            <div className="absolute top-0 bottom-0 w-8 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-sheen"></div>
          </div>
        </div>
      </div>

      {/* Everything in One Place Header */}
      <div className="flex justify-center mb-8 md:mb-12">
        <div className="bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl px-6 py-3 md:px-8 md:py-4">
          <h2
            className={`text-white font-semibold text-center ${screenSize.width < 640 ? "text-lg" : "text-xl md:text-2xl"}`}
          >
            Everything in One Place
          </h2>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mt-2"></div>
        </div>
      </div>

      {/* Render all cards */}
      {cards.map((card) => renderCard(card))}

      {/* Subtle hint text */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2">
        <p className={`text-gray-400 ${screenSize.width < 640 ? "text-xs" : "text-sm"}`}>Drag the widgets around</p>
      </div>

      <style jsx>{`
  @keyframes sheen {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(calc(100vw + 2rem));
    }
  }

  .animate-sheen {
    animation: sheen 4s ease-in-out infinite;
    animation-delay: 1s;
  }
`}</style>
    </div>
  )
}
