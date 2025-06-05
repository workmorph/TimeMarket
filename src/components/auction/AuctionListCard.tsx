'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Users, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDateTime, getTimeRemaining } from '@/lib/utils'
import { useState, useEffect } from 'react'

export interface AuctionListCardProps {
  auction: {
    id: string
    title: string
    current_highest_bid: number
    starting_price: number
    bid_count: number
    status: string
    ends_at: string
    duration_minutes: number
    expert: {
      id: string
      display_name: string
      avatar_url: string
      average_rating: number
      verification_status: string
    }
  }
}

export function AuctionListCard({ auction }: AuctionListCardProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(auction.ends_at))
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(auction.ends_at))
    }, 1000)
    
    return () => clearInterval(timer)
  }, [auction.ends_at])
  
  const isEnded = timeLeft.total <= 0
  const isEnding = !isEnded && timeLeft.total < 30 * 60 * 1000 // 30分以内
  
  return (
    <Card className={`h-full flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${isEnding && !isEnded ? 'animate-pulse border-red-300 shadow-red-100' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src={auction.expert.avatar_url} alt={auction.expert.display_name} />
              <AvatarFallback className="bg-blue-600 text-white">
                {auction.expert.display_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{auction.expert.display_name}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Star className="w-3 h-3 text-yellow-500 mr-1" />
                {auction.expert.average_rating}
              </div>
            </div>
          </div>
          <Badge 
            variant={isEnded ? "outline" : isEnding ? "destructive" : "secondary"}
            className={isEnding && !isEnded ? "animate-pulse" : ""}
          >
            {isEnded ? "終了" : isEnding ? `残り${timeLeft.hours}時間${timeLeft.minutes}分` : "受付中"}
          </Badge>
        </div>
        
        <CardTitle className="text-lg mt-2 line-clamp-2">
          {auction.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
          <div>
            <div className="text-xs text-muted-foreground">現在価格</div>
            <div className="text-xl font-bold text-blue-600">
              {formatCurrency(auction.current_highest_bid)}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm">
              <Users className="w-4 h-4 mr-1" />
              <span>{auction.bid_count}入札</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDateTime(auction.ends_at)}まで
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Link href={`/auctions/${auction.id}`} className="w-full">
          <Button 
            variant="outline" 
            className={`w-full transition-all duration-300 hover:scale-105 hover:shadow-md motion-reduce:hover:scale-100 motion-reduce:transition-none ${isEnding && !isEnded ? 'animate-pulse bg-red-50 hover:bg-red-100 border-red-300' : ''}`}
          >
            詳細を見る
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
