export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="card p-10 max-w-md text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Página não encontrada
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                    A página que você está procurando não existe ou foi removida.
                </p>
                <a
                    href="/"
                    className="btn-primary inline-block"
                >
                    Voltar ao Dashboard
                </a>
            </div>
        </div>
    );
}
