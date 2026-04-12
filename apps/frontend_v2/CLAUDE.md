This is a pnpm monorepo for Wunderworlds Club, a web application for the Warhammer Underworlds community.

Warhammer Underworlds is a miniature game played on hex boards, using miniature representing a warband and two deck of cards - Objective deck, describing how many victory points you can score and for doing what, and Power deck consisting 50/50 between Gambit cards - immediate effects for the game and Upgrade cards to improve your warband's fighters. Warband is described on the warscroll and each fighter has a two sided card - for when they are basic and when they are inspired.

We are currently in the 2nd edition of the game. Players can get cards by buying Rivals decks, each consisting of 32 cards. Players can use deck as is for a Rivals format or they can combine up to two rivals decks to build their deck in Nemesis format. 

All information about rivals decks, warbands and cards can be found in `../packages/wudb`.

## Code rules to consider

- we are trying to build a set of reusable project specific components in `src/shared/components`.
- when you create a new component, always follow structure:
```ts
//imports
//interface
// main export component
export const MainExport = () => {}

// any extra custom components
```

When part of the MainExport component's tree is an encapsulated self-sufficient piece, extract it into a sub-component placed under Main component.
