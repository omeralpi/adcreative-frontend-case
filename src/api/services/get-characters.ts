export interface IGetCharactersPayload {
  params: {
    name?: string;
  };
}

export interface IGetCharactersResponse {
  results: {
    id: number;
    name: string;
    image: string;
    episode: string[];
  }[];
}

export const getCharacters = async ({
  params,
}: IGetCharactersPayload): Promise<IGetCharactersResponse> => {
  const queryParams = new URLSearchParams(params).toString();

  const response = await fetch(
    `https://rickandmortyapi.com/api/character?${queryParams}`,
  );

  const data = await response.json();
  return data;
};
