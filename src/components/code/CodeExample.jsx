import { getLanguage } from "../../utils/utils";
import { useState } from "react"; // << ADICIONADO
import CodeHighlighter from "./CodeHighlighter";
import CodeOptions, {
  CSSTab,
  TailwindTab,
  TSCSSTab,
  TSTailwindTab,
} from "./CodeOptions";

const CodeExample = ({ codeObject }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <>
      {Object.entries(codeObject).map(([name, snippet]) => {
        const skip = [
        "tailwind",
        "css",
        "tsTailwind",
        "tsCode",
        "cliDefault",
        "cliTailwind",
        "cliTsTailwind",
        "cliTsDefault",
      ];
      if (skip.includes(name)) return null;

      if (name === "code" || name === "tsCode") {
        return (
          <div key={name}>
            <h2 className="demo-title">{name}</h2>
          {/* JS + TAILWIND */}
            <CodeOptions>
              <TailwindTab>
                <CodeHighlighter language="jsx" codeString={codeObject.tailwind} expanded={isExpanded} onToggleExpand={handleToggleExpand} />
              </TailwindTab>
          {/* JS + Default CSS */}
              <CSSTab>
                <CodeHighlighter language="jsx" codeString={codeObject.code} expanded={isExpanded} onToggleExpand={handleToggleExpand} />
                {codeObject.css && (
                  <>
                    <h2 className="demo-title">CSS</h2>
                    <CodeHighlighter language="css" codeString={codeObject.css} expanded={isExpanded} onToggleExpand={handleToggleExpand} />
                  </>
                )}
              </CSSTab>
          {/* TS + TAILWIND */}
              {codeObject.tsTailwind && (
                <TSTailwindTab>
                  <CodeHighlighter language="tsx" codeString={codeObject.tsTailwind} expanded={isExpanded} onToggleExpand={handleToggleExpand} />
                </TSTailwindTab>
              )}
          {/* TS + Default CSS */}
              {codeObject.tsCode && (
                <TSCSSTab>
                  <CodeHighlighter language="tsx" codeString={codeObject.tsCode} expanded={isExpanded} onToggleExpand={handleToggleExpand} />
                  {codeObject.css && (
                    <>
                      <h2 className="demo-title">CSS</h2>
                      <CodeHighlighter language="css" codeString={codeObject.css} expanded={isExpanded} onToggleExpand={handleToggleExpand} />
                    </>
                  )}
                </TSCSSTab>
              )}
            </CodeOptions>
          </div>
        );
      }

      return (
        <div key={name}>
          <h2 className="demo-title">{name}</h2>
          <CodeHighlighter language={getLanguage(name)} codeString={snippet} expanded={isExpanded} onToggleExpand={handleToggleExpand} />
        </div>
      );
    })}
  </>
);
}

export default CodeExample;
