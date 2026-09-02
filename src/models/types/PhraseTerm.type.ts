import type { TermOutput } from "@/models/types/Term.type.js";

export type PhraseTermOutput = {
  id: number;
  uuid: string;
  term: TermOutput;
};
