import * as Rollup from "rollup";

// import { foo } from 'bar' -> const {foo} = await import('bar')
// import foo from 'bar' -> const foo = await import('bar')


export const transformToDynamicImport = (
  code: string,
  ast: Rollup.ProgramNode
) => {
  const importStatements = ast.body.filter(
    (node) => node.type === "ImportDeclaration"
  );
};
