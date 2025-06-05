'use client';

import React from 'react';
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Pagination,
  ClearRefinements,
  CurrentRefinements,
  Configure,
  PoweredBy,
} from 'react-instantsearch';
import { searchClient } from '@/lib/search/algolia-client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface AuctionHit {
  objectID: string;
  title: string;
  description: string;
  seller_name: string;
  category: string;
  current_price: number;
  bid_count: number;
  status: string;
  end_time: string;
}

function Hit({ hit }: { hit: AuctionHit }) {
  return (
    <Link href={`/auctions/${hit.objectID}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{hit.title}</h3>
          <Badge variant={hit.status === 'active' ? 'default' : 'secondary'}>
            {hit.status === 'active' ? '進行中' : '終了'}
          </Badge>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{hit.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">現在価格</p>
            <p className="font-bold text-lg">¥{hit.current_price.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{hit.bid_count} 入札</p>
            <p className="text-sm text-gray-500">
              終了: {new Date(hit.end_time).toLocaleDateString('ja-JP')}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function AlgoliaSearch() {
  return (
    <InstantSearch searchClient={searchClient} indexName="auctions">
      <Configure hitsPerPage={12} />
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-64 space-y-6">
          <div>
            <h3 className="font-semibold mb-3">カテゴリー</h3>
            <RefinementList
              attribute="category"
              classNames={{
                list: 'space-y-2',
                item: 'flex items-center',
                checkbox: 'mr-2',
                count: 'ml-auto text-sm text-gray-500',
              }}
            />
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">価格帯</h3>
            <RefinementList
              attribute="price_range"
              transformItems={(items) =>
                items.map((item) => ({
                  ...item,
                  label: getPriceRangeLabel(item.value),
                }))
              }
              classNames={{
                list: 'space-y-2',
                item: 'flex items-center',
                checkbox: 'mr-2',
                count: 'ml-auto text-sm text-gray-500',
              }}
            />
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">ステータス</h3>
            <RefinementList
              attribute="status"
              transformItems={(items) =>
                items.map((item) => ({
                  ...item,
                  label: item.value === 'active' ? '進行中' : '終了',
                }))
              }
              classNames={{
                list: 'space-y-2',
                item: 'flex items-center',
                checkbox: 'mr-2',
                count: 'ml-auto text-sm text-gray-500',
              }}
            />
          </div>
          
          <ClearRefinements
            classNames={{
              button: 'text-sm text-blue-600 hover:text-blue-800',
            }}
            translations={{
              resetButtonText: 'フィルターをクリア',
            }}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <SearchBox
              placeholder="オークションを検索..."
              classNames={{
                root: 'relative',
                input: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                submit: 'absolute right-2 top-1/2 transform -translate-y-1/2',
                reset: 'absolute right-10 top-1/2 transform -translate-y-1/2',
              }}
              translations={{
                submitButtonTitle: '検索',
                resetButtonTitle: 'クリア',
              }}
            />
          </div>
          
          <CurrentRefinements
            classNames={{
              list: 'flex flex-wrap gap-2 mb-4',
              item: 'flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm',
              delete: 'ml-1 text-gray-500 hover:text-gray-700',
            }}
          />
          
          <Hits
            hitComponent={Hit}
            classNames={{
              list: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
            }}
          />
          
          <div className="mt-8 flex justify-center">
            <Pagination
              classNames={{
                list: 'flex gap-1',
                item: 'px-3 py-1 border border-gray-300 rounded',
                selectedItem: 'bg-blue-500 text-white border-blue-500',
                disabledItem: 'opacity-50 cursor-not-allowed',
              }}
            />
          </div>
          
          <div className="mt-8 flex justify-center">
            <PoweredBy
              classNames={{
                root: 'text-sm text-gray-500',
              }}
            />
          </div>
        </div>
      </div>
    </InstantSearch>
  );
}

function getPriceRangeLabel(value: string): string {
  const labels: Record<string, string> = {
    under_1000: '¥1,000未満',
    '1000_5000': '¥1,000 - ¥5,000',
    '5000_10000': '¥5,000 - ¥10,000',
    '10000_50000': '¥10,000 - ¥50,000',
    over_50000: '¥50,000以上',
  };
  return labels[value] || value;
}