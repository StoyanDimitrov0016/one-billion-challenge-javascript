# One Billion Row Challenge (1BRC) — JavaScript, Single-Thread

- A hobby attempt at the 1BRC in Node.js, inspired by [this video](https://www.youtube.com/watch?v=apREl0KmTdQ)
- Following the Atwood’s Law: “Any application that can be written in JavaScript, will eventually be written in JavaScript.”
- I love snake_case, so you’ll see it throughout even if it’s not the conventional JS style.
- Purposefully tried to make it OOP-ish
- The best JavaScript article about the solution is [this one](https://jackyef.com/posts/1brc-nodejs-learnings)
- Tried doing it myself without AI (failed at the round toward positive number) so I can challenge myself

# Things that I learned

## Readable streams

- I understood that I can't simply read a 12 GB file and store it in memory.
- Used for the first time readable streams in JS and `for await` iterator

## Chunk alignment and carryover

- Nothing guarantees you that the chunk will start or end at the desired character (in this case the new line).
- For chunk alignment you have to store a leftover/carry and persist it across chunk iterations and append it to the next chunk, ensuring integrity.

## String parsing strategies

- Amazed how difference in performance are the difference string parsing strategies.

### Initial strategy (slower)

```typescript
const [city, temp_as_string] = row.split(this.divider);
```

test loops: 100

- min run: 37.5
- median run: 40.6
- avg run: 41.5
- max run: 61.3

### Improved strategy (faster)

```typescript
const divider_position = row.indexOf(this.divider);

const city = row.slice(0, divider_position);
const temp_as_string = row.slice(divider_position + 1);
```

test loops: 100

- min run: 21.9
- median run: 23.5
- avg run: 24
- max run: 34.9

# Dataset caveats

- I didn’t use the full 1,000,000,000-row dataset (~12+ GB).
- Instead, I tested on subsets from [HuggingFace](https://huggingface.co/datasets/nietras/1brc.data/tree/main)
- Running on the full dataset might reveal edge cases or very different performance numbers.

# Disclaimer

The initial "round toward positive" implementation had an issue at "Abéché" where the right mean temperature was 28.5 and I had it 28.6 because of some odd number leftover and had to ask GPT how to solve this issue and changed the approach.

```typescript
Math.ceil(mean * 10) / 10;
```

# Running locally after cloning

```bash
npm install
npm run dev
```
