 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a//dev/null b/eslint.config.mjs
index 0000000000000000000000000000000000000000..7ca08f1926343fe1c3509911c39b5ce286a33612 100644
--- a//dev/null
+++ b/eslint.config.mjs
@@ -0,0 +1,27 @@
+import js from '@eslint/js';
+import globals from 'globals';
+import react from 'eslint-plugin-react';
+
+export default [
+  {
+    ignores: ['public/js/**', 'examples/**', 'public/assets/**', 'test/**'],
+  },
+  js.configs.recommended,
+  {
+    languageOptions: {
+      ecmaVersion: 'latest',
+      sourceType: 'module',
+      globals: {
+        ...globals.browser,
+        ...globals.node,
+      },
+    },
+    plugins: { react },
+    settings: {
+      react: {
+        version: 'detect',
+      },
+    },
+    rules: {},
+  },
+];
 
EOF
)