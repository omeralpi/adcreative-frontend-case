"use client";

import { getCharacters } from "@/api/services/get-characters";
import { AsyncMultiSelect } from "@/components/async-multi-select";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-[500px] mx-auto">
        <AsyncMultiSelect
          onSearch={async (value) => {
            try {
              const response = await getCharacters({
                params: {
                  name: value,
                },
              });

              return response.results.map((character) => ({
                value: character.id.toString(),
                label: character.name,
                image: character.image,
                description: `${character.episode.length} Episodes`,
              }));
            } catch (error) {
              return [];
            }
          }}
        />
      </div>
    </main>
  );
}
