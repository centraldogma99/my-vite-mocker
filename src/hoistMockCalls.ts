import * as Rollup from "rollup";
import MagicString from "magic-string";

export const hoistMockCalls = (
  code: string,
  ast: Rollup.ProgramNode,
  { debug }: { debug: boolean }
): string => {
  const mockCalls: any[] = [];
  // AST를 순회하면서 myVi.mock() 호출문 찾기
  const findMockCalls = (node: any) => {
    // MemberExpression + CallExpression 패턴 찾기
    if (
      node.type === "ExpressionStatement" &&
      node.expression.type === "CallExpression" &&
      node.expression.callee &&
      node.expression.callee.type === "MemberExpression" &&
      node.expression.callee.object &&
      node.expression.callee.object.name === "myVi" &&
      node.expression.callee.property &&
      node.expression.callee.property.name === "mock"
    ) {
      mockCalls.push(node);
    }

    // 재귀적으로 모든 자식 노드 탐색
    for (const key in node) {
      if (node[key] && typeof node[key] === "object") {
        if (Array.isArray(node[key])) {
          node[key].forEach((child: any) => {
            if (child && typeof child === "object") {
              findMockCalls(child);
            }
          });
        } else {
          findMockCalls(node[key]);
        }
      }
    }
  };

  const s = new MagicString(code);
  // AST 순회 시작
  findMockCalls(ast);
  if (mockCalls.length > 0) {
    // 찾은 노드를 파일의 맨 위로 이동시키는 로직
    const mockCallLocs: { start: number; end: number }[] = mockCalls.map(
      (node) => ({ start: node.start, end: node.end })
    );

    mockCallLocs.forEach((loc) => {
      s.prepend(code.slice(loc.start, loc.end) + ";\n");
      s.remove(loc.start, loc.end);
    });

    return s.toString();
  } else {
    return code;
  }
};
