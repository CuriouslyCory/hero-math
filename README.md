# Hero Math: The Action Quest

A comic book-inspired math adventure game where players join a superhero on a mission to save the city by solving fun, simple math challenges.

## Overview

"Hero Math: The Action Quest" is an engaging educational game that blends exciting superhero action with elementary math concepts. Players navigate a dynamic 5x6 grid styled like a comic panel, collecting numbers and symbols that satisfy math challenges while avoiding enemies and obstacles.

### Features

- **Comic Book Visuals**: Vibrant graphics and dynamic story panels
- **Multiple Math Challenges**: Addition, subtraction, and multiples (12 and under)
- **Action-Packed Gameplay**: Navigate around enemies and obstacles
- **Power-Ups**: Special abilities to help overcome difficult challenges
- **Progressive Difficulty**: Increasing challenges across different levels

## Tech Stack

This project is built with the [T3 Stack](https://create.t3.gg/):

- [Next.js](https://nextjs.org) (v15)
- [React](https://reactjs.org) (v19)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com) (v4)
- [tRPC](https://trpc.io) (v11)
- [NextAuth.js](https://next-auth.js.org) (v5)
- [Drizzle ORM](https://orm.drizzle.team)
- [Tanstack Query](https://tanstack.com/query/latest)
- [shadcn/ui](https://ui.shadcn.com/) (components)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or newer)
- [pnpm](https://pnpm.io/) (v9.15.4 or newer)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/hero-math.git
cd hero-math
```

2. Install dependencies:

```bash
pnpm install
```

3. Copy the example environment file:

```bash
cp .env.example .env
```

4. Update the environment variables in `.env` with your configuration

5. Set up the database:

```bash
# Start the PostgreSQL database (if using the provided script)
bash ./start-database.sh

# Push the schema to the database
pnpm db:push
```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Other Scripts

- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm format:write` - Format code with Prettier
- `pnpm db:studio` - Open Drizzle Studio to manage your database
- `pnpm typecheck` - Check types

## Game Rules

### Rule Types

1. **Addition**: Collect numbers that add up to a target sum
2. **Subtraction**: Select numbers that satisfy the subtraction challenge
3. **Multiples**: Collect numbers that are multiples of a given number (12 and under)

### Gameplay

- Use arrow keys or WASD to navigate the superhero across the grid
- Press space bar to collect items
- Avoid enemies and obstacles
- Strategically plan your moves to complete the math challenges

## License

[Add license information if available]

## Contributing

[Add contribution guidelines if available]
