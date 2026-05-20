const { mergeConfig, getDefaultConfig } = require("@react-native/metro-config");
const {
  createHarmonyMetroConfig,
} = require("react-native-harmony/metro.config");
const path = require("path");
const fs = require("fs");
const harmonyConfig = createHarmonyMetroConfig({
  reactNativeHarmonyPackageName: "react-native-harmony",
});

const packagesDir = path.resolve(__dirname, "..", "packages");
const projectNodeModules = path.resolve(__dirname, "node_modules");

// ===== 根因修复：在 packages/ 下创建 symlink → example_HO/node_modules =====
// 这样 packages/ 中的 SDK 文件向上查找 node_modules 时能找到所有依赖
// 不再需要为每个模块单独添加重定向
const packagesNodeModules = path.join(packagesDir, "node_modules");
if (!fs.existsSync(packagesNodeModules)) {
  fs.symlinkSync(projectNodeModules, packagesNodeModules, "junction");
}

// 没有 Harmony 版本的原生模块 → 重定向到 stub
const NATIVE_MODULE_STUBS = [
  "@react-native-community/blur",
  "react-native-easy-view-transformer",
  "react-native-shadow",
  "react-native-video",
  "react-native-navbar",
];

// 确保 stub 文件存在
const stubsDir = path.resolve(__dirname, "stubs");
if (!fs.existsSync(stubsDir)) fs.mkdirSync(stubsDir, { recursive: true });
const stubFile = path.join(stubsDir, "nativeModule.js");
if (!fs.existsSync(stubFile)) {
  fs.writeFileSync(stubFile, `module.exports = new Proxy({}, { get: () => () => null });\n`);
}

/**
 * @type {import("metro-config").ConfigT}
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  // 只 watch packages/ 目录，不 watch 整个 repo root（避免 react-native@0.59.10 冲突）
  watchFolders: [packagesDir],
  resolver: {
    // extraNodeModules Proxy: 所有模块都指向 example_HO/node_modules
    // 这样 packages/ 中的文件也能找到正确的依赖，不会向上走到 repo root 的旧版本
    extraNodeModules: new Proxy(
      // 显式列出的模块（优先级最高）
      {
        // SDK 包 → packages/ 目录
        "@tuya/tuya-panel-lamp-sdk": path.join(packagesDir, "tuya-panel-lamp-sdk"),
        "@tuya/tuya-panel-robot-sdk": path.join(packagesDir, "tuya-panel-robot-sdk"),
        "@tuya/tuya-panel-api": path.join(packagesDir, "tuya-panel-api"),
        "@tuya/tuya-panel-health-sdk": path.join(packagesDir, "tuya-panel-health-sdk"),
        "@tuya/tuya-panel-gateway-sdk": path.join(packagesDir, "tuya-panel-gateway-sdk"),
        "@tuya/tuya-panel-animation-sdk": path.join(packagesDir, "tuya-panel-animation-sdk"),
        "@tuya/tuya-panel-remote-sdk": path.join(packagesDir, "tuya-panel-remote-sdk"),
        "@tuya/tuya-panel-ipc-sdk": path.join(packagesDir, "tuya-panel-ipc-sdk"),
        "@tuya/tuya-panel-electrician-sdk": path.join(packagesDir, "tuya-panel-electrician-sdk"),
        "@tuya/tuya-panel-lock-sdk": path.join(packagesDir, "tuya-panel-lock-sdk"),
        "@tuya/tuya-panel-outdoor-sdk": path.join(packagesDir, "tuya-panel-outdoor-sdk"),
        "@tuya/tuya-panel-szos-sdk": path.join(packagesDir, "tuya-panel-szos-sdk"),
        "@tuya/tuya-panel-sensing-sdk": path.join(packagesDir, "tuya-panel-sensing-sdk"),
      },
      {
        get: (target, name) => {
          if (typeof name !== 'string') return undefined;
          if (name in target) return target[name];
          // 通用回退：对 example_HO/node_modules 中存在的目录返回路径
          var modulePath = path.join(projectNodeModules, name);
          if (fs.existsSync(modulePath)) return modulePath;
          return undefined;
        },
      }
    ),
    resolveRequest: (context, moduleName, platform) => {
      // ========== 没有 Harmony 版本的原生模块 → stub ==========
      const stubMatch = NATIVE_MODULE_STUBS.find(
        (s) => moduleName === s || moduleName.startsWith(s + "/")
      );
      if (stubMatch) {
        return { type: "sourceFile", filePath: stubFile };
      }

      // ========== RCTDeviceEventEmitter ==========
      if (moduleName === "RCTDeviceEventEmitter") {
        return { type: "sourceFile", filePath: path.resolve(projectNodeModules, "react-native/Libraries/EventEmitter/RCTDeviceEventEmitter.js") };
      }

      if (
        moduleName === "react-native-svg/lib/extract/extractBrush" ||
        moduleName === "react-native-svg/lib/commonjs/lib/extract/extractBrush"
      ) {
        return {
          type: "sourceFile",
          filePath: path.resolve(
            __dirname,
            "node_modules/react-native-svg/src/lib/extract/extractBrush.ts"
          ),
        };
      }
      if (
        moduleName === "react-native/Libraries/Utilities/buildStyleInterpolator"
      ) {
        return {
          type: "sourceFile",
          filePath: path.resolve(
            __dirname,
            "node_modules/@tuya-oh/react-native-deprecated-custom-components/src/buildStyleInterpolator.js"
          ),
        };
      }
      if (
        moduleName ===
        "react-native/Libraries/Renderer/shims/ReactNativeComponentTree"
      ) {
        return {
          type: "sourceFile",
          filePath: path.resolve(
            __dirname,
            "node_modules/react-native-harmony/Libraries/Renderer/shims/ReactNativeComponentTree.js"
          ),
        };
      }
      if (moduleName === "react-native-svg/lib/extract/extractGradient") {
        return {
          type: "sourceFile",
          filePath: path.resolve(
            __dirname,
            "node_modules/react-native-svg/src/lib/extract/extractGradient.ts"
          ),
        };
      }
      if (
        moduleName === "react-native-svg/lib/createReactNativeComponentClass"
      ) {
        return {
          type: "sourceFile",
          filePath: path.resolve(
            __dirname,
            "node_modules/react-native-svg/lib/createReactNativeComponentClass.js"
          ),
        };
      }
      if (moduleName === "react-native-svg/lib/attributes") {
        return {
          type: "sourceFile",
          filePath: path.resolve(
            __dirname,
            "node_modules/react-native-svg/lib/attributes.js"
          ),
        };
      }

      if (moduleName === "react-native/lib/deepDiffer") {
        return {
          type: "sourceFile",
          filePath: path.resolve(
            __dirname,
            "node_modules/react-native/Libraries/Utilities/differ/deepDiffer.js"
          ),
        };
      }

      // 确保 Platform 模块解析到 harmony 版本
      if (moduleName === "react-native/Libraries/Utilities/Platform") {
        return {
          type: "sourceFile",
          filePath: path.resolve(
            __dirname,
            "node_modules/react-native-harmony/Libraries/Utilities/Platform.harmony.ts"
          ),
        };
      }

      // 将 tuya-panel-kit 重定向到 @tuya-rn/tuya-panel-kit-harmony
      if (moduleName === "tuya-panel-kit") {
        return harmonyConfig.resolver.resolveRequest(
          context,
          "@tuya-rn/tuya-panel-kit-harmony",
          platform
        );
      }
      if (moduleName === "react-native-gesture-handler") {
        return harmonyConfig.resolver.resolveRequest(
          context,
          "@tuya-oh/react-native-gesture-handler",
          platform
        );
      }
      // 处理 tuya-panel-kit 的子路径导入
      if (moduleName.startsWith("tuya-panel-kit/")) {
        const subPath = moduleName.substring("tuya-panel-kit".length);
        return harmonyConfig.resolver.resolveRequest(
          context,
          `@tuya-rn/tuya-panel-kit-harmony${subPath}`,
          platform
        );
      }

      // 将 react-native-maps 重定向到 @tuya-oh/react-native-maps
      if (moduleName === "react-native-maps") {
        return harmonyConfig.resolver.resolveRequest(
          context,
          "@tuya-oh/react-native-maps",
          platform
        );
      }
      if (moduleName.startsWith("react-native-maps/")) {
        const subPath = moduleName.substring("react-native-maps".length);
        return harmonyConfig.resolver.resolveRequest(
          context,
          `@tuya-oh/react-native-maps${subPath}`,
          platform
        );
      }

      if (moduleName === "react-native/Libraries/Utilities/MatrixMath") {
        const matrixStub = path.join(stubsDir, "MatrixMath.js");
        if (!fs.existsSync(matrixStub)) {
          fs.writeFileSync(matrixStub, `module.exports = { createIdentityMatrix: () => [], multiplyInto: () => {}, reusePerspectiveTransform: () => {} };\n`);
        }
        return { type: "sourceFile", filePath: matrixStub };
      }

      // 兜底：直接调用 harmony 解析器（不是 context.resolveRequest，避免递归）
      return harmonyConfig.resolver.resolveRequest(
        context,
        moduleName,
        platform
      );
    },
  },
};

module.exports = mergeConfig(
  getDefaultConfig(__dirname),
  harmonyConfig,
  config
);
