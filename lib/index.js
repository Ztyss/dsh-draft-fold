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
* is the sole runtime source of truth. The browser half edits it through the
* client settings face and the applied values take effect live.
*/
const DraftFoldSettingsSchema = z.object({
	threshold: z.natural().min(1).max(2e5).default(DEFAULT_SETTINGS.threshold),
	previewChars: z.natural().min(1).max(2e3).default(DEFAULT_SETTINGS.previewChars)
});
/**
* Mark a schema node volatile so the 0.1.7+ Host projects it into the settings
* document. Portable across schemastery 3.18.x: prefer the native method when
* present, otherwise set the same meta flag through extra() (3.18.1 profiles
* ship no .volatile but do ship .extra).
*/
function live(node) {
	if (typeof node.volatile === "function") return node.volatile();
	return node.extra("volatile", true);
}
/**
* Loader-entry Config (0.1.7+): the Host projects volatile fields into the
* settings document (namespace == entry id) and edits land in the profile
* patch. On ≤0.1.5 the entry Config is inert for settings — the explicit
* register below keeps feeding the named namespace instead.
*/
const Config = z.object({
	threshold: live(z.natural().min(1).max(2e5).default(DEFAULT_SETTINGS.threshold)),
	previewChars: live(z.natural().min(1).max(2e3).default(DEFAULT_SETTINGS.previewChars))
});
//#endregion
//#region src/index.ts
/** Host half: register the settings namespace; folding itself lives in the browser half. */
const name = "@ztyss/dsh-draft-fold";
function apply(ctx) {
	ctx.inject(["settings"], (settingsCtx) => {
		// ≤0.1.5 exposes settings.register; 0.1.7+ replaced it with the Config
		// projection above, so an absent method simply means nothing to do here.
		if (typeof settingsCtx.settings.register === "function") {
			settingsCtx.settings.register(SETTINGS_NS, DraftFoldSettingsSchema, { applies: "live" });
		}
	});
}
//#endregion
export { Config, apply, name };
