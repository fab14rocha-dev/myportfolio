// experiences.js — Experience types and their questions
//
// Each experience has two question sets:
//   pathA — one person is planning a surprise for someone else (specific)
//   pathB — both people want to be surprised (discreet, open-ended)

const EXPERIENCES = {

  sports: {
    label: 'Sports',
    pathA: [
      {
        id: 'sports_type',
        label: "What's their favorite sport?",
        placeholder: 'e.g. Basketball, Soccer, Tennis...'
      },
      {
        id: 'sports_team',
        label: "Who's their team?",
        placeholder: 'e.g. NY Knicks, Manchester United...'
      },
      {
        id: 'sports_hero',
        label: "Who's their sports hero?",
        placeholder: 'e.g. Michael Jordan, Serena Williams...'
      }
    ],
    pathB: [
      {
        id: 'sports_type',
        label: "What sport do you both love?",
        placeholder: 'e.g. Basketball, Soccer, Tennis...'
      },
      {
        id: 'sports_team',
        label: "Any team that's close to your hearts?",
        placeholder: 'Optional — leave blank if unsure'
      },
      {
        id: 'sports_memory',
        label: "A sports moment you've shared together?",
        placeholder: 'Optional — a game, a match, a memory...'
      }
    ]
  },

  dining: {
    label: 'Dining',
    pathA: [
      {
        id: 'dining_cuisine',
        label: "What cuisine do they love?",
        placeholder: 'e.g. Italian, Japanese, Mexican...'
      },
      {
        id: 'dining_restrictions',
        label: "Any dietary restrictions?",
        placeholder: 'e.g. Vegetarian, no shellfish... (or leave blank)'
      },
      {
        id: 'dining_restaurant',
        label: "A favorite restaurant of theirs?",
        placeholder: 'Optional — leave blank if unsure'
      }
    ],
    pathB: [
      {
        id: 'dining_cuisine',
        label: "What kind of food do you both enjoy?",
        placeholder: 'e.g. Italian, Japanese, a mix of everything...'
      },
      {
        id: 'dining_restrictions',
        label: "Any dietary restrictions between the two of you?",
        placeholder: 'Optional — leave blank if none'
      },
      {
        id: 'dining_vibe',
        label: "How would you describe your ideal dinner together?",
        placeholder: 'e.g. Romantic and quiet, lively and fun...'
      }
    ]
  },

  music: {
    label: 'Music',
    pathA: [
      {
        id: 'music_genre',
        label: "What genre moves them?",
        placeholder: 'e.g. Jazz, Pop, Hip-hop, Country...'
      },
      {
        id: 'music_artist',
        label: "Their favorite artist?",
        placeholder: 'e.g. Billy Joel, Beyoncé, Frank Sinatra...'
      },
      {
        id: 'music_song',
        label: "A song that means something to them?",
        placeholder: 'Optional — leave blank if unsure'
      }
    ],
    pathB: [
      {
        id: 'music_genre',
        label: "What music do you both love?",
        placeholder: 'e.g. Jazz, Pop, Hip-hop, Country...'
      },
      {
        id: 'music_artist',
        label: "An artist you both connect with?",
        placeholder: 'Optional — leave blank if none comes to mind'
      },
      {
        id: 'music_song',
        label: "Is there a song that belongs to the two of you?",
        placeholder: 'Optional — a song that means something to you both'
      }
    ]
  }

};