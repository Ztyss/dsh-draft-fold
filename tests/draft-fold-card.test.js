import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { identityT, loadClientModule } from "./client-module.js";

function cardState(overrides = {}) {
	return {
		available: true,
		threshold: { value: 300, text: "300", valid: true, staged: false, overridden: false, max: 200000 },
		previewChars: { value: 120, text: "120", valid: true, staged: false, overridden: false, max: 2000 },
		writable: true,
		dirty: false,
		saving: false,
		failed: false,
		invalid: false,
		...overrides
	};
}

function renderCard(DraftFoldCard, state, actions = {}) {
	const calls = { edit: [], save: 0, discard: 0, resetField: [] };
	const { container } = render(createElement(DraftFoldCard, {
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
	calls.container = container;
	return calls;
}

/** 收起态头部按钮的可访问名是 expand（点击将展开）；展开态是 collapse。 */
function clickExpandHeader() {
	fireEvent.click(screen.getByRole("button", { name: /^settings\.expand/ }));
}

afterEach(cleanup);

describe("DraftFoldCard（草稿折叠设置卡，官方 PluginCard 壳）", () => {
	it("命名空间不可用时渲染 null", async () => {
		const { DraftFoldCard } = await loadClientModule();
		const calls = renderCard(DraftFoldCard, cardState({ available: false }));
		expect(calls.container.innerHTML).toBe("");
	});

	it("默认收起：头部含标题与描述，字段不可见，可访问名为 expand", async () => {
		const { DraftFoldCard } = await loadClientModule();
		renderCard(DraftFoldCard, cardState());
		expect(screen.getByText("settings.title")).not.toBeNull();
		expect(screen.getByText("settings.description")).not.toBeNull();
		expect(screen.queryByLabelText("settings.threshold")).toBeNull();
		expect(screen.getByRole("button", { name: /^settings\.expand/ })).not.toBeNull();
		expect(screen.queryByRole("button", { name: /^settings\.collapse/ })).toBeNull();
	});

	it("点击头部展开：字段出现，干净态保存/放弃禁用，可访问名切为 collapse", async () => {
		const { DraftFoldCard } = await loadClientModule();
		renderCard(DraftFoldCard, cardState());
		clickExpandHeader();
		expect(screen.getByLabelText("settings.threshold").value).toBe("300");
		expect(screen.getByLabelText("settings.previewChars").value).toBe("120");
		expect(screen.getByText("settings.thresholdHint")).not.toBeNull();
		expect(screen.getByRole("button", { name: /^settings\.collapse/ })).not.toBeNull();
		expect(screen.getByText("settings.save").disabled).toBe(true);
		expect(screen.getByText("settings.discard").disabled).toBe(true);
	});

	it("脏态：头部出现未保存徽标，保存可点且回调", async () => {
		const { DraftFoldCard } = await loadClientModule();
		const calls = renderCard(DraftFoldCard, cardState({
			dirty: true,
			threshold: { value: 300, text: "500", valid: true, staged: true, overridden: false, max: 200000 }
		}));
		expect(screen.getByText("settings.unsaved")).not.toBeNull();
		clickExpandHeader();
		const save = screen.getByText("settings.save");
		expect(save.disabled).toBe(false);
		save.click();
		expect(calls.save).toBe(1);
	});

	it("字段编辑走 edit 回调；非法态提示 invalidNumber 且保存禁用", async () => {
		const { DraftFoldCard } = await loadClientModule();
		const calls = renderCard(DraftFoldCard, cardState({
			dirty: true,
			threshold: { value: 300, text: "abc", valid: false, staged: true, overridden: false, max: 200000 },
			invalid: true
		}));
		clickExpandHeader();
		const input = screen.getByLabelText("settings.threshold");
		fireEvent.change(input, { target: { value: "500" } });
		expect(calls.edit).toEqual([["threshold", "500"]]);
		expect(screen.getByText("settings.invalidNumber")).not.toBeNull();
		expect(screen.getByText("settings.save").disabled).toBe(true);
	});

	it("只读：头部展开后输入禁用并显示只读提示", async () => {
		const { DraftFoldCard } = await loadClientModule();
		renderCard(DraftFoldCard, cardState({ writable: false }));
		clickExpandHeader();
		expect(screen.getByLabelText("settings.threshold").disabled).toBe(true);
		expect(screen.getByText("settings.readOnly")).not.toBeNull();
		expect(screen.getByText("settings.save").disabled).toBe(true);
	});

	it("覆盖字段显示已覆盖徽标与恢复默认按钮", async () => {
		const { DraftFoldCard } = await loadClientModule();
		renderCard(DraftFoldCard, cardState({
			threshold: { value: 500, text: "500", valid: true, staged: false, overridden: true, max: 200000 }
		}));
		clickExpandHeader();
		expect(screen.getByText("settings.overridden")).not.toBeNull();
		screen.getByText("settings.reset").click();
	});

	it("保存失败时显示失败提示", async () => {
		const { DraftFoldCard } = await loadClientModule();
		renderCard(DraftFoldCard, cardState({ failed: true, dirty: true }));
		clickExpandHeader();
		expect(screen.getByText("settings.saveFailed")).not.toBeNull();
	});
});
