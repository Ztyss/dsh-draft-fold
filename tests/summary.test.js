import { describe, expect, it } from "vitest";
import { loadClientModule } from "./client-module.js";

describe("summarizeDraft（现有行为回归网）", () => {
	it("首行预览按 previewChars 截断并标记 truncated", async () => {
		const { summarizeDraft } = await loadClientModule();
		const summary = summarizeDraft("hello world\nsecond line", 5);
		expect(summary.firstLine).toBe("hello world");
		expect(summary.preview).toBe("hello…");
		expect(summary.truncated).toBe(true);
	});

	it("未超预览长度时不标记截断，并统计字符与行数", async () => {
		const { summarizeDraft } = await loadClientModule();
		const summary = summarizeDraft("ab\ncd", 10);
		expect(summary.preview).toBe("ab");
		expect(summary.characters).toBe(5);
		expect(summary.lines).toBe(2);
		expect(summary.truncated).toBe(false);
	});
});
