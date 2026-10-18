import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { experiences } from '../../data/portfolio';

/** Role tool names that are spelled differently in the Stack grid. */
const ALIASES: Record<string, string> = { MySQL: 'SQL' };
const toolsOf = (company: string) =>
  (experiences.find((j) => j.company === company)?.technologies ?? []).map((t) => ALIASES[t.name] ?? t.name);

type Focus = { company: string } | { tool: string } | null;

type LinkedHover = {
  setFocus: (focus: Focus) => void;
  /** null = nothing hovered, so nothing is dimmed. */
  litTools: Set<string> | null;
  litCompanies: Set<string> | null;
};

const Ctx = createContext<LinkedHover>({ setFocus: () => {}, litTools: null, litCompanies: null });

/** Experience ↔ Stack (Jay, Oct 18): hover a role and the tools used there
 *  light up in Stack; hover a tool and the roles that used it light up. */
export function LinkedHoverProvider({ children }: { children: ReactNode }) {
  const [focus, setFocus] = useState<Focus>(null);

  const value = useMemo<LinkedHover>(() => {
    if (!focus) return { setFocus, litTools: null, litCompanies: null };
    if ('company' in focus) {
      return { setFocus, litTools: new Set(toolsOf(focus.company)), litCompanies: new Set([focus.company]) };
    }
    const companies = experiences.filter((j) => toolsOf(j.company).includes(focus.tool)).map((j) => j.company);
    return { setFocus, litTools: new Set([focus.tool]), litCompanies: new Set(companies) };
  }, [focus]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLinkedHover = () => useContext(Ctx);
