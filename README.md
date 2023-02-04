# extended vue volar

This small script changes default behavior of TypeScript language for Nuxt3 project.
It's related to this Volar [issue](https://github.com/vuejs/language-tools/issues/2330).

Tested on VSCode, Helix, Vim, Nvim.

Few improvements:
  - GotoDefinition feature for Vue components points directly to that component, without even choosing for `nuxt/components.d.ts`.
  - GotoDefinition feature for auto-imported functions redirects client directly to function definition.

Make sure you have [sd](https://github.com/chmln/sd) installed.

In `tsnuxt.sh` update `tsdir` variable with your path for TypeScript.

Execute this command:

```bash
sh tsnuxt.sh
```

You can also revert to old TypeScript file:

```bash
sh tsnuxt.sh 1
```

Enjoy :sunglasses: