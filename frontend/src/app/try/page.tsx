export default function Try() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Kosong — hanya background untuk pengujian */}
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-3xl text-gray-400 opacity-50">
                    Background Test Page
                </h1>
            </div>
        </main>
    );
}

