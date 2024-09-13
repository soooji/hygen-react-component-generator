---
to: "<%= hasNested ? `src/pages/${routePath}/components/${h.changeCase.paramCase(name)}/${h.changeCase.pascalCase(name)}.tsx` : `src/pages/${routePath}/components/${h.changeCase.pascalCase(name)}.tsx` %>"
---

import { FC } from "react";

type <%= h.changeCase.pascalCase(name) %>Props = {
  // Define your prop types here
}

export const <%= h.changeCase.pascalCase(name) %>: FC<<%= h.changeCase.pascalCase(name) %>Props> = ({}) => {
  return (
    <div>
      <h1><%= h.changeCase.pascalCase(name) %> Component</h1>
      {/* Your component implementation */}
    </div>
  );
};