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

- `connection`

  - [automatic] sent when a new player connects to the server.

- `disconnect`

  - [automatic] sent when the players socket stops for any reason.

- `play`

  - the player is ready to fight, they have submitted all their data. Render the world.

- `data`

  - the player is submitting identifying info, such as username, skin selection, etc.

### Server Sends

- `sync`

  - the entire game state.
  - sent on first `play` call

- `delta`

  - the game state delta
  - any entity with `active=false` is expected to be forgotten on the client end

### Server Emits

- `stats`

  - the server tick stats
