import { useEffect, useMemo, useRef, useState } from 'react';
import { commands, type CommandItem } from '../data/portfolio';

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
};

function runCommand(command: CommandItem, onClose: () => void) {
  onClose();

  if (command.target) {
    document.querySelector(command.target)?.scrollIntoView({ behavior: 'smooth' });
  }

  if (command.href) {
    window.open(command.href, command.href.startsWith('mailto:') ? '_self' : '_blank');
  }
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter((command) => command.label.toLowerCase().includes(normalized));
  }, [query]);

  useEffect(() => {
    if (!open) return;

    setQuery('');
    setActiveIndex(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (activeIndex >= filteredCommands.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, filteredCommands.length]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % Math.max(filteredCommands.length, 1));
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex(
          (index) => (index - 1 + Math.max(filteredCommands.length, 1)) % Math.max(filteredCommands.length, 1),
        );
        return;
      }

      if (event.key === 'Enter') {
        const command = filteredCommands[activeIndex];
        if (command) {
          event.preventDefault();
          runCommand(command, onClose);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, filteredCommands, activeIndex]);

  if (!open) return null;

  return (
    <div
      className="palette-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="command-palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <label>
          <span>⌕</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            autoComplete="off"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
          />
        </label>
        <div className="command-list">
          {filteredCommands.map((command, index) => (
            <button
              key={command.label}
              type="button"
              className={index === activeIndex ? 'active' : undefined}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => runCommand(command, onClose)}
            >
              <span>{command.label}</span>
              <kbd>{command.shortcut}</kbd>
            </button>
          ))}
        </div>
        <p className="palette-help">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </p>
      </div>
    </div>
  );
}
