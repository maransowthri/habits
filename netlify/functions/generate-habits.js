// Netlify Function to generate habits using OpenAI API
// API key is stored in Netlify environment variables

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'API key not configured' })
        };
    }

    try {
        const { prompt } = JSON.parse(event.body);

        if (!prompt) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Prompt is required' })
            };
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are a professional habit coach and wellness expert. Create personalized, actionable weekly habit plans. 
                        Always respond with valid JSON in this exact format:
                        {
                            "summary": "Brief personalized message to the user",
                            "days": {
                                "Monday": [{"title": "Habit name", "time": "Suggested time", "duration": "Duration", "category": "health|mental|productivity|learning|relationships|creativity|finance"}],
                                "Tuesday": [...],
                                "Wednesday": [...],
                                "Thursday": [...],
                                "Friday": [...],
                                "Saturday": [...],
                                "Sunday": [...]
                            }
                        }
                        Each day should have 3-5 habits appropriate for that day (weekends can be different from weekdays).
                        Categories determine the icon color.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API request failed');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Parse the JSON response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const habits = JSON.parse(jsonMatch[0]);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(habits)
            };
        } else {
            throw new Error('Invalid response format from AI');
        }

    } catch (error) {
        console.error('Error generating habits:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
