
/**
 * Service for communicating with the AI Presentation Generator API
 */

const API_BASE_URL = 'https://pptx.techrealm.online';

export interface GeneratePresentationRequest {
  topic: string;
  num_slides?: number;
}

export interface GeneratePresentationResponse {
  download_url: string;
}

/**
 * Generate a presentation using the markdown endpoint
 * @param request Request parameters including topic and optional num_slides
 * @returns Response with download URL
 */
export const generatePresentationMarkdown = async (
  request: GeneratePresentationRequest
): Promise<GeneratePresentationResponse> => {
  try {
    console.log('Sending request to markdown endpoint:', request);
    const response = await fetch(`${API_BASE_URL}/generate-presentation/markdown`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API response:', data);
    return data;
  } catch (error) {
    console.error('Error generating presentation:', error);
    throw error;
  }
};

/**
 * Generate a presentation using the JSON endpoint
 * @param request Request parameters including topic and optional num_slides
 * @returns Response with download URL
 */
export const generatePresentationJson = async (
  request: GeneratePresentationRequest
): Promise<GeneratePresentationResponse> => {
  try {
    console.log('Sending request to JSON endpoint:', request);
    const response = await fetch(`${API_BASE_URL}/generate-presentation/json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API response:', data);
    return data;
  } catch (error) {
    console.error('Error generating presentation:', error);
    throw error;
  }
};
