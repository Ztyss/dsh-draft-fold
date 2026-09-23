import { describe, expect, it } from "vitest";
import { apply } from "../lib/index.js";

function fakeHostCtx() {
	const registered = [];
	const ctx = {
		inject(services, fn) {
			if (services.includes("settings")) fn({ settings: { register: (...args) => registered.push(args) } });
		}
	};
	return { ctx, registered };
}

describe("host apply（注册设置命名空间）", () => {
	it("向 settings 服务注册 draft-fold 命名空间（live 生效）", () => {
		const { ctx, registered } = fakeHostCtx();
		apply(ctx);
		expect(registered.length).toBe(1);
		expect(registered[0][0]).toBe("draft-fold");
		expect(registered[0][2]).toEqual({ applies: "live" });
	});

	it("settings 服务缺失时不炸（部署未组合该服务）", () => {
		const ctx = { inject(services, fn) { /* 什么都不提供 */ } };
		expect(() => apply(ctx)).not.toThrow();
	});
});
