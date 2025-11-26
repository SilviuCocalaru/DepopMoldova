'use client'

import { useState, useRef, useEffect } from 'react'
import { Heart, MessageCircle, Share2, Volume2, VolumeX } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

interface ReelCardProps {
  reel: {
    id: string
    video_url: string
    description: string | null
    clothing_style: string | null
    likes_count: number
    views_count: number
    user_id: string
    profiles: {
      username: string
      avatar_url: string | null
    } | null
  }
  isActive: boolean
  isLiked: boolean
  onLikeToggle: () => void
  currentUserId?: string
}

export default function ReelCard({
  reel,
  isActive,
  isLiked,
  onLikeToggle,
  currentUserId
}: ReelCardProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showLikeAnimation, setShowLikeAnimation] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoRef.current) return

    if (isActive) {
      videoRef.current.play().catch(() => {})
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [isActive])

  const handleVideoClick = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleDoubleClick = () => {
    if (!isLiked) {
      onLikeToggle()
      setShowLikeAnimation(true)
      setTimeout(() => setShowLikeAnimation(false), 1000)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: reel.description || 'Check out this reel!',
          url: window.location.href
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    }
  }

  return (
    <div className="reel-item relative w-full h-screen snap-start bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.video_url}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        playsInline
        muted={isMuted}
        onClick={handleVideoClick}
        onDoubleClick={handleDoubleClick}
      />

      {/* Double-tap heart animation */}
      {showLikeAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <Heart className="w-32 h-32 text-white fill-white animate-ping" />
        </div>
      )}

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 pt-safe z-40">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <Link href="/" className="text-white text-xl font-bold">
            ← Reels
          </Link>
          <Link
            href="/sell/reel"
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
              <path d="M23 7l-7 5 7 5V7z"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-24 z-40 flex flex-col items-center gap-6">
        {/* Profile Picture */}
        <Link href={`/profile/${reel.user_id}`}>
          <div className="relative">
            {reel.profiles?.avatar_url ? (
              <Image
                src={reel.profiles.avatar_url}
                alt={reel.profiles.username}
                width={48}
                height={48}
                className="rounded-full border-2 border-white"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 border-2 border-white flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {reel.profiles?.username[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Like Button */}
        <button
          onClick={onLikeToggle}
          className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
        >
          <Heart
            className={`w-8 h-8 ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-white'
            }`}
          />
          <span className="text-white text-xs font-semibold">
            {reel.likes_count}
          </span>
        </button>

        {/* Comment Button */}
        <button className="flex flex-col items-center gap-1">
          <MessageCircle className="w-8 h-8 text-white" />
          <span className="text-white text-xs font-semibold">0</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1"
        >
          <Share2 className="w-8 h-8 text-white" />
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-black/40 backdrop-blur-sm"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 pb-safe z-40">
        <div className="px-4 pb-6 pt-8 bg-gradient-to-t from-black/60 to-transparent">
          <Link href={`/profile/${reel.user_id}`}>
            <p className="text-white font-bold mb-2">
              @{reel.profiles?.username}
            </p>
          </Link>
          {reel.description && (
            <p className="text-white text-sm mb-2 line-clamp-2">
              {reel.description}
            </p>
          )}
          {reel.clothing_style && (
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium">
                #{reel.clothing_style}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tap to unmute indicator */}
      {isMuted && isPlaying && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <div className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium animate-pulse">
            Tap to unmute
          </div>
        </div>
      )}
    </div>
  )
}
