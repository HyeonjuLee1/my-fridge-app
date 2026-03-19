import type { Handler, HandlerEvent } from '@netlify/functions';

const BASE_URL = 'https://api.spoonacular.com';

export const handler: Handler = async (event: HandlerEvent) => {
  const apiKey = process.env.SPOONACULAR_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' }),
    };
  }

  // /api/spoonacular/recipes/findByIngredients → /recipes/findByIngredients
  const apiPath = event.path.replace('/api/spoonacular', '');

  const params = new URLSearchParams({
    ...(event.queryStringParameters ?? {}),
    apiKey,
  });

  try {
    const response = await fetch(`${BASE_URL}${apiPath}?${params}`);
    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
