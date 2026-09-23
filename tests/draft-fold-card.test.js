import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { identityT, loadClientModule } from "./client-module.js";

function cardState(overrides = {}) {
	return {
		threshold: { value: 300, text: "300", valid: true, staged: false, overridden: false, max: 200000 },
		previewChars: { value: 120, text: "120", valid: true, staged: false, overridden: false, max: 2000 },
		writable: true,
		dirty: false,
		saving: false,
		failed: false,
		...overrides
	};
}

function renderCard(DraftFoldCard, state, actions = {}) {
	const calls = { edit: [], save: 0, discard: 0, resetField: [] };
	render(createElement(DraftFoldCard, {
		t: identityT,
		useDraftFoldCard: (selector) => selector(state),
		edit: (field, text) => calls.edit.push([field, text]),
		save: () => {
			calls.save += 1;
		},
		discard: () => {
			calls.discard += 1;
		},
		resetField: (field) => calls.resetField.push(field),
		...actions
	}));
	return calls;
}

afterEach(cleanup);

describe("DraftFoldCard（草稿折叠设置卡）", () => {
	it("渲染标题、描述与两个数字字段", async () => {
		const { DraftFoldCard } = await loadClientModule();
		renderCard(DraftFoldCard, cardState());
		expect(screen.getByText("settings.title")).not.toBeNull();
		expect(screen.getByText("settings.description")).not.toBeNull();
		expect(screen.getByLabelText("settings.threshold").value).toBe("300");
		expect(screen.getByLabelText("settings.previewChars").value).toBe("120");
		expect(screen.getByText("settings.thresholdHint")).not.toBeNull();
	});

	it("干净态时保存与放弃修改禁用", async () => {
		const { DraftFoldCard } = await loadClientModule();
		renderCard(DraftFoldCard, cardState());
		expect(screen.getByText("settings.save").disabled).toBe(true);
		expect(screen.getByText("settings.discard").disabled).toBe(true);
	});

	it("脏态时启用保存/放弃修改并显示未保存标记，点击回调", async () => {
		const { DraftFoldCard } = await loadClientModule();
		const calls = renderCard(DraftFoldCard, cardState({
			dirty: true,
			threshold: { value: 300, text: "500", valid: true, staged: true, overridden: false, max: 200000 }
		}));
		expect(screen.getByText("settings.unsaved")).not.toBeNull();
		const save = screen.getByText("settings.save");
		expect(save.disabled).toBe(false);
		save.click();
		expect(calls.save).toBe(1);
		screen.getByText("settings.discard").click();
		expect(calls.discard).toBe(1);
	});

	it("编辑输入框走 edit 回调；非法态提示 invalidNumber", async () => {
		const { DraftFoldCard } = await loadClientModule();
		const calls = renderCard(DraftFoldCard, cardState({
			threshold: { value: 300, text: "abc", valid: false, staged: true, overridden: false, max: 200000 }
		}));
		const input = screen.getByLabelText("settings.threshold");
		fireEvent.change(input, { target: { value: "500" } });
		expect(calls.edit).toEqual([["threshold", "500"]]);
		expect(screen.getByText("settings.invalidNumber")).not.toBeNull();
	});

	it("只读时输入与按钮禁用并显示只读提示", async () => {
		const { DraftFoldCard } = await loadClientModule();
		renderCard(DraftFoldCard, cardState({ writable: false }));
		expect(screen.getByLabelText("settings.threshold").disabled).toBe(true);
		expect(screen.getByText("settings.readOnly")).not.toBeNull();
		expect(screen.getByText("settings.save").disabled).toBe(true);
	});

	it("保存失败时显示失败提示", async () => {
		const { DraftFoldCard } = await loadClientModule();
		renderCard(DraftFoldCard, cardState({ failed: true, dirty: true }));
		expect(screen.getByText("settings.saveFailed")).not.toBeNull();
	});
});
