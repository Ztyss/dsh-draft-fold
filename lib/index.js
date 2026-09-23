import z from "@deepseek-ai/schemastery";
//#region src/settings.ts
/** Settings namespace registered by the Host and edited from 插件配置. */
const SETTINGS_NS = "draft-fold";
/** Defaults shared by the Host settings schema and the client-side fallback. */
const DEFAULT_SETTINGS = {
	threshold: 300,
	previewChars: 120
};
/**
* User-owned settings for the draft-fold plugin: the durable settings document
* is the sole runtime source of truth (the loader-entry Config was removed in
* 0.2.0). The browser half edits it through the client settings scope and the
* applied values take effect live.
*/
const DraftFoldSettingsSchema = z.object({
	threshold: z.natural().min(1).max(2e5).default(DEFAULT_SETTINGS.threshold),
	previewChars: z.natural().min(1).max(2e3).default(DEFAULT_SETTINGS.previewChars)
});
//#endregion
//#region src/index.ts
/** Host half: register the settings namespace; folding itself lives in the browser half. */
const name = "@ztyss/dsh-draft-fold";
function apply(ctx) {
	ctx.inject(["settings"], (settingsCtx) => {
		settingsCtx.settings.register(SETTINGS_NS, DraftFoldSettingsSchema, { applies: "live" });
	});
}
//#endregion
export { apply, name };
