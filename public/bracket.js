const TOURNAMENT_SIZE = 64;

async function createBracket() {
  const response = await fetch("/pets.json");

  if (!response.ok) {
    throw new Error("Could not load contestants");
  }

  const pets = await response.json();

if (pets.length < 2 || pets.length > 64) {
  throw new Error("Tournament requires 2 to 64 contestants");
}

// Randomize contestants using a fixed tournament seed.
// Everyone sees the same matchups.
const entrants = [...pets];

let seed = 20261020;

function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}

for (let i = entrants.length - 1; i > 0; i--) {
  const j = Math.floor(random() * (i + 1));
  [entrants[i], entrants[j]] = [entrants[j], entrants[i]];
}



  // 13 contestants receive first-round byes.
  const byeCount = TOURNAMENT_SIZE - entrants.length;

  // Spread byes across the 32 opening-round matches.
  const byePositions = [
    0, 4, 8, 12, 16, 20, 24,
    28, 32, 36, 40, 44, 48
  ];

  const slots = [];
  let entrantIndex = 0;

  for (let i = 0; i < TOURNAMENT_SIZE; i++) {
    if (byePositions.includes(i)) {
      slots.push(null);
    } else {
      slots.push(entrants[entrantIndex++]);
    }
  }

  const matches = [];

  for (let i = 0; i < TOURNAMENT_SIZE; i += 2) {
    matches.push({
      id: i / 2 + 1,
      pet1: slots[i],
      pet2: slots[i + 1],
      winner: null
    });
  }

  return matches;
}
