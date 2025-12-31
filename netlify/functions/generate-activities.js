// Netlify Function to generate activities based on user goals
// API key is stored in Netlify environment variables

exports.handler = async (event, context) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

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
        const { goals } = JSON.parse(event.body);

        if (!goals || goals.length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Goals are required' })
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
                        content: `You are a habit and lifestyle expert. Generate a list of 8-10 specific activities/interests that would help someone achieve their goals.
                        
Return ONLY a valid JSON array of objects with this exact format:
[
    {"value": "activity_id", "label": "🎯 Activity Name & Brief Description"}
]

Rules:
- Each activity should be specific and actionable
- Include an appropriate emoji at the start of each label
- The value should be lowercase with underscores (e.g., "morning_yoga")
- Activities should be diverse and cover different aspects of the goals
- Make activities practical for daily/weekly habits
- Don't repeat similar activities`
                    },
                    {
                        role: 'user',
                        content: `Generate personalized activity suggestions for someone with these goals: ${goals.join(', ')}`
                    }
                ],
                temperature: 0.8,
                max_tokens: 800
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API request failed');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Parse the JSON response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const activities = JSON.parse(jsonMatch[0]);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ activities })
            };
        } else {
            throw new Error('Invalid response format from AI');
        }

    } catch (error) {
        console.error('Error generating activities:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
