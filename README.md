# StoryDeck Studio

A creative studio for turning sketches into polished videos using AI.

## Architecture

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|    Frontend      |     |    Backend       |     |   External       |
|    (React)       |     |    (Python)      |     |   Services       |
|                  |     |                  |     |                  |
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |
         v                        v                        v
+------------------+     +------------------+     +------------------+
| TLDraw Canvas    |     | BlackSheep API   |     | Supabase         |
| Framer Motion    |<--->| Job Service      |<--->| - Auth (OAuth)   |
| Tailwind CSS     |     | Video Merge      |     | - Database       |
| React Router     |     | Storage Service  |     | - Realtime       |
+------------------+     +------------------+     +------------------+
                                  |
                                  v
                         +------------------+
                         | Google Cloud     |
                         | - Vertex AI      |
                         | - Cloud Storage  |
                         +------------------+
```

## How It Works

```
User Flow:
+--------+    +---------+    +----------+    +---------+    +--------+
| Sketch |--->| Annotate|--->| Generate |--->|  Video  |--->| Merge  |
| Frame  |    | Motion  |    |   Clip   |    |  Ready  |    | Videos |
+--------+    +---------+    +----------+    +---------+    +--------+
```

1. **Draw a frame** - Sketch your scene on the infinite canvas
2. **Add annotations** - Use arrows and notes to describe motion
3. **Generate video** - AI creates a video clip from your frame
4. **Link frames** - Connect multiple frames for continuity
5. **Merge videos** - Combine all clips into a final video

## Features

- Draw sketches on an infinite canvas
- AI-powered image enhancement
- Video generation from frames
- Credit-based usage system
- Google and GitHub authentication

## Project Structure

```
storydeck-studio/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── contexts/      # React contexts (Auth, FrameGraph)
│   │   ├── hooks/         # Custom hooks (useCanvas)
│   │   ├── pages/         # Route pages
│   │   └── utils/         # Utilities
│   └── public/            # Static assets
│
└── backend/           # Python + BlackSheep API
    ├── controllers/       # API endpoints
    ├── services/          # Business logic
    │   ├── job_service    # Video generation jobs
    │   ├── vertex_service # Google Vertex AI
    │   └── supabase_service # Database operations
    └── utils/             # Helpers
```

## Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLIC_KEY=your_supabase_anon_key
VITE_BACKEND_URL=http://localhost:8000
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn server:app --reload --port 8000
```

Create `backend/.env`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_service_role_key
GCP_PROJECT_ID=your_gcp_project
GCP_LOCATION=your_gcp_region
GCS_BUCKET_NAME=your_bucket_name
```

## Tech Stack

- **Frontend**: React, TypeScript, TLDraw, Framer Motion, Tailwind CSS
- **Backend**: Python, BlackSheep, Supabase
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google, GitHub OAuth)
- **AI**: Google Vertex AI (Veo 3)
- **Storage**: Google Cloud Storage

## License

MIT License - See LICENSE.md for details.

## Author

Mohammed Moota - [GitHub](https://github.com/MohammedMoota)
