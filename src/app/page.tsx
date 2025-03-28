import HeroMathGame from "../components/hero-math-game"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-500 to-purple-700">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-white mb-4 drop-shadow-lg">
          Hero Math: The Action Quest
        </h1>
        <p className="text-xl text-center text-white mb-8">
          Join our superhero on a mission to save the city with the power of math!
        </p>
        <HeroMathGame />
      </div>
    </main>
  )
}

