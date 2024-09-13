---
to: src/pages/<%= routePath %>/<%= h.changeCase.pascalCase(name) %>.tsx
---

import { FC } from "react";

export const Component: FC = () => {
  return (
    <div>
      <h1><%= h.changeCase.pascalCase(name) %> Page</h1>
    </div>
  );
};