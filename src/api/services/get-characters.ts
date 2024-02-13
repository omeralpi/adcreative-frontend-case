interface Character {
  id: number;
  name: string;
  image: string;
  episode: string[];
}

interface GetCharactersPayload {
  params?: {
    name?: string;
  };
}

interface GetCharactersResponse {
  results: Character[];
}

/**
 * Fetches characters from the Rick and Morty API based on provided parameters.
 * @param payload The payload containing query parameters for the API request.
 * @returns A Promise resolving to the response containing character data.
 */
export const getCharacters = async ({
  params = {},
}: GetCharactersPayload = {}): Promise<GetCharactersResponse> => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(
      `https://rickandmortyapi.com/api/character?${queryParams}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch characters");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching characters:", error);
    throw error;
  }
};
