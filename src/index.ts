import type { Plugin } from "rollup";

export interface MyPluginOptions {
  // 여기에 플러그인 옵션을 정의하세요
  debug?: boolean;
}

export default function myRollupPlugin(options: MyPluginOptions = {}): Plugin {
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

      // 여기서 코드를 변환하는 로직을 구현하세요
      // 예: 특정 문자열 치환, 코드 분석 등

      return {
        code,
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
