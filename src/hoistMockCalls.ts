import * as Rollup from "rollup";

export const hoistMockCalls = (
  code: string,
  ast: Rollup.ProgramNode,
  { debug }: { debug: boolean }
) => {
  const mockCalls: any[] = [];

  // AST를 순회하면서 myVi.mock() 호출문 찾기
  const findMockCalls = (node: any) => {
    // MemberExpression + CallExpression 패턴 찾기
    if (
      node.type === "CallExpression" &&
      node.callee &&
      node.callee.type === "MemberExpression" &&
      node.callee.object &&
      node.callee.object.name === "myVi" &&
      node.callee.property &&
      node.callee.property.name === "mock"
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

  // AST 순회 시작
  findMockCalls(ast);

  // myVi.mock() 호출이 발견되었을 때 추가 처리를 할 수 있습니다
  if (mockCalls.length > 0) {
    console.log("mockCalls", mockCalls);

    // 찾은 노드를 파일의 맨 위로 이동시키는 로직
    try {
      let newCodes = "";

      const mockCallLocs: { start: number; end: number }[] = mockCalls.map(
        (node) => ({ start: node.start, end: node.end })
      );

      mockCallLocs.forEach((loc) => {
        newCodes += code.slice(loc.start, loc.end) + ";\n";
        newCodes += code.slice(0, loc.start);
        newCodes += code.slice(loc.end);
      });

      return newCodes;
    } catch (error) {
      console.error("mock 호출 이동 중 오류 발생:", error);
    }
  }
};
