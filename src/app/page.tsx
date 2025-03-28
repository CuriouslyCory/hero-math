import HeroMathGame from "../components/hero-math-game";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-purple-700 p-4">
      <div className="w-full max-w-5xl">
        <h1 className="mb-4 text-center text-4xl font-extrabold text-white drop-shadow-lg md:text-6xl">
          Hero Math: The Action Quest
        </h1>
        <p className="mb-8 text-center text-xl text-white">
          Join our superhero on a mission to save the city with the power of
          math!
        </p>
        <HeroMathGame />
      </div>
    </main>
  );
}
