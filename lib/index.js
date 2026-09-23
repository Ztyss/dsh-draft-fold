import z from "@deepseek-ai/schemastery";
//#region src/config.ts
const Config = z.object({
	threshold: z.natural().min(1).default(2e3),
	previewChars: z.natural().min(1).default(120)
});
//#endregion
//#region src/index.ts
/** Host half: the bundle is intentionally presentation-only. */
const name = "@ztyss/dsh-draft-fold";
/** The browser half is loaded through exports["./client"]. */
function apply() {}
//#endregion
export { Config, apply, name };

//# sourceMappingURL=index.js.map