import { stackGroups } from '../../data/portfolio';
import { Panel, Reveal } from './Panel';
import { Box } from './Bento';

export default function Stack() {
  return (
    <Panel title="Stack">
      <div className="gx-stack">
        {stackGroups.map((group, i) => (
          <Reveal key={group.title} className="gx-stack-row" delay={i * 0.04}>
            <p className="gx-stack-head">
              <span className="gx-index">{String(i + 1).padStart(2, '0')}</span>
              {group.title}
            </p>
            <div className="gx-chips">
              {group.items.map((item) => (
                <span key={item.name} className="gx-chip">
                  <img
                    src={item.icon}
                    alt=""
                    width={14}
                    height={14}
                    loading="lazy"
                    className="gx-chip-icon"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {item.name}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Panel>
  );
}

/** Landing-grid version: each group is a band, stretched to fill the box so
 *  it lines up with Experience beside it. */
export function StackBox() {
  return (
    <Box index={7} label="Stack" className="bx-stack">
      <div className="bx-stack-groups">
        {stackGroups.map((group) => (
          <div key={group.title} className="bx-stack-group">
            <p className="bx-sub">
              {group.title}
              <span className="gx-count">{group.items.length}</span>
            </p>
            <div className="gx-chips">
              {group.items.map((item) => (
                <span key={item.name} className="gx-chip">
                  <img
                    src={item.icon}
                    alt=""
                    width={14}
                    height={14}
                    loading="lazy"
                    className="gx-chip-icon"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
}
