# js13kgames2020

## Key Game Considerations

- Should players be able to walk through each other?
  NO

- How does combat work?
  -- If an enemy enters the "circle" of the player, the player starts "swinging".
  -- The "hit" player "pinball" bounces off of the "hiter"

- "Boost / sprint ability"
  -- Burns XP

- Upon death
  -- The "killer" gets 25% experience + 25% - 50% dropped on the ground

## Server Events

### Server Accepts

- `play`

  - the player is ready to join the server, they have submitted all their data

- `data`
  - the player is submitting identifying info, such as username, skin selection, etc.

### Server Sends
