# Test Mocks

Ten katalog zawiera mocki używane w testach stanów gry Tetris.

## Plik `mocks.ts`

Plik `mocks.ts` zawiera wszystkie mocki potrzebne do testowania stanów gry. Został stworzony, aby:

- **Eliminować duplikację kodu** - wszystkie testy używają tych samych mocków
- **Poprawić czytelność** - testy są bardziej zwięzłe i skupione na logice
- **Ułatwić utrzymanie** - zmiany w mockach wystarczy wprowadzić w jednym miejscu
- **Zapewnić spójność** - wszystkie testy używają identycznych mocków
- **Zapewnić zgodność z rzeczywistymi klasami** - mocki mają te same metody co prawdziwe klasy

## Dostępne mocki

### Interfejsy TypeScript

Interfejsy mocków są oparte na rzeczywistych klasach z projektu:

- `MockPlayfield` - mock dla pola gry (oparty na klasie `Playfield`)
- `MockBoard` - mock dla planszy (oparty na klasie `Board`)
- `MockScoring` - mock dla systemu punktacji (oparty na klasie `Scoring`)
- `MockLevel` - mock dla systemu poziomów (oparty na klasie `Level`)
- `MockGameCore` - mock dla głównego rdzenia gry
- `MockContext` - mock dla kontekstu Canvas

### Funkcje tworzące mocki

- `createMockPlayfield()` - tworzy mock pola gry z wszystkimi metodami z klasy `Playfield`
- `createMockBoard(playfield?)` - tworzy mock planszy z wszystkimi metodami z klasy `Board`
- `createMockScoring()` - tworzy mock systemu punktacji z wszystkimi metodami z klasy `Scoring`
- `createMockLevel()` - tworzy mock systemu poziomów z wszystkimi metodami z klasy `Level`
- `createMockGameCore(board?, scoring?, level?)` - tworzy mock rdzenia gry
- `createMockContext()` - tworzy mock kontekstu Canvas
- `createMockCanvasRenderingContext2D()` - tworzy mock kontekstu Canvas jako CanvasRenderingContext2D

### Funkcje pomocnicze

- `resetAllMocks()` - resetuje wszystkie mocki
- `createAllMocks()` - tworzy wszystkie mocki na raz i zwraca je jako obiekt

## Przykład użycia

```typescript
import {
  createAllMocks,
  resetAllMocks,
  createMockCanvasRenderingContext2D,
  type MockBoard,
  type MockScoring,
  type MockPlayfield,
} from './mocks'

describe('MyState', () => {
  let mockBoard: MockBoard
  let mockScoring: MockScoring
  let mockPlayfield: MockPlayfield

  beforeEach(() => {
    resetAllMocks()

    const mocks = createAllMocks()
    mockBoard = mocks.board
    mockScoring = mocks.scoring
    mockPlayfield = mocks.playfield

    // Użyj mocks.gameCore w konstruktorze
  })
})
```

## Korzyści z tego podejścia

1. **DRY (Don't Repeat Yourself)** - nie duplikujemy kodu mocków
2. **Type Safety** - wszystkie mocki mają zdefiniowane interfejsy TypeScript
3. **Łatwość utrzymania** - zmiany w jednym miejscu
4. **Spójność** - wszystkie testy używają identycznych mocków
5. **Czytelność** - testy są bardziej zwięzłe i skupione na logice
6. **Reużywalność** - mocki można łatwo używać w nowych testach
7. **Zgodność z rzeczywistymi klasami** - mocki mają dokładnie te same metody co prawdziwe klasy
8. **Automatyczna synchronizacja** - gdy dodamy nową metodę do klasy, TypeScript przypomni nam o dodaniu jej do mocka

## Metody w mockach

### MockPlayfield

- `getWidth()` - zwraca szerokość pola
- `getHeight()` - zwraca wysokość pola
- `getBlocks()` - zwraca bloki na polu
- `hasCollision(tetromino)` - sprawdza kolizje
- `merge(tetromino)` - łączy tetromino z polem
- `hasLineToClear()` - sprawdza czy są linie do wyczyszczenia
- `clearLines()` - czyści pełne linie

### MockBoard

- `moveDown()`, `moveLeft()`, `moveRight()` - ruchy tetromino
- `rotateRight()`, `rotateLeft()` - obroty tetromino
- `mergeActiveTetromino()` - łączy aktywne tetromino
- `spawnTetromino()` - tworzy nowe tetromino
- `hasCollisionInNextStep()` - sprawdza kolizje w następnym kroku
- `detectTSpin()` - wykrywa T-spin
- `getPlayfield()` - zwraca pole gry
- `getTetrominoQueue()` - zwraca kolejkę tetromino
- `getActiveTetromino()` - zwraca aktywne tetromino
- `getGhostTetromino()` - zwraca ghost tetromino

### MockScoring

- `addSingleLine()`, `addDoubleLine()`, `addTripleLine()`, `addTetris()` - punkty za linie
- `addTSpinSingle()`, `addTSpinDouble()`, `addTSpinTriple()` - punkty za T-spin
- `addMiniTSpinSingle()`, `addMiniTSpinDouble()` - punkty za mini T-spin
- `addSoftDropPoints(cells)`, `addHardDropPoints(cells)` - punkty za drop
- `addComboPoints()` - punkty za combo
- `setCombo(combo)`, `getCombo()` - zarządzanie combo
- `getScore()` - zwraca aktualny wynik
- `reset()` - resetuje wynik

### MockLevel

- `addClearedLines(lines)` - dodaje wyczyszczone linie
- `getLevel()` - zwraca aktualny poziom
- `getClearedLines()` - zwraca liczbę wyczyszczonych linii
- `reset()` - resetuje poziom
