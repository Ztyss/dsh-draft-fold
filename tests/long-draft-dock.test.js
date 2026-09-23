import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
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
