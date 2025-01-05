export const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-900 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="h-8 bg-gray-800 rounded w-48 mb-8" />
        <div className="h-24 bg-gray-800 rounded mb-12" />
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-800 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
};
