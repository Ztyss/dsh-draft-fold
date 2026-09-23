import { describe, expect, it } from "vitest";
import { loadClientModule } from "./client-module.js";

describe("effectiveFromSnapshot（设置文档 → 生效阈值）", () => {
	it("文档就绪时以文档值为准", async () => {
		const { effectiveFromSnapshot } = await loadClientModule();
		const effective = effectiveFromSnapshot(
			{ status: "ready", value: { threshold: 500, previewChars: 60 } },
			{ threshold: 300, previewChars: 120 }
		);
		expect(effective).toEqual({ threshold: 500, previewChars: 60 });
	});

	it("未就绪时回退内置默认", async () => {
		const { effectiveFromSnapshot } = await loadClientModule();
		expect(effectiveFromSnapshot({ status: "idle" }, { threshold: 300, previewChars: 120 }))
			.toEqual({ threshold: 300, previewChars: 120 });
		expect(effectiveFromSnapshot(void 0, { threshold: 300, previewChars: 120 }))
			.toEqual({ threshold: 300, previewChars: 120 });
	});

	it("字段缺失或非法时逐字段回退", async () => {
		const { effectiveFromSnapshot } = await loadClientModule();
		const effective = effectiveFromSnapshot(
			{ status: "ready", value: { threshold: "很多", previewChars: 0 } },
			{ threshold: 300, previewChars: 120 }
		);
		expect(effective).toEqual({ threshold: 300, previewChars: 120 });
	});
});

describe("createEffectiveStore（活订阅）", () => {
	it("scope 更新后快照随之更新，值不变时保持同一对象身份", async () => {
		const { createEffectiveStore } = await loadClientModule();
		const listeners = new Set();
		let snap = { status: "ready", value: { threshold: 300, previewChars: 120 } };
		const scope = {
			getSnapshot: () => snap,
			subscribe(listener) {
				listeners.add(listener);
				return () => listeners.delete(listener);
			}
		};
		const store = createEffectiveStore(scope);
		const first = store.getSnapshot();
		expect(first).toEqual({ threshold: 300, previewChars: 120 });

		const events = [];
		store.subscribe(() => events.push(store.getSnapshot().threshold));

		snap = { status: "ready", value: { threshold: 800, previewChars: 120 } };
		listeners.forEach((listener) => listener());
		expect(store.getSnapshot()).toEqual({ threshold: 800, previewChars: 120 });
		expect(events).toEqual([800]);

		const before = store.getSnapshot();
		snap = { status: "ready", value: { threshold: 800, previewChars: 120 } };
		listeners.forEach((listener) => listener());
		expect(store.getSnapshot()).toBe(before);
		expect(events).toEqual([800]);
	});
});
