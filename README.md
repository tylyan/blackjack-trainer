# React Blackjack Game

A modern implementation of Blackjack built with React, TypeScript, and TailwindCSS. This game follows standard casino rules including splitting pairs, doubling down, and dealer hitting on soft 17.

## Features

- Standard Blackjack gameplay
- Split pairs
- Double down
- Automatic dealer play
- Persistent money and statistics
- Custom betting amounts
- Responsive design
- Auto-dealing with manual override

## Game Rules

- Dealer hits on soft 17
- Blackjack pays 3:2
- Double down allowed on any initial hand
- Split allowed on matching ranks
- No re-splitting allowed
- No surrender
- Dealer checks for Blackjack
- Minimum bet: $10

## Project Structure

```
src/
├── components/
│   └── BlackjackGame.tsx    # Main game component
├── types/
│   └── game.ts             # TypeScript type definitions
├── utils/
│   └── deck.ts            # Card deck utilities
└── App.tsx                # Root component
```

## Technical Design

### State Management

The game uses React's useState hook with a comprehensive GameState type that includes:
- Deck of cards
- Player and dealer hands
- Game status
- Scores
- Betting information
- Split/Double capabilities
- Statistics

### Data Persistence

- Player money and statistics are stored in localStorage
- Automatically saves after each hand
- Persists across browser sessions

### Card Handling

- Cards are represented as objects with suit, rank, and value
- Aces are handled dynamically (1 or 11)
- Hidden dealer card is tracked with a hidden flag

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/react-blackjack.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

3. Make your changes (include tests if applicable)
4. Submit a pull request

### Coding Standards

- Use TypeScript for all new code
- Follow existing naming conventions
- Use early returns for cleaner code
- Maintain type safety
- Use TailwindCSS for styling
- Keep components focused and single-purpose

### Areas for Improvement

- Add unit tests
- Implement card animations
- Add sound effects
- Support multiple players
- Add additional betting options
- Implement a proper deck shoe
- Add card counting statistics

## Component API

### BlackjackGame

Main game component that handles all game logic and rendering.

#### State

```typescript
type GameState = {
  deck: Card[]
  playerHands: Card[][]
  activeHandIndex: number
  dealerHand: Card[]
  gameStatus: GameStatus
  playerScores: number[]
  dealerScore: number
  currentBet: number
  playerMoney: number
  canSplit: boolean
  canDouble: boolean
  stats: {
    wins: number
    losses: number
    pushes: number
  }
}
```

#### Key Methods

- `handleStartGame()`: Initiates a new hand
- `handleHit()`: Adds a card to the active hand
- `handleStand()`: Completes player turn and runs dealer logic
- `handleDouble()`: Doubles bet and takes one card
- `handleSplit()`: Splits matching cards into two hands
- `handleBetInput()`: Processes custom bet amounts

## License

MIT License - feel free to use this code for any purpose.
This README provides:
1. Clear project overview
2. Technical details for developers
3. Setup instructions
4. Contributing guidelines
5. Component documentation
6. Areas for future improvement
7. Licensing information

It serves both as documentation and as a guide for potential contributors.
