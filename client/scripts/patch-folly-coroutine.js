const fs = require("fs");
const path = require("path");

const files = [
  "../ios/Pods/Headers/Public/ReactNativeDependencies/folly/Expected.h",
  "../ios/Pods/Headers/Public/ReactNativeDependencies/folly/Optional.h",
];

files.forEach((file) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    // Patch the coroutine include
    content = content.replace(
      /#if FOLLY_HAS_COROUTINES\s*\n#include <folly\/coro\/Coroutine.h>/g,
      "#if 0\n// #if FOLLY_HAS_COROUTINES\n// #include <folly/coro/Coroutine.h>",
    );
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Patched: ${filePath}`);
  }
});
