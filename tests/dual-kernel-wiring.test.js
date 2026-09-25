import { describe, expect, it } from "vitest";
import { loadClientModule } from "./client-module.js";

/** 与内核同构的最小 settings 面：快照 + 订阅 + 写入。 */
function fakeScope(value = { threshold: 500, previewChars: 60 }) {
	const listeners = new Set();
	return {
		getSnapshot: () => ({ status: "ready", value, writable: true }),
		subscribe(listener) {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		async set(field, next) {
			value = { ...value, [field]: next };
			for (const listener of listeners) listener();
			return true;
		},
		async unset(field) {
			delete value[field];
			for (const listener of listeners) listener();
			return true;
		}
	};
}

/** 捕获 defer 注入的极简 client ctx：slots/locale 提供同步假面，inject 只记录不回调。 */
function makeClientCtx() {
	const injects = [];
	const slotInjects = [];
	const slotRegisters = [];
	const ctx = {
		inject(services, fn) {
			injects.push({ services, fn });
		},
		effect(fn) {
			return () => {};
		},
		locale: {
			register() {},
			bind() {
				return (key) => key;
			}
		},
		slots: {
			inject(name, register) {
				slotInjects.push({ name, register });
				register();
			},
			register(options, component) {
				slotRegisters.push({ options, component });
				return () => {};
			}
		}
	};
	return { ctx, injects, slotInjects, slotRegisters };
}

describe("client bundle 双内核注入面", () => {
	it("静态注入只声明 slots/locale（不再等待 settingsScope，boot 门解锁）", async () => {
		const { inject } = await loadClientModule();
		expect(inject).toEqual(["slots", "locale"]);
	});

	it("两内核都没有的设置服务：apply 不炸、只挂 dock", async () => {
		const mod = await loadClientModule();
		const { ctx, injects, slotInjects } = makeClientCtx();
		expect(() => mod.apply(ctx)).not.toThrow();
		expect(slotInjects.map((row) => row.name)).toEqual(["conversation.input.dock"]);
		expect(injects.map((row) => row.services)).toEqual([["settingsScope"], ["configForms"]]);
	});
});

describe("legacy 内核（≤0.1.5，settingsScope）", () => {
	it("settingsScope 注入回调：接通 store 并注册 settings.plugin.item 卡", async () => {
		const mod = await loadClientModule();
		const { ctx, injects, slotInjects } = makeClientCtx();
		mod.apply(ctx);
		const legacy = injects.find((row) => row.services.includes("settingsScope"));
		legacy.fn({
			settingsScope: { bind: () => fakeScope() },
			slots: ctx.slots
		});
		expect(slotInjects.map((row) => row.name)).toEqual(["conversation.input.dock", "settings.plugin.item"]);
	});
});

describe("0.1.7+ 内核（configForms，namespace == entry id）", () => {
	it("configForms 注入回调：注册 settings.plugins.tab 页（DraftFoldTab 壳）", async () => {
		const mod = await loadClientModule();
		const { ctx, injects, slotInjects, slotRegisters } = makeClientCtx();
		mod.apply(ctx);
		const modern = injects.find((row) => row.services.includes("configForms"));
		modern.fn({
			configForms: { get: () => fakeScope() },
			locale: ctx.locale,
			slots: ctx.slots
		});
		expect(slotInjects.map((row) => row.name)).toEqual(["conversation.input.dock", "settings.plugins.tab"]);
		const tab = slotRegisters.find((row) => row.options.name === "settings.plugins.tab");
		expect(tab.options.id).toBe("draft-fold");
		expect(tab.options.order).toBe(90);
		expect(tab.options.locale).toBeTruthy();
		expect(tab.options.label()).toBe("settings.title");
		expect(tab.component).toBe(mod.DraftFoldTab);
		const face = tab.options.inject();
		expect(Object.keys(face)).toEqual(["hooks", "edit", "save", "discard", "resetField"]);
	});
});

describe("createDeferredEffectiveStore", () => {
	it("attach 前回退默认值，attach 后跟随实时快照并通知订阅者", async () => {
		const { createDeferredEffectiveStore } = await loadClientModule();
		const store = createDeferredEffectiveStore();
		expect(store.getSnapshot()).toEqual({ threshold: 300, previewChars: 120 });
		const seen = [];
		const off = store.subscribe(() => seen.push(store.getSnapshot()));
		const scope = fakeScope();
		store.attach(scope);
		expect(store.getSnapshot()).toEqual({ threshold: 500, previewChars: 60 });
		expect(seen.length).toBe(1);
		off();
	});
});
