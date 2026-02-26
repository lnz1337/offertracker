"use client";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="card p-10 max-w-md text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Ops, algo deu errado
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                    {error.message || "Ocorreu um erro inesperado ao carregar a página."}
                </p>
                <button
                    onClick={reset}
                    className="btn-primary"
                >
                    Tentar novamente
                </button>
            </div>
        </div>
    );
}
