# Grocer - Natural Language Grocery List

A Progressive Web App that helps users manage their grocery list using natural language processing. Built with React, TypeScript, Material UI, and FastAPI.

## Features

- Natural language input for adding items ("I want to make lasagna", "Add milk and eggs")
- Automatic categorization of items by store aisle
- Dark mode support
- Mobile-responsive design
- Item checking and removal
- State persistence
- PWA support for offline functionality

## Tech Stack

Frontend:
- React with TypeScript
- Material UI for components
- Zustand for state management
- PWA features (offline support, installable)

Backend:
- FastAPI (Python)
- Groq API for natural language processing
- Multi-agent system for conversation, ingredient parsing, and list organization

## Development Setup

1. Clone the repository
2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd agents
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory with your Groq API key:
```
GROQ_API_KEY=your_key_here
```

5. Start the development servers:

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd agents
python main.py
```

The app will be available at http://localhost:5174

## Deployment

### Frontend (Vercel)

The frontend is configured for deployment on Vercel with the following features:
- Automatic builds and deployments
- API routing through Vercel's rewrites
- CORS headers for API requests
- Environment variable support

To deploy:
1. Deploy your backend first and note the URL
2. Push to GitHub
3. Import the repository in Vercel
4. Add environment variables in Vercel:
   - `VITE_API_URL`: Your backend URL (e.g., https://your-backend-url.com)
   - `GROQ_API_KEY`: Your Groq API key
5. Deploy

Note: The frontend will automatically use the VITE_API_URL environment variable to connect to your backend. Make sure your backend URL is accessible and has CORS configured to allow requests from your Vercel deployment.

### Backend (Your Choice)

The FastAPI backend can be deployed to any platform that supports Python:
1. Install dependencies from requirements.txt
2. Set environment variables:
   - `GROQ_API_KEY`: Your Groq API key
3. Update CORS settings in main.py:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "http://localhost:5173",
           "http://localhost:5174",
           "https://your-frontend-url.com",  # Add your Vercel deployment URL
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
4. Run the FastAPI server with a production ASGI server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

Note: Make sure your backend server is accessible from your Vercel deployment and has CORS properly configured to allow requests from your frontend URL.

## Usage

1. Open the app in your browser
2. Start adding items by typing natural language commands:
   - "I want to make lasagna"
   - "Add milk and eggs"
   - "What can I make with chicken and pasta?"
3. Items will be automatically categorized by aisle
4. Check off items as you shop
5. Remove items when no longer needed

## Development Notes

- The frontend uses relative API URLs in production that are rewritten by Vercel
- State is persisted in localStorage for the frontend and a JSON file for the backend
- The multi-agent system handles:
  - Conversation management
  - Ingredient parsing
  - List organization
  - UI generation
