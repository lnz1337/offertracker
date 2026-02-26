export default function OfferLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-40"></div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="h-6 bg-gray-200 rounded w-64 mb-4"></div>
                <div className="h-80 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}
