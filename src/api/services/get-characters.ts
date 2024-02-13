export interface ICharacter {
  id: number;
  name: string;
  image: string;
  episode: string[];
}

export interface IGetCharactersResponse {
  results: ICharacter[];
}

export interface IGetCharactersPayload {
  params: {
    name?: string;
  };
}

export const getCharacters = async ({
  params,
}: IGetCharactersPayload): Promise<IGetCharactersResponse> => {
  const queryParams = new URLSearchParams(params).toString();

  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character?${queryParams}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch characters");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching characters:", error);
    throw error;
  }
};
