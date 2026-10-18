import { stackGroups } from '../../data/portfolio';
import { cn } from '../../lib/utils';
import { Box } from './Bento';
import { useLinkedHover } from './LinkedHover';

/** Landing-grid version (Oct 18): every tool as a logo in a small grid of
 *  hairline cells — a mini version of the page grid. Logos stay grey until
 *  hovered, or until a role in Experience that used them is hovered. */
export function StackBox({ index = 7, wide = false }: { index?: number; wide?: boolean }) {
  const { setFocus, litTools } = useLinkedHover();
  const tools = stackGroups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.title })));

  return (
    <Box
      index={index}
      label="Stack"
      aside={<span className="gx-count">{tools.length}</span>}
      className={cn('bx-stack', wide && 'bx-stack--wide')}
    >
      <ul className="bx-tools">
        {tools.map((tool) => (
          <li
            key={tool.name}
            className="bx-tool"
            title={`${tool.name} · ${tool.group}`}
            data-state={litTools ? (litTools.has(tool.name) ? 'lit' : 'dim') : undefined}
            onPointerEnter={() => setFocus({ tool: tool.name })}
            onPointerLeave={() => setFocus(null)}
          >
            <img
              src={tool.icon}
              alt=""
              width={26}
              height={26}
              loading="lazy"
              className="bx-tool-icon"
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden';
              }}
            />
            <span className="bx-tool-name">{tool.name}</span>
          </li>
        ))}
      </ul>
    </Box>
  );
}
