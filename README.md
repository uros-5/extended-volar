# extended volar

This small script fixes some unwanted behavior of TypeScript language for [Nuxt3](https://nuxt.com) project.
It works for people who uses editors other than VSCode.
Few improvements:
  - GotoDefinition feature for Vue components points directly to that component, without even choosing for `nuxt/components.d.ts`.

Make sure you have [sd](https://github.com/chmln/sd) installed.

In `tsnuxt.sh` update `tsdir` variable with your path for TypeScript.

Execute this command:

```bash
sh tsnuxt.sh
```

Enjoy :sunglasses: