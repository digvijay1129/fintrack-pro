function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center px-4">
      <div
        className="
          w-full
          max-w-lg
          bg-white/95
          backdrop-blur-lg
          p-8
          rounded-3xl
          shadow-2xl
          border
          border-white/20
        "
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💰</div>

          <h1 className="text-4xl font-bold text-slate-900">
            FinTrack Pro
          </h1>

          <p className="text-slate-500 mt-2">
            Smart Expense Management Platform
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;