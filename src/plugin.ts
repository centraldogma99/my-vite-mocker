import * as Rollup from "rollup";
import { hoistMockCalls } from "./hoistMockCalls";

export interface MyPluginOptions {
  // 여기에 플러그인 옵션을 정의하세요
  debug?: boolean;
}

export function myRollupPlugin(options: MyPluginOptions = {}): Rollup.Plugin {
  const { debug = false } = options;

  return {
    name: "rollup-plugin-my-vite-mocker",

    // 빌드 시작 시 호출
    buildStart() {
      if (debug) {
        console.log("빌드 시작!");
      }
    },

    // 각 모듈을 변환할 때 호출
    transform(code: string, id: string) {
      if (debug) {
        console.log(`파일 변환 중: ${id}`);
      }
      let ast: Rollup.ProgramNode;
      try {
        ast = this.parse(code);
      } catch (err) {
        console.error(`Cannot parse ${id}:\n${(err as any).message}.`);
        return;
      }

      const code2 = hoistMockCalls(code, ast, { debug });

      return {
        code: code2,
        ast,
        map: null,
      };
    },

    // 빌드 종료 시 호출
    buildEnd() {
      if (debug) {
        console.log("빌드 완료!");
      }
    },
  };
}
