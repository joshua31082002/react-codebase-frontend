import { promptTemplates } from "@/lib/prompts";

type PromptLibraryProps = {
  onSelect: (prompt: string) => void;
};

export function PromptLibrary({ onSelect }: PromptLibraryProps) {
  return (
    <aside className="prompt-library" aria-labelledby="prompt-library-title">
      <div className="prompt-library-heading">
        <p className="eyebrow" id="prompt-library-title">Prompt library</p>
        <span>{promptTemplates.length} ways in</span>
      </div>
      <div className="prompt-grid">
        {promptTemplates.map((template) => (
          <button
            className="prompt-card"
            key={template.id}
            type="button"
            onClick={() => onSelect(template.prompt)}
          >
            <span className="prompt-card-label">{template.label}</span>
            <span className="prompt-card-description">{template.description}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
