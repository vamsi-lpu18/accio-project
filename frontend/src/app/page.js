export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full overflow-x-hidden px-4 py-8 space-y-10 bg-gradient-to-br from-primary-light via-background to-accent">
      <h1 className="text-4xl font-heading font-bold mb-8 text-center text-primary drop-shadow">
        Welcome to Accio Playground
      </h1>
      <div className="flex flex-wrap justify-center gap-6 mb-10 w-full max-w-4xl mx-auto px-2 py-10">
        <a
          href="/dashboard"
          className="bg-panel text-primary hover:bg-primary hover:text-white border border-primary-light px-6 py-3 rounded-xl shadow-soft transition m-2 font-semibold"
        >
          Dashboard
        </a>
        <a
          href="/playground"
          className="bg-panel text-primary hover:bg-primary hover:text-white border border-primary-light px-6 py-3 rounded-xl shadow-soft transition m-2 font-semibold"
        >
          Playground
        </a>
        <a
          href="/login"
          className="bg-panel text-primary hover:bg-primary hover:text-white border border-primary-light px-6 py-3 rounded-xl shadow-soft transition m-2 font-semibold"
        >
          Login
        </a>
        <a
          href="/signup"
          className="bg-panel text-primary hover:bg-primary hover:text-white border border-primary-light px-6 py-3 rounded-xl shadow-soft transition m-2 font-semibold"
        >
          Signup
        </a>
      </div>
      <p className="text-gray-700 text-lg text-center mt-6 bg-white/70 rounded-xl px-6 py-4 shadow-soft">
        Get started by exploring the dashboard or playground.
      </p>
    </main>
  );
}
