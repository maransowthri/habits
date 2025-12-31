# Build My Habits

🔗 **Live at: [buildmyhabits.xyz](https://buildmyhabits.xyz)**

A personalized weekly habits planner that uses AI to create custom habit recommendations based on your goals, interests, and lifestyle.

## Features

- **Interactive Questionnaire**: Answer questions about your goals, interests, occupation, and preferences
- **AI-Powered Recommendations**: Uses OpenAI GPT-4o-mini to generate personalized habits
- **Weekly Schedule**: Habits organized by day (Monday - Sunday)
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Download Plan**: Export your habit plan as a text file
- **Secure API**: OpenAI API key stored securely in Netlify environment variables

## Getting Started

### Prerequisites

- A Netlify account
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Deploy to Netlify

1. Push this repository to GitHub/GitLab
2. Connect to Netlify
3. **Add environment variable** in Netlify dashboard:
   - Go to Site settings → Environment variables
   - Add: `OPENAI_API_KEY` = your OpenAI API key
4. Deploy

### Local Development

For local testing with Netlify Functions:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run locally with functions
netlify dev
```

## Usage

1. Click "Get Started" on the welcome screen
2. Answer the questionnaire about:
   - Your name
   - Age group
   - Occupation
   - Goals and interests
   - Available time
   - Wake time preference
   - Challenge level
3. View your personalized weekly habit plan
4. Download or regenerate as needed

## Tech Stack

- **HTML5** - Structure
- **TailwindCSS** (CDN) - Styling
- **Vanilla JavaScript** - Functionality
- **Netlify Functions** - Serverless API
- **OpenAI API** - AI-powered habit generation

## Security

- API key stored securely in Netlify environment variables
- Server-side API calls via Netlify Functions
- No sensitive data exposed to the client

## File Structure

```
habits/
├── index.html              # Main HTML file
├── styles.css              # Custom CSS styles
├── app.js                  # JavaScript application logic
├── netlify.toml            # Netlify configuration
├── netlify/
│   └── functions/
│       └── generate-habits.js  # Serverless function for OpenAI
└── README.md               # Documentation
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key (required) |

## License

MIT License - Feel free to use and modify!
