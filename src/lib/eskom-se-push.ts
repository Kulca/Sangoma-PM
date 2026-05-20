export interface ESPStatus {
  stage: number;
  next_stage?: number;
  next_change?: string;
  is_live?: boolean;
  last_polled?: string;
  error?: string;
}

const ESP_API_ROOT = 'https://developer.sepush.co.za/business/2.0';
const ESP_TOKEN = process.env.ESP_API_KEY || 'DEV_MOCK_KEY';

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 1000): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok && response.status >= 500 && retries > 0) {
      console.warn(`API error ${response.status}. Retrying in ${backoff}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Network error. Retrying in ${backoff}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
}

export async function getESPStatus(): Promise<ESPStatus> {
  if (ESP_TOKEN === 'DEV_MOCK_KEY') {
    return {
      stage: 2,
      next_stage: 4,
      next_change: new Date(Date.now() + 3600000 * 4).toISOString(),
      is_live: false,
      last_polled: new Date().toISOString(),
    };
  }

  try {
    const response = await fetchWithRetry(`${ESP_API_ROOT}/status`, {
      headers: {
        'token': ESP_TOKEN
      },
      next: { revalidate: 600 } // Poll every 10 minutes as per guide
    });

    if (!response.ok) {
      throw new Error(`ESP API responded with ${response.status}`);
    }

    const data = await response.json();
    const eskom = data.status?.eskom;

    if (!eskom) {
      throw new Error('Eskom status not found in API response');
    }

    return {
      stage: parseInt(eskom.stage),
      next_stage: eskom.next_stages?.[0] ? parseInt(eskom.next_stages[0].stage) : undefined,
      next_change: eskom.next_stages?.[0]?.stage_start_timestamp,
      is_live: true,
      last_polled: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch ESP status:', error);
    return {
      stage: 0, // Fallback
      is_live: false,
      last_polled: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Keep the old function name for compatibility if needed, but redirect to new one
export async function getMockESPStatus(): Promise<ESPStatus> {
  return getESPStatus();
}
