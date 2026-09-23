import { describe, expect, it } from "vitest";
import { loadClientModule } from "./client-module.js";

/** 与 SettingsScopeController 快照同形的假 scope：value 为 schema 填默认后的文档值。 */
function fakeScope(initial) {
	const state = { ...initial, user: initial.user ?? {} };
	const listeners = new Set();
	const emit = () => listeners.forEach((listener) => listener());
	return {
		getSnapshot: () => state,
		subscribe(listener) {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		async set(field, value) {
			state.user = { ...state.user, [field]: value };
			state.value = { ...state.value, [field]: value };
			emit();
		},
		async unset(field) {
			const user = { ...state.user };
			delete user[field];
			state.user = user;
			const value = { ...state.value };
			delete value[field];
			state.value = value;
			emit();
		}
	};
}

function readyScope() {
	return fakeScope({
		status: "ready",
		writable: true,
		value: { threshold: 300, previewChars: 120 }
	});
}

describe("DraftFoldCardController（暂存表单）", () => {
	it("编辑后进入脏态，save 只写变更字段并退出脏态", async () => {
		const { DraftFoldCardController } = await loadClientModule();
		const scope = readyScope();
		const controller = new DraftFoldCardController(scope);
		const face = controller.inject();
		face.edit("threshold", "500");
		expect(face.hooks.draftFoldCard.getSnapshot().dirty).toBe(true);

		const writes = [];
		scope.set = async (field, value) => writes.push([field, value]);
		await face.save();
		expect(writes).toEqual([["threshold", 500]]);
		expect(face.hooks.draftFoldCard.getSnapshot().dirty).toBe(false);
	});

	it("非法数字拒绝保存且不丢弃编辑", async () => {
		const { DraftFoldCardController } = await loadClientModule();
		const scope = readyScope();
		const controller = new DraftFoldCardController(scope);
		const face = controller.inject();
		const writes = [];
		scope.set = async (field, value) => writes.push([field, value]);

		face.edit("threshold", "abc");
		expect(face.hooks.draftFoldCard.getSnapshot().threshold.valid).toBe(false);
		await face.save();
		const after = face.hooks.draftFoldCard.getSnapshot();
		expect(writes).toEqual([]);
		expect(after.failed).toBe(true);
		expect(after.threshold.text).toBe("abc");
	});

	it("discard 丢弃暂存，不触发写入", async () => {
		const { DraftFoldCardController } = await loadClientModule();
		const scope = readyScope();
		const controller = new DraftFoldCardController(scope);
		const face = controller.inject();
		const writes = [];
		scope.set = async (field, value) => writes.push([field, value]);

		face.edit("previewChars", "80");
		face.discard();
		expect(face.hooks.draftFoldCard.getSnapshot().dirty).toBe(false);
		await face.save();
		expect(writes).toEqual([]);
	});

	it("resetField 走 scope.unset 回到默认层", async () => {
		const { DraftFoldCardController } = await loadClientModule();
		const scope = fakeScope({
			status: "ready",
			writable: true,
			value: { threshold: 500, previewChars: 120 },
			user: { threshold: 500 }
		});
		const controller = new DraftFoldCardController(scope);
		const face = controller.inject();
		const clears = [];
		scope.unset = async (field) => clears.push(field);

		expect(face.hooks.draftFoldCard.getSnapshot().threshold.overridden).toBe(true);
		await face.resetField("threshold");
		expect(clears).toEqual(["threshold"]);
	});

	it("只读时字段禁用且保存拒绝", async () => {
		const { DraftFoldCardController } = await loadClientModule();
		const scope = fakeScope({ status: "ready", writable: false, value: { threshold: 300, previewChars: 120 } });
		const controller = new DraftFoldCardController(scope);
		const face = controller.inject();
		const writes = [];
		scope.set = async (field, value) => writes.push([field, value]);

		const state = face.hooks.draftFoldCard.getSnapshot();
		expect(state.writable).toBe(false);
		face.edit("threshold", "999");
		await face.save();
		expect(writes).toEqual([]);
	});
});
