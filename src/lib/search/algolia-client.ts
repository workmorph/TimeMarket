import algoliasearch from 'algoliasearch';

// Initialize Algolia client
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!
);

// Initialize search-only client for frontend
export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

// Indexes
export const auctionsIndex = client.initIndex('auctions');
export const usersIndex = client.initIndex('users');
export const expertsIndex = client.initIndex('experts');

// Configure indexes
export async function configureAlgoliaIndexes() {
  // Configure auctions index
  await auctionsIndex.setSettings({
    searchableAttributes: [
      'title',
      'description',
      'seller_name',
      'category',
    ],
    attributesForFaceting: [
      'searchable(category)',
      'status',
      'filterOnly(price_range)',
      'filterOnly(end_time)',
    ],
    customRanking: [
      'desc(bid_count)',
      'desc(current_price)',
    ],
    ranking: [
      'typo',
      'geo',
      'words',
      'filters',
      'proximity',
      'attribute',
      'exact',
      'custom',
    ],
  });

  // Configure experts index
  await expertsIndex.setSettings({
    searchableAttributes: [
      'name',
      'expertise',
      'bio',
      'skills',
    ],
    attributesForFaceting: [
      'searchable(expertise)',
      'searchable(skills)',
      'filterOnly(hourly_rate_range)',
      'filterOnly(rating)',
    ],
    customRanking: [
      'desc(rating)',
      'desc(completed_sessions)',
    ],
  });
}

// Sync functions
export async function syncAuctionToAlgolia(auction: any) {
  const record = {
    objectID: auction.id,
    title: auction.title,
    description: auction.description,
    seller_name: auction.seller_name,
    category: auction.category,
    current_price: auction.current_price,
    bid_count: auction.bid_count,
    status: auction.status,
    end_time: auction.end_time,
    price_range: getPriceRange(auction.current_price),
    _geoloc: auction.location ? {
      lat: auction.location.lat,
      lng: auction.location.lng,
    } : undefined,
  };

  await auctionsIndex.saveObject(record);
}

export async function syncExpertToAlgolia(expert: any) {
  const record = {
    objectID: expert.id,
    name: expert.name,
    expertise: expert.expertise,
    bio: expert.bio,
    skills: expert.skills,
    hourly_rate: expert.hourly_rate,
    hourly_rate_range: getHourlyRateRange(expert.hourly_rate),
    rating: expert.rating,
    completed_sessions: expert.completed_sessions,
  };

  await expertsIndex.saveObject(record);
}

export async function removeFromAlgolia(index: string, objectID: string) {
  const algoliaIndex = client.initIndex(index);
  await algoliaIndex.deleteObject(objectID);
}

// Helper functions
function getPriceRange(price: number): string {
  if (price < 1000) return 'under_1000';
  if (price < 5000) return '1000_5000';
  if (price < 10000) return '5000_10000';
  if (price < 50000) return '10000_50000';
  return 'over_50000';
}

function getHourlyRateRange(rate: number): string {
  if (rate < 5000) return 'under_5000';
  if (rate < 10000) return '5000_10000';
  if (rate < 20000) return '10000_20000';
  if (rate < 50000) return '20000_50000';
  return 'over_50000';
}