'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import ReelCard from './ReelCard'

interface ReelsViewerProps {
  reels: any[]
  currentUserId: string
  initialLikedReelIds: string[]
}

export default function ReelsViewer({
  reels,
  currentUserId,
  initialLikedReelIds
}: ReelsViewerProps) {
  const [activeReelIndex, setActiveReelIndex] = useState(0)
  const [likedReelIds, setLikedReelIds] = useState<Set<string>>(
    new Set(initialLikedReelIds)
  )
  const [reelsList, setReelsList] = useState(reels)
  const containerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const viewedReels = useRef<Set<string>>(new Set())

  // Disable pull-to-refresh on mobile
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (containerRef.current && containerRef.current.scrollTop === 0) {
        e.preventDefault()
      }
    }

    document.addEventListener('touchmove', preventDefault, { passive: false })
    return () => document.removeEventListener('touchmove', preventDefault)
  }, [])

  // Intersection Observer for active video detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'))
            setActiveReelIndex(index)
            
            // Increment view count
            const reelId = reels[index]?.id
            if (reelId && !viewedReels.current.has(reelId)) {
              viewedReels.current.add(reelId)
              incrementViewCount(reelId)
            }
          }
        })
      },
      {
        threshold: 0.5,
        root: containerRef.current
      }
    )

    const items = document.querySelectorAll('.reel-item')
    items.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [reels])

  const incrementViewCount = async (reelId: string) => {
    try {
      await supabase.rpc('increment_reel_views', { reel_id: reelId })
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  const handleLikeToggle = async (reelId: string, index: number) => {
    const isLiked = likedReelIds.has(reelId)

    // Optimistic update
    const newLikedReelIds = new Set(likedReelIds)
    if (isLiked) {
      newLikedReelIds.delete(reelId)
    } else {
      newLikedReelIds.add(reelId)
    }
    setLikedReelIds(newLikedReelIds)

    // Update UI immediately
    setReelsList((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        likes_count: updated[index].likes_count + (isLiked ? -1 : 1)
      }
      return updated
    })

    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('reel_likes')
          .delete()
          .eq('reel_id', reelId)
          .eq('user_id', currentUserId)
      } else {
        // Like
        await supabase.from('reel_likes').insert({
          reel_id: reelId,
          user_id: currentUserId
        })
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      // Revert on error
      setLikedReelIds(likedReelIds)
      setReelsList(reels)
    }
  }

  return (
    <div
      ref={containerRef}
      className="reels-container fixed inset-0 overflow-y-scroll snap-y snap-mandatory bg-black"
      style={{
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {reelsList.map((reel, index) => (
        <div key={reel.id} data-index={index}>
          <ReelCard
            reel={reel}
            isActive={index === activeReelIndex}
            isLiked={likedReelIds.has(reel.id)}
            onLikeToggle={() => handleLikeToggle(reel.id, index)}
            currentUserId={currentUserId}
          />
        </div>
      ))}

      {/* Custom CSS for safe area */}
      <style jsx global>{`
        .pt-safe {
          padding-top: env(safe-area-inset-top);
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        /* Hide scrollbar */
        .reels-container::-webkit-scrollbar {
          display: none;
        }
        .reels-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Disable overscroll bounce */
        .reels-container {
          overscroll-behavior: contain;
        }
      `}</style>
    </div>
  )
}
