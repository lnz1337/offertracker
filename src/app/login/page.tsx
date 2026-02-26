"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push("/");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error ?? "Senha incorreta");
            }
        } catch {
            setError("Erro de conexão");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center px-4">
            <div className="w-full max-w-sm animate-fade-in">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20 mx-auto mb-4">
                        O
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        OfferTracker
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Faça login para continuar
                    </p>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="card p-6 space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Senha
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite a senha de acesso"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                            required
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-rose-50 border border-rose-200/60 rounded-lg text-rose-700 text-sm animate-fade-in">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-2.5"
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}
