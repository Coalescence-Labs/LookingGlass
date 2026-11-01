export type Definition = {
  term: string;
  body: string;
  source?: { label: string; href: string };
};

export const DEFINITIONS: Record<string, Definition> = {
  plasma: {
    term: "Plasma",
    body: "A gas so hot that atoms can't hold onto their electrons — a soup of free nuclei and free electrons that responds to magnetic fields in ways a neutral gas can't. The state of matter the sun is in.",
  },
};

export function getDefinition(key: string): Definition | undefined {
  return DEFINITIONS[key.toLowerCase().trim()];
}
