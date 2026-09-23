/** 手动实例化浏览器 bundle：捕获 factory，用真实 react 系包充当同步 require。 */
let cached;
export async function loadClientModule() {
	if (cached) return cached;
	const modules = globalThis.__draftFoldModules;
	if (!modules) throw new Error("tests/setup.js 必须先安装 window.__ModuleLoader__");
	modules.clear();
	await import("../lib/client.js");
	const factory = modules.get("@ztyss/dsh-draft-fold");
	if (typeof factory !== "function") throw new Error("client bundle 未注册 @ztyss/dsh-draft-fold");
	const [react, reactDom, jsxRuntime] = await Promise.all([
		import("react"),
		import("react-dom"),
		import("react/jsx-runtime")
	]);
	const reactCjs = react.default ?? react;
	const h = reactCjs.createElement;
	const primitivesStub = {
		Tag: (props) => h("span", { "data-tag": props.tone ?? "" }, props.children),
		IconChevronDownOutline14: (props) => h("svg", { className: props.className })
	};
	const bare = {
		react: reactCjs,
		"react-dom": reactDom.default ?? reactDom,
		"react/jsx-runtime": jsxRuntime.default ?? jsxRuntime,
		"@deepseek-ai/dsh-client-ui-primitives": primitivesStub
	};
	cached = factory((id) => {
		const value = bare[id];
		if (value === void 0) throw new Error('client bundle 意外 require("' + id + '")');
		return value;
	});
	return cached;
}

/** 测试用翻译：直接返回 key，断言以 key 文本定位。 */
export const identityT = (key) => key;
