// jsdom 环境下为 client.js 的浏览器模块注册器装一个捕获器：
// lib/client.js 顶层调用 window.__ModuleLoader__.load({ id, factory })，
// 测试通过捕获的 factory + 自备 require shim 手动实例化模块。
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
if (globalThis.window) {
	const modules = new Map();
	globalThis.window.__ModuleLoader__ = {
		load(definition) {
			modules.set(definition.id, definition.factory);
		}
	};
	globalThis.__draftFoldModules = modules;
}
