import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { identityT, loadClientModule } from "./client-module.js";

/** 复刻 composer 座位：carrierRef.closest 依赖 [data-composer-seat]，portal 落在 [data-composer-card]。 */
function Seat(props) {
	return createElement(
		"div",
		{ "data-composer-seat": "" },
		createElement("div", { "data-composer-card": "" }),
		props.children
	);
}

function renderDock(LongDraftDock, draft, threshold) {
	return render(
		createElement(Seat, null, createElement(LongDraftDock, {
			input: { draft },
			inputActions: { setDraft() {}, submit() {} },
			t: identityT,
			threshold,
			previewChars: 120
		}))
	);
}

afterEach(cleanup);

describe("LongDraftDock 折叠边界", () => {
	it("草稿超过阈值时渲染摘要卡", async () => {
		const { LongDraftDock } = await loadClientModule();
		renderDock(LongDraftDock, "a".repeat(301), 300);
		expect(screen.queryByTestId("long-draft-summary")).not.toBeNull();
	});

	it("草稿恰好等于阈值时不折叠", async () => {
		const { LongDraftDock } = await loadClientModule();
		renderDock(LongDraftDock, "a".repeat(300), 300);
		expect(screen.queryByTestId("long-draft-summary")).toBeNull();
	});
});

describe("LongDraftDock 折叠态补充输入", () => {
	const LONG = "a".repeat(301);

	async function renderLive({ submit, setDraft } = {}) {
		const { LongDraftDock } = await loadClientModule();
		return render(createElement(Seat, null, createElement(LongDraftDock, {
			input: { draft: LONG },
			inputActions: {
				setDraft: setDraft ?? (() => {}),
				submit: submit ?? (() => {})
			},
			t: identityT,
			threshold: 300,
			previewChars: 120
		})));
	}

	it("Enter 触发 submit；Shift+Enter 不触发", async () => {
		const submit = vi.fn();
		await renderLive({ submit });
		const box = screen.getByTestId("long-draft-supplement");
		fireEvent.keyDown(box, { key: "Enter" });
		expect(submit).toHaveBeenCalledTimes(1);
		fireEvent.keyDown(box, { key: "Enter", shiftKey: true });
		expect(submit).toHaveBeenCalledTimes(1);
	});

	it("IME 组合中的 Enter 不触发 submit", async () => {
		const submit = vi.fn();
		await renderLive({ submit });
		const box = screen.getByTestId("long-draft-supplement");
		const imeEvent = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
		Object.defineProperty(imeEvent, "isComposing", { value: true });
		fireEvent(box, imeEvent);
		expect(submit).not.toHaveBeenCalled();
	});

	it("宿主 setDraft 抢走焦点后，焦点归还补充框", async () => {
		const setDraft = vi.fn(() => {
			if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
		});
		await renderLive({ setDraft });
		const box = screen.getByTestId("long-draft-supplement");
		box.focus();
		fireEvent.change(box, { target: { value: "补充内容" } });
		expect(setDraft).toHaveBeenCalled();
		expect(document.activeElement).toBe(box);
	});

	it("setDraft 收到长文与补充的合并全文", async () => {
		const setDraft = vi.fn();
		await renderLive({ setDraft });
		const box = screen.getByTestId("long-draft-supplement");
		fireEvent.change(box, { target: { value: "补充内容" } });
		expect(setDraft).toHaveBeenLastCalledWith(`${LONG}\n补充内容`);
	});
});
