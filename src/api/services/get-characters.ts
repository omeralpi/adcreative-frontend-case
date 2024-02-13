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

export const getCharacters = async (
  payload: IGetCharactersPayload,
): Promise<IGetCharactersResponse> => {
  const response = await fetch("https://rickandmortyapi.com/api/character", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};
