import MagicString from "magic-string";
import * as Rollup from "rollup";

export const makeImportsDynamic = (code: string, ast: Rollup.ProgramNode) => {
  const s = new MagicString(code);

  // 함수 내부 같은 곳에서 dynamic import 하는 경우는 어떡하지? -> 핸들링 할 필요 x
  // 어차피 mock 이 먼저 실행됨
  const importNodes = ast.body.filter(
    (node) => node.type === "ImportDeclaration"
  );
  let a: string[];
  try {
    a = importNodes.map((node) => {
      const { specifiers, source } = node;
      const importPath = source.value;

      // 여러 개의 import 지정자가 있는 경우
      if (specifiers.length > 1) {
        return specifiers
          .map((specifier) => {
            const localName = specifier.local.name;

            if (
              specifier.type === "ImportDefaultSpecifier" ||
              specifier.type === "ImportNamespaceSpecifier"
            ) {
              return `const ${localName} = await import('${importPath}');`;
            } else if (specifier.type === "ImportSpecifier") {
              return `const { ${localName} } = await import('${importPath}');`;
            } else throw new Error("Invalid specifier");
          })
          .join("\n");
      }
      // 단일 import 지정자인 경우
      else if (specifiers.length === 1) {
        const specifier = specifiers[0];
        const localName = specifier.local.name;

        if (
          specifier.type === "ImportNamespaceSpecifier" ||
          specifier.type === "ImportDefaultSpecifier"
        ) {
          return `const ${localName} = await import('${importPath}');`;
        } else if (specifier.type === "ImportSpecifier") {
          return `const { ${localName} } = await import('${importPath}');`;
        } else throw new Error("Invalid specifier");
      } else {
        // import 'some-package' 같은 사이드 이펙트만을 위한 import문 처리
        return `await import('${importPath}');`;
      }
    });

    importNodes.forEach((node, index) => {
      s.overwrite((node as any).start, (node as any).end, a[index]);
    });

    return s.toString();
  } catch {
    console.error("asdf");
  }
};
