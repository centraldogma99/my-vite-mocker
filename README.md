# my-rollup-plugin

간단한 Rollup 플러그인 프로젝트입니다.

## 설치

```bash
npm install my-rollup-plugin --save-dev
```

## 사용법

```js
// rollup.config.js
import myRollupPlugin from "my-rollup-plugin";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
  plugins: [
    myRollupPlugin({
      // 옵션 설정
      debug: true,
    }),
  ],
};
```

## 옵션

- `debug` (boolean): 디버그 메시지 출력 여부 (기본값: false)

## 개발

```bash
# 의존성 설치
npm install

# 개발 모드로 실행 (파일 변경 감지)
npm run dev

# 빌드
npm run build
```

## 라이센스

MIT
