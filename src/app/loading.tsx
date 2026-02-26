export default function Loading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div>
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-80"></div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="h-6 bg-gray-200 rounded w-56 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="h-6 bg-gray-200 rounded w-64 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}
