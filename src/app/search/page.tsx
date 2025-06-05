import AlgoliaSearch from '@/components/search/AlgoliaSearch';

export default function SearchPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">オークション検索</h1>
      <AlgoliaSearch />
    </div>
  );
}