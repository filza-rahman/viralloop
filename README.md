# ViralLoop

ViralLoop turns a raw idea into platform-native social content in seconds. You paste a thought, and the app rewrites it for Twitter, LinkedIn, and Reddit simultaneously, each in the tone and format that actually works on that platform. Every output comes with a virality score (0-100) and a short explanation of why it will or won't spread.

Live demo: https://viralloop-nine.vercel.app  
Demo credentials: `judge@viralloop.app` / `demo2026`

---

## The problem

Most people have ideas worth sharing but no idea how to make them land on social media. A LinkedIn post written like a tweet gets ignored. A Reddit post that sounds like a press release gets downvoted. Platform-native writing is a skill that takes years to develop, and generic AI tools just rewrite your idea in slightly better English without understanding the platform at all.

ViralLoop fixes this by generating content that is genuinely tuned to each platform's culture, format, and engagement patterns.

---

## What it does

- Takes any raw idea or rough draft as input
- Lets you choose which platforms to generate for (Twitter, LinkedIn, Reddit)
- Rewrites the content natively for each selected platform
- Returns a virality score with an explanation for each version
- Supports tone selection (professional, casual, bold, storytelling) and word limits
- Saves every generation to DynamoDB so you can review your history
- Lets you copy, regenerate, or delete any individual result

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), Tailwind CSS, shadcn/ui |
| Deployment | Vercel |
| AI | Groq API (llama-3.3-70b-versatile) |
| Database | AWS DynamoDB |
| Auth | Lightweight demo auth (localStorage + hardcoded credentials) |

---

## Architecture

```
User → Vercel (Next.js frontend)
           ↓
     /api/generate (Next.js API route / serverless function)
           ↓
     Groq API (llama-3.3-70b-versatile)
     - Platform Writer: rewrites for Twitter, LinkedIn, Reddit in parallel
     - Virality Scorer: scores and explains each output
           ↓
     AWS DynamoDB
     - Stores each generation (userId, createdAt, idea, results)
     - Powers the History page with real persistent data
```

Each generation runs three Groq calls in parallel using `Promise.all`, so all three platforms are ready at the same time instead of sequentially. Results are saved to DynamoDB immediately after generation.

---

## DynamoDB schema

Single table: `viralloop-generations`

| Key | Type | Description |
|---|---|---|
| `userId` (PK) | String | User identifier (anonymous for demo) |
| `createdAt` (SK) | String | ISO timestamp, used for sorting |
| `id` | String | UUID for the generation |
| `idea` | String | The original input |
| `platforms` | List | Which platforms were selected |
| `results` | Map | Per-platform content, score, explanation |

The partition key and sort key design allows efficient querying of all generations for a user sorted by time, which powers the History page.

---

## Running locally

1. Clone the repo
```bash
git clone https://github.com/filza-rahman/viralloop.git
cd viralloop
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:
```
GROQ_API_KEY=your_groq_key_from_console.groq.com
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
DYNAMODB_TABLE_NAME=viralloop-generations
```

4. Run the dev server
```bash
pnpm dev
```

Open `http://localhost:3000`.

---

## AWS setup

1. Go to AWS Console → DynamoDB → Create table
2. Table name: `viralloop-generations`
3. Partition key: `userId` (String)
4. Sort key: `createdAt` (String)
5. Leave all other settings as default

---

## Built for

H0: Hack the Zero Stack with Vercel v0 and AWS Databases  
Track 3: Million-Scale Global App  
Hackathon page: https://h01.devpost.com
