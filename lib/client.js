window.__ModuleLoader__.load({
	id: "@ztyss/dsh-draft-fold",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_dom = require("react-dom");
		let react_jsx_runtime = require("react/jsx-runtime");
		let primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region src/client/summary.ts
		function countCodePoints(value) {
			let count = 0;
			for (const _ of value) count += 1;
			return count;
		}
		function countLines(value) {
			let lines = 1;
			for (let index = 0; index < value.length; index += 1) {
				const char = value[index];
				if (char === "\n") lines += 1;
				else if (char === "\r" && value[index + 1] !== "\n") lines += 1;
			}
			return lines;
		}
		function firstLineOf(value) {
			const breakIndex = value.search(/\r\n|\r|\n/);
			return breakIndex === -1 ? value : value.slice(0, breakIndex);
		}
		function previewOf(value, limit) {
			const safeLimit = Math.max(1, Math.floor(limit));
			let result = "";
			let count = 0;
			for (const char of value) {
				if (count >= safeLimit) return {
					text: `${result}…`,
					truncated: true
				};
				result += char;
				count += 1;
			}
			return {
				text: result,
				truncated: false
			};
		}
		/** Build the small amount of metadata needed by the collapsed card. */
		function summarizeDraft(text, previewChars) {
			const firstLine = firstLineOf(text);
			const preview = previewOf(firstLine, previewChars);
			return {
				firstLine,
				preview: preview.text,
				characters: countCodePoints(text),
				lines: countLines(text),
				truncated: preview.truncated
			};
		}
		//#endregion
		//#region src/client/LongDraftDock.tsx
		function interpolate(text, params) {
			return text.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));
		}
		function combinedDraft(base, supplement) {
			if (supplement === "") return base;
			return `${base}${base.endsWith("\n") ? "" : "\n"}${supplement}`;
		}
		function LongDraftDock({ input, inputActions, t, threshold, previewChars }) {
			const carrierRef = (0, react.useRef)(null);
			const seatRef = (0, react.useRef)(null);
			const [card, setCard] = (0, react.useState)(null);
			const [editorVisible, setEditorVisible] = (0, react.useState)(false);
			const [collapsedDraft, setCollapsedDraft] = (0, react.useState)(null);
			const [supplement, setSupplement] = (0, react.useState)("");
			const draft = input.draft;
			const summaryDraft = collapsedDraft ?? (draft.length > threshold ? draft : null);
			const collapsed = summaryDraft !== null && !editorVisible;
			const summary = summaryDraft === null ? void 0 : summarizeDraft(summaryDraft, previewChars);
			(0, react.useLayoutEffect)(() => {
				if (draft.length <= threshold) {
					setCollapsedDraft(null);
					setSupplement("");
					setEditorVisible(false);
					return;
				}
				if (collapsedDraft === null && !editorVisible) setCollapsedDraft(draft);
			}, [
				collapsedDraft,
				draft,
				editorVisible,
				threshold
			]);
			(0, react.useLayoutEffect)(() => {
				const seat = carrierRef.current?.closest("[data-composer-seat]") ?? seatRef.current;
				if (seat !== null && seat !== void 0) seatRef.current = seat;
				const nextCard = seat?.querySelector("[data-composer-card]") ?? null;
				setCard((current) => current === nextCard ? current : nextCard);
				if (seat === null || seat === void 0) return;
				if (collapsed) seat.dataset.dshLongDraftCollapsed = "";
				else delete seat.dataset.dshLongDraftCollapsed;
				return () => {
					delete seat.dataset.dshLongDraftCollapsed;
				};
			}, [collapsed]);
			(0, react.useLayoutEffect)(() => {
				if (draft.length <= threshold) {
					setEditorVisible(false);
					return;
				}
				if (!editorVisible) return;
				(seatRef.current?.querySelector("[data-input-scroll] textarea"))?.focus({ preventScroll: true });
			}, [
				draft.length,
				editorVisible,
				threshold
			]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				ref: carrierRef,
				className: "dsh-draft-fold__carrier",
				"aria-hidden": "true"
			}), card !== null && summary !== void 0 && (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("section", {
				className: "dsh-draft-fold",
				"data-state": editorVisible ? "editor-visible" : "collapsed",
				"data-testid": "long-draft-summary",
				"aria-label": t("summary.aria"),
				children: !editorVisible && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh-draft-fold__body",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-draft-fold__icon",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-draft-fold__content",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-draft-fold__preview",
								title: summary.firstLine,
								"data-testid": "long-draft-preview",
								children: summary.preview === "" ? t("summary.emptyFirstLine") : summary.preview
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-draft-fold__details",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "dsh-draft-fold__meta",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										"data-testid": "long-draft-character-count",
										children: interpolate(t("summary.characters", { count: summary.characters }), { count: summary.characters })
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										"data-testid": "long-draft-line-count",
										children: interpolate(t("summary.lines", { count: summary.lines }), { count: summary.lines })
									})]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dsh-draft-fold__button",
									"data-testid": "long-draft-show-editor",
									onClick: () => {
										setEditorVisible(true);
									},
									children: t("summary.showEditor")
								})]
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dsh-draft-fold__button dsh-draft-fold__clear",
							"data-testid": "long-draft-clear",
							"aria-label": t("summary.clear"),
							onClick: () => {
								inputActions.setDraft(supplement);
								setCollapsedDraft(null);
								setSupplement("");
								setEditorVisible(false);
							},
							children: "×"
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
					className: "dsh-draft-fold__supplement",
					"data-testid": "long-draft-supplement",
					value: supplement,
					rows: 2,
					"aria-label": t("summary.continue"),
					placeholder: t("summary.continue"),
					onChange: (event) => {
						const next = event.target.value;
						const base = collapsedDraft ?? draft;
						setCollapsedDraft(base);
						setSupplement(next);
						inputActions.setDraft(combinedDraft(base, next));
					}
				})] })
			}), card)] });
		}
		//#endregion
		//#region src/client/locales.ts
		const NS = "dsh-draft-fold";
		const zh = {
			"summary.aria": "长文本草稿摘要",
			"summary.emptyFirstLine": "（首行为空）",
			"summary.characters": "{count} 字符",
			"summary.lines": "{count} 行",
			"summary.showEditor": "在文本框中显示",
			"summary.clear": "移除长文本",
			"summary.continue": "继续输入补充内容…",
			"settings.title": "草稿折叠",
			"settings.description": "草稿超过阈值时收起输入区，折叠为附件式摘要卡。",
			"settings.threshold": "折叠阈值（字符）",
			"settings.thresholdHint": "草稿超过该长度时收起输入区。",
			"settings.previewChars": "摘要预览长度（字符）",
			"settings.previewHint": "摘要卡首行最多展示的字符数。",
			"settings.save": "保存",
			"settings.saving": "保存中…",
			"settings.discard": "放弃修改",
			"settings.reset": "恢复默认",
			"settings.unsaved": "未保存",
			"settings.overridden": "已覆盖",
			"settings.readOnly": "当前连接的设置为只读。",
			"settings.saveFailed": "这些值没有被接受，请修改后重试。",
			"settings.invalidNumber": "请填数字；留空表示使用默认值。",
			"settings.expand": "展开设置",
			"settings.collapse": "收起设置"
		};
		const en = {
			"summary.aria": "Long draft summary",
			"summary.emptyFirstLine": "(empty first line)",
			"summary.characters": "{count} characters",
			"summary.lines": "{count} lines",
			"summary.showEditor": "Show in text box",
			"summary.clear": "Remove long text",
			"summary.continue": "Add instructions…",
			"settings.title": "Draft fold",
			"settings.description": "Collapse long drafts into an attachment-style summary card.",
			"settings.threshold": "Fold threshold (characters)",
			"settings.thresholdHint": "Drafts longer than this collapse the composer.",
			"settings.previewChars": "Summary preview (characters)",
			"settings.previewHint": "How many characters of the first line the summary shows.",
			"settings.save": "Save",
			"settings.saving": "Saving…",
			"settings.discard": "Discard",
			"settings.reset": "Reset to default",
			"settings.unsaved": "Unsaved",
			"settings.overridden": "Overridden",
			"settings.readOnly": "Settings are read-only on this connection.",
			"settings.saveFailed": "These values were not accepted; please revise and retry.",
			"settings.invalidNumber": "Enter a number, or leave blank to use the default.",
			"settings.expand": "Show settings",
			"settings.collapse": "Hide settings"
		};
		//#endregion
		//#region src/client/styles.ts
		const STYLE_ID = "dsh-draft-fold";
		/** Scoped to the composer seat so another text area cannot be affected. */
		const CSS = `
[data-composer-seat][data-dsh-long-draft-collapsed] [data-input-scroll] {
  display: none !important;
}

.dsh-draft-fold__carrier {
  display: none;
}

.dsh-draft-fold {
  box-sizing: border-box;
  order: -1;
  align-self: stretch;
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 20px;
}

.dsh-draft-fold[data-state='editor-visible'] {
  display: none;
}

.dsh-draft-fold__body {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) 28px;
  align-items: center;
  gap: 10px;
  min-width: 0;
  width: min(420px, calc(100% - 24px));
  margin: 0 12px;
  padding: 10px;
  border: 1px solid var(--dsw-alias-border-l2-darkmode-thin);
  border-radius: 16px;
  background: var(--dsw-specific-input-major);
  box-shadow: var(--dsw-shadow-lv2);
}

.dsh-draft-fold__supplement {
  box-sizing: border-box;
  width: 100%;
  min-height: 48px;
  max-height: 120px;
  padding: 4px 16px 0;
  resize: none;
  overflow-y: auto;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font-family: var(--dsw-font-family);
  font-size: 16px;
  line-height: 24px;
}

.dsh-draft-fold__supplement::placeholder {
  color: var(--dsw-alias-label-caption);
}

.dsh-draft-fold__icon {
  position: relative;
  display: block;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-secondary);
}

.dsh-draft-fold__icon::before {
  content: '';
  position: absolute;
  top: 11px;
  right: 9px;
  left: 9px;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
  box-shadow: 0 6px currentColor, 0 12px currentColor;
}

.dsh-draft-fold__content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.dsh-draft-fold__preview {
  min-width: 0;
  display: block;
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dsh-draft-fold__details {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
}

.dsh-draft-fold__meta {
  display: inline-flex;
  min-width: 0;
  overflow: hidden;
  gap: 8px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  white-space: nowrap;
}

.dsh-draft-fold__button {
  flex: none;
  min-height: 24px;
  padding: 2px 6px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}

.dsh-draft-fold__button:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

.dsh-draft-fold__button:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 1px;
}

.dsh-draft-fold__clear {
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 999px;
  background: var(--dsw-specific-selector);
  color: var(--dsw-alias-label-tertiary);
  font-size: 18px;
  line-height: 28px;
}

.dsh-draft-fold__clear:hover {
  background: var(--dsw-alias-interactive-bg-hover-solid);
}

.dff-card {
  border: 0.5px solid var(--dsw-alias-border-l4);
  background: var(--dsw-alias-bg-layer-3);
  border-radius: 16px;
  list-style: none;
  transition: border-color 0.16s, background 0.16s;
}

.dff-card:hover {
  border-color: var(--dsw-alias-label-dimmed);
}

.dff-cardOpen {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-label-dimmed);
}

.dff-header {
  appearance: none;
  width: 100%;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 12px;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  display: flex;
}

.dff-header:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: -2px;
}

.dff-headText {
  flex-direction: column;
  flex: 1;
  gap: 4px;
  min-width: 0;
  display: flex;
}

.dff-name {
  color: var(--dsw-alias-label-primary);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}

.dff-description {
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 1.5;
}

.dff-chevron {
  color: var(--dsw-alias-label-tertiary);
  flex: none;
  transition: transform 0.16s;
}

.dff-chevronOpen {
  transform: rotate(180deg);
}

.dff-body {
  border-top: 0.5px solid var(--dsw-alias-border-l2);
  margin: 0 16px;
  padding-bottom: 8px;
}

.dff-readOnly {
  color: var(--dsw-alias-label-tertiary);
  margin: 12px 0 0;
  font-size: 12px;
  line-height: 1.5;
}

.dff-pending {
  flex: none;
}

.dff-footer {
  border-top: 0.5px solid var(--dsw-alias-border-l2);
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 12px 0 4px;
  display: flex;
}

.dff-failed {
  min-width: 0;
  color: var(--dsw-alias-label-error);
  flex: 1;
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}

.dff-discard, .dff-save {
  appearance: none;
  font: inherit;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 5px 14px;
  font-size: 13px;
  line-height: 1.5;
}

.dff-discard {
  border-color: var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-secondary);
  background: transparent;
}

.dff-discard:hover:not(:disabled) {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-label-dimmed);
}

.dff-save {
  background: var(--dsw-alias-label-primary);
  color: var(--dsw-alias-bg-layer-3);
}

.dff-discard:disabled, .dff-save:disabled {
  opacity: 0.4;
  cursor: default;
}

.dff-discard:focus-visible, .dff-save:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}

.dff-field {
  flex-direction: column;
  gap: 6px;
  padding: 12px 0;
  display: flex;
}

.dff-field + .dff-field {
  border-top: 0.5px solid var(--dsw-alias-border-l2);
}

.dff-head {
  align-items: center;
  gap: 8px;
  display: flex;
}

.dff-label {
  min-width: 0;
  color: var(--dsw-alias-label-primary);
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
}

.dff-badges {
  align-items: center;
  gap: 8px;
  display: inline-flex;
}

.dff-reset {
  font: inherit;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;
  font-size: 12px;
  line-height: 1.5;
}

.dff-reset:hover:not(:disabled) {
  color: var(--dsw-alias-label-primary);
}

.dff-reset:disabled {
  cursor: default;
}

.dff-input {
  border: 0.5px solid var(--dsw-alias-border-l4);
  background: var(--dsw-alias-bg-layer-3);
  height: 34px;
  font: inherit;
  color: var(--dsw-alias-label-primary);
  border-radius: 8px;
  padding: 0 12px;
  font-size: 13px;
  line-height: 1.5;
}

.dff-input:focus-visible {
  border-color: var(--dsw-alias-brand-primary);
  outline: none;
}

.dff-input:disabled {
  color: var(--dsw-alias-label-tertiary);
  cursor: default;
}

.dff-inputInvalid {
  border-color: var(--dsw-alias-label-error);
}

.dff-invalid {
  color: var(--dsw-alias-label-error);
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}

.dff-hint {
  color: var(--dsw-alias-label-tertiary);
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}

`;
		/** Install one plugin-owned style tag and return an idempotent disposer. */
		function installStyles() {
			if (typeof document === "undefined") return () => {};
			if (document.querySelector(`style[data-plugin-css="dsh-draft-fold"]`) !== null) return () => {};
			const style = document.createElement("style");
			style.dataset.plugin = STYLE_ID;
			style.dataset.pluginCss = STYLE_ID;
			style.textContent = CSS;
			document.head.append(style);
			return () => {
				style.remove();
			};
		}
		//#endregion
		//#region node_modules/.pnpm/@deepseek-ai+cosmokit@1.8.2/node_modules/@deepseek-ai/cosmokit/lib/index.js
		/** Return true when a value is `null` or `undefined`. */
		function isNullable(value) {
			return value === null || value === void 0;
		}
		/** Return true for non-array object values. */
		function isPlainObject(data) {
			return data && typeof data === "object" && !Array.isArray(data);
		}
		/** Filter object entries and return a new object. */
		function filterKeys(object, filter) {
			return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
		}
		/** Map object values while preserving the original key set. */
		function mapValues(object, transform) {
			return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
		}
		/** Pick selected keys from an object, optionally including `undefined` values. */
		function pick(source, keys, forced) {
			if (!keys) return { ...source };
			const result = {};
			for (const key of keys) if (forced || source[key] !== void 0) result[key] = source[key];
			return result;
		}
		/** Test values using `instanceof` with a `toStringTag` fallback. */
		function is(type, value) {
			if (arguments.length === 1) return (value) => is(type, value);
			return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
		}
		function isArrayBufferLike(value) {
			return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
		}
		function isArrayBufferSource(value) {
			return isArrayBufferLike(value) || ArrayBuffer.isView(value);
		}
		/** Binary source detection and base64/hex conversion helpers. */
		var Binary;
		(function(Binary) {
			Binary.is = isArrayBufferLike;
			Binary.isSource = isArrayBufferSource;
			function fromSource(source) {
				if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
				else return source;
			}
			Binary.fromSource = fromSource;
			function toBase64(source) {
				source = fromSource(source);
				if (typeof Buffer !== "undefined") return Buffer.from(source).toString("base64");
				let binary = "";
				const bytes = new Uint8Array(source);
				for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
				return btoa(binary);
			}
			Binary.toBase64 = toBase64;
			function fromBase64(source) {
				if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
				return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
			}
			Binary.fromBase64 = fromBase64;
			function toHex(source) {
				source = fromSource(source);
				if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
				return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
			}
			Binary.toHex = toHex;
			function fromHex(source) {
				if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
				const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
				const buffer = [];
				for (let i = 0; i < hex.length; i += 2) buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
				return Uint8Array.from(buffer).buffer;
			}
			Binary.fromHex = fromHex;
		})(Binary || (Binary = {}));
		Binary.fromBase64;
		Binary.toBase64;
		Binary.fromHex;
		Binary.toHex;
		/** Deep-clone common JavaScript values while preserving prototypes and cycles. */
		function clone(source, refs = /* @__PURE__ */ new Map()) {
			if (!source || typeof source !== "object") return source;
			if (is("Date", source)) return new Date(source.valueOf());
			if (is("RegExp", source)) return new RegExp(source.source, source.flags);
			if (isArrayBufferLike(source)) return source.slice(0);
			if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
			const cached = refs.get(source);
			if (cached) return cached;
			if (Array.isArray(source)) {
				const result = [];
				refs.set(source, result);
				source.forEach((value, index) => {
					result[index] = Reflect.apply(clone, null, [value, refs]);
				});
				return result;
			}
			const result = Object.create(Object.getPrototypeOf(source));
			refs.set(source, result);
			for (const key of Reflect.ownKeys(source)) {
				const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
				if ("value" in descriptor) descriptor.value = Reflect.apply(clone, null, [descriptor.value, refs]);
				Reflect.defineProperty(result, key, descriptor);
			}
			return result;
		}
		/** Deeply compare arrays, dates, regexps, buffers, and plain object fields. */
		function deepEqual(a, b, strict) {
			if (a === b) return true;
			if (!strict && isNullable(a) && isNullable(b)) return true;
			if (typeof a !== typeof b) return false;
			if (typeof a !== "object") return false;
			if (!a || !b) return false;
			function check(test, then) {
				return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
			}
			return check(Array.isArray, (a, b) => a.length === b.length && a.every((item, index) => deepEqual(item, b[index]))) ?? check(is("Date"), (a, b) => a.valueOf() === b.valueOf()) ?? check(is("RegExp"), (a, b) => a.source === b.source && a.flags === b.flags) ?? check(isArrayBufferLike, (a, b) => {
				if (a.byteLength !== b.byteLength) return false;
				const viewA = new Uint8Array(a);
				const viewB = new Uint8Array(b);
				for (let i = 0; i < viewA.length; i++) if (viewA[i] !== viewB[i]) return false;
				return true;
			}) ?? Object.keys({
				...a,
				...b
			}).every((key) => deepEqual(a[key], b[key], strict));
		}
		/** Time constants plus parsing and formatting helpers. */
		var Time;
		(function(Time) {
			Time.millisecond = 1;
			Time.second = 1e3;
			Time.minute = Time.second * 60;
			Time.hour = Time.minute * 60;
			Time.day = Time.hour * 24;
			Time.week = Time.day * 7;
			let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
			function setTimezoneOffset(offset) {
				timezoneOffset = offset;
			}
			Time.setTimezoneOffset = setTimezoneOffset;
			function getTimezoneOffset() {
				return timezoneOffset;
			}
			Time.getTimezoneOffset = getTimezoneOffset;
			function getDateNumber(date = /* @__PURE__ */ new Date(), offset) {
				if (typeof date === "number") date = new Date(date);
				if (offset === void 0) offset = timezoneOffset;
				return Math.floor((date.valueOf() / Time.minute - offset) / 1440);
			}
			Time.getDateNumber = getDateNumber;
			function fromDateNumber(value, offset) {
				const date = new Date(value * Time.day);
				if (offset === void 0) offset = timezoneOffset;
				return new Date(+date + offset * Time.minute);
			}
			Time.fromDateNumber = fromDateNumber;
			const numeric = /\d+(?:\.\d+)?/.source;
			const timeRegExp = new RegExp(`^${[
				"w(?:eek(?:s)?)?",
				"d(?:ay(?:s)?)?",
				"h(?:our(?:s)?)?",
				"m(?:in(?:ute)?(?:s)?)?",
				"s(?:ec(?:ond)?(?:s)?)?"
			].map((unit) => `(${numeric}${unit})?`).join("")}$`);
			function parseTime(source) {
				const capture = timeRegExp.exec(source);
				if (!capture) return 0;
				return (parseFloat(capture[1]) * Time.week || 0) + (parseFloat(capture[2]) * Time.day || 0) + (parseFloat(capture[3]) * Time.hour || 0) + (parseFloat(capture[4]) * Time.minute || 0) + (parseFloat(capture[5]) * Time.second || 0);
			}
			Time.parseTime = parseTime;
			function parseDate(date) {
				const parsed = parseTime(date);
				if (parsed) date = Date.now() + parsed;
				else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date}`;
				else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date}`;
				return date ? new Date(date) : /* @__PURE__ */ new Date();
			}
			Time.parseDate = parseDate;
			function format(ms) {
				const abs = Math.abs(ms);
				if (abs >= Time.day - Time.hour / 2) return Math.round(ms / Time.day) + "d";
				else if (abs >= Time.hour - Time.minute / 2) return Math.round(ms / Time.hour) + "h";
				else if (abs >= Time.minute - Time.second / 2) return Math.round(ms / Time.minute) + "m";
				else if (abs >= Time.second) return Math.round(ms / Time.second) + "s";
				return ms + "ms";
			}
			Time.format = format;
			function toDigits(source, length = 2) {
				return source.toString().padStart(length, "0");
			}
			Time.toDigits = toDigits;
			function template(template, time = /* @__PURE__ */ new Date()) {
				return template.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
			}
			Time.template = template;
		})(Time || (Time = {}));
		//#endregion
		//#region \0@oxc-project+runtime@0.144.0/helpers/esm/typeof.js
		function _typeof(o) {
			"@babel/helpers - typeof";
			return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
				return typeof o;
			} : function(o) {
				return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
			}, _typeof(o);
		}
		//#endregion
		//#region \0@oxc-project+runtime@0.144.0/helpers/esm/toPrimitive.js
		function toPrimitive(t, r) {
			if ("object" != _typeof(t) || !t) return t;
			var e = t[Symbol.toPrimitive];
			if (void 0 !== e) {
				var i = e.call(t, r || "default");
				if ("object" != _typeof(i)) return i;
				throw new TypeError("@@toPrimitive must return a primitive value.");
			}
			return ("string" === r ? String : Number)(t);
		}
		//#endregion
		//#region \0@oxc-project+runtime@0.144.0/helpers/esm/toPropertyKey.js
		function toPropertyKey(t) {
			var i = toPrimitive(t, "string");
			return "symbol" == _typeof(i) ? i : i + "";
		}
		//#endregion
		//#region \0@oxc-project+runtime@0.144.0/helpers/esm/defineProperty.js
		function _defineProperty(e, r, t) {
			return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
				value: t,
				enumerable: !0,
				configurable: !0,
				writable: !0
			}) : e[r] = t, e;
		}
		//#endregion
		//#region src/client/settings.ts
		/** Settings namespace registered by the Host and edited from 插件配置. */
		const SETTINGS_NS = "draft-fold";
		/** Defaults shared by the Host settings schema and the client-side fallback. */
		const DEFAULT_CONFIG = {
			threshold: 300,
			previewChars: 120
		};
		/** Upper bounds accepted by the card; anything beyond falls back. */
		const THRESHOLD_MAX = 2e5;
		const PREVIEW_MAX = 2e3;
		function clampNatural(value, fallback, max) {
			if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
			const rounded = Math.floor(value);
			if (rounded < 1 || rounded > max) return fallback;
			return rounded;
		}
		/** Effective fold limits: the settings document when ready, per-field fallback otherwise. */
		function effectiveFromSnapshot(snapshot, defaults = DEFAULT_CONFIG) {
			const value = snapshot !== void 0 && snapshot !== null && snapshot.status === "ready" ? snapshot.value : void 0;
			return {
				threshold: clampNatural(value?.threshold, defaults.threshold, THRESHOLD_MAX),
				previewChars: clampNatural(value?.previewChars, defaults.previewChars, PREVIEW_MAX)
			};
		}
		/** Live store over one bound settings scope; identity-stable until values change. */
		function createEffectiveStore(scope) {
			let current = effectiveFromSnapshot(scope.getSnapshot());
			const listeners = new Set();
			const refresh = () => {
				const next = effectiveFromSnapshot(scope.getSnapshot());
				if (next.threshold === current.threshold && next.previewChars === current.previewChars) return;
				current = next;
				for (const listener of listeners) listener();
			};
			const unsubscribe = scope.subscribe(refresh);
			return {
				getSnapshot: () => current,
				subscribe(listener) {
					listeners.add(listener);
					return () => listeners.delete(listener);
				},
				stop: unsubscribe
			};
		}
		//#endregion
		//#region src/client/card-form.ts
		function numberField(field, max) {
			return { field, max };
		}
		/** Staged numeric form over one bound settings scope: edit → save/discard, per-field reset. */
		class DraftFoldForm {
			constructor(scope, fields) {
				this.scope = scope;
				this.fields = fields;
				this.staged = new Map();
				this.saving = false;
				this.failed = false;
				this.cached = void 0;
				this.listeners = new Set();
				scope.subscribe(() => this.publish());
			}
			subscribe(listener) {
				this.listeners.add(listener);
				return () => this.listeners.delete(listener);
			}
			publish() {
				this.cached = void 0;
				for (const listener of this.listeners) listener();
			}
			spec(field) {
				const spec = this.fields.find((candidate) => candidate.field === field);
				if (spec === void 0) throw new Error("draft-fold card has no field " + field);
				return spec;
			}
			writable() {
				const snapshot = this.scope.getSnapshot();
				return snapshot !== void 0 && snapshot !== null && snapshot.writable === true;
			}
			documentValue(field) {
				const value = this.scope.getSnapshot()?.value?.[field];
				return typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : void 0;
			}
			userHas(field) {
				const user = this.scope.getSnapshot()?.user;
				return user !== void 0 && Object.hasOwn(user, field);
			}
			edit(field, text) {
				this.spec(field);
				this.staged.set(field, String(text));
				this.failed = false;
				this.publish();
			}
			discard() {
				if (this.staged.size === 0 && !this.failed) return;
				this.staged.clear();
				this.failed = false;
				this.publish();
			}
			async resetField(field) {
				this.spec(field);
				this.staged.delete(field);
				this.failed = false;
				if (this.writable() && this.userHas(field)) await this.scope.unset(field);
				this.publish();
			}
			parse(field, text) {
				const max = this.spec(field).max;
				const trimmed = text.trim();
				if (trimmed === "") return { kind: "clear" };
				const parsed = Number(trimmed);
				if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) return { kind: "invalid" };
				return { kind: "value", value: parsed };
			}
			async save() {
				if (this.saving) return;
				if (!this.writable() || this.staged.size === 0) return;
				const plan = [];
				for (const { field, max } of this.fields) {
					const staged = this.staged.get(field);
					if (staged === void 0) continue;
					const parsed = this.parse(field, staged);
					if (parsed.kind === "invalid") {
						this.failed = true;
						continue;
					}
					if (parsed.kind === "clear") {
						if (this.userHas(field)) plan.push({ field, run: () => this.scope.unset(field) });
						else this.staged.delete(field);
						continue;
					}
					if (parsed.value === this.documentValue(field)) {
						this.staged.delete(field);
						continue;
					}
					plan.push({ field, run: () => this.scope.set(field, parsed.value) });
				}
				if (this.failed || plan.length === 0) {
					this.publish();
					return;
				}
				this.saving = true;
				this.publish();
				let landed = true;
				for (const step of plan) {
					try {
						await step.run();
					} catch {
						landed = false;
					}
				}
				if (landed) this.staged.clear();
				this.saving = false;
				this.failed = !landed;
				this.publish();
			}
			/** Cached projection: stable identity between publishes (useSyncExternalStore contract). */
			getSnapshot() {
				if (this.cached === void 0) this.cached = this.buildProjection();
				return this.cached;
			}
			buildProjection() {
				const projection = {};
				for (const { field, max } of this.fields) {
					const staged = this.staged.get(field);
					const value = this.documentValue(field);
					const text = staged !== void 0 ? staged : typeof value === "number" ? String(value) : "";
					const parsed = this.parse(field, text);
					projection[field] = {
						value,
						text,
						valid: parsed.kind !== "invalid",
						staged: staged !== void 0,
						overridden: this.userHas(field),
						max
					};
				}
				projection.available = (() => {
					const snapshot = this.scope.getSnapshot();
					return snapshot !== void 0 && snapshot !== null && snapshot.status === "ready";
				})();
				projection.invalid = this.fields.some(({ field }) => {
					const staged = this.staged.get(field);
					return staged !== void 0 && this.parse(field, staged).kind === "invalid";
				});
				projection.writable = this.writable();
				projection.dirty = this.staged.size > 0;
				projection.saving = this.saving;
				projection.failed = this.failed;
				return projection;
			}
		}
		/** Bridges the draft-fold scope onto the settings card's staged form. */
		class DraftFoldCardController {
			constructor(scope) {
				this.form = new DraftFoldForm(scope, [numberField("threshold", THRESHOLD_MAX), numberField("previewChars", PREVIEW_MAX)]);
			}
			inject() {
				return {
					hooks: { draftFoldCard: this.form },
					edit: (field, text) => this.form.edit(field, text),
					save: () => this.form.save(),
					discard: () => this.form.discard(),
					resetField: (field) => this.form.resetField(field)
				};
			}
		}
		//#endregion
		//#region src/client/DraftFoldCard.tsx
		/** Render the 草稿折叠 settings card — a faithful clone of the official PluginCard shell. */
		function DraftFoldCard(props) {
			const [open, setOpen] = (0, react.useState)(false);
			const saveStarted = (0, react.useRef)(false);
			const state = props.useDraftFoldCard((snapshot) => snapshot);
			(0, react.useEffect)(() => {
				if (state.saving) {
					saveStarted.current = true;
					return;
				}
				if (!saveStarted.current) return;
				saveStarted.current = false;
				if (!state.dirty && !state.failed) setOpen(false);
			}, [state.dirty, state.failed, state.saving]);
			if (!state.available) return null;
			const title = props.t("settings.title");
			const blocked = !state.dirty || state.invalid || state.saving;
			const disabled = !state.writable;
			const valueField = (id, name, labelKey, hintKey) => {
				const field = state[name];
				return (0, react_jsx_runtime.jsxs)("div", { className: "dff-field", children: [
					(0, react_jsx_runtime.jsxs)("div", { className: "dff-head", children: [
						(0, react_jsx_runtime.jsx)("label", { className: "dff-label", htmlFor: id, children: props.t(labelKey) }),
						field.overridden ? (0, react_jsx_runtime.jsxs)("span", { className: "dff-badges", children: [
							(0, react_jsx_runtime.jsx)(primitives.Tag, { tone: "neutral", children: props.t("settings.overridden") }),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dff-reset",
								disabled,
								onClick: () => props.resetField(name),
								children: props.t("settings.reset")
							})
						] }) : null
					] }),
					(0, react_jsx_runtime.jsx)("input", {
						id,
						className: field.valid ? "dff-input" : "dff-inputInvalid",
						type: "text",
						inputMode: "numeric",
						...field.valid ? {} : { "aria-invalid": true },
						value: field.text,
						placeholder: "",
						disabled,
						onChange: (event) => props.edit(name, event.target.value)
					}),
					(0, react_jsx_runtime.jsx)("p", { className: field.valid ? "dff-hint" : "dff-invalid", children: field.valid ? props.t(hintKey) : props.t("settings.invalidNumber") })
				] }, id);
			};
			return (0, react_jsx_runtime.jsxs)("li", {
				className: "dff-card" + (open ? " dff-cardOpen" : ""),
				"data-testid": "draft-fold-card",
				children: [(0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "dff-header",
					"aria-expanded": open,
					"aria-label": props.t(open ? "settings.collapse" : "settings.expand") + ": " + title,
					onClick: () => {
						setOpen(!open);
					},
					children: [
						(0, react_jsx_runtime.jsxs)("span", { className: "dff-headText", children: [
							(0, react_jsx_runtime.jsx)("span", { className: "dff-name", children: title }),
							(0, react_jsx_runtime.jsx)("span", { className: "dff-description", children: props.t("settings.description") })
						] }),
						state.dirty ? (0, react_jsx_runtime.jsx)(primitives.Tag, { tone: "neutral", className: "dff-pending", children: props.t("settings.unsaved") }) : null,
						(0, react_jsx_runtime.jsx)(primitives.IconChevronDownOutline14, { className: "dff-chevron" + (open ? " dff-chevronOpen" : "") })
					]
				}), open ? (0, react_jsx_runtime.jsxs)("div", {
					className: "dff-body",
					children: [
						!state.writable ? (0, react_jsx_runtime.jsx)("p", { className: "dff-readOnly", role: "status", children: props.t("settings.readOnly") }) : null,
						valueField("draft-fold-threshold", "threshold", "settings.threshold", "settings.thresholdHint"),
						valueField("draft-fold-preview", "previewChars", "settings.previewChars", "settings.previewHint"),
						(0, react_jsx_runtime.jsxs)("div", { className: "dff-footer", children: [
							state.failed ? (0, react_jsx_runtime.jsx)("p", { className: "dff-failed", role: "status", children: props.t("settings.saveFailed") }) : null,
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dff-discard",
								disabled: !state.dirty || state.saving,
								onClick: props.discard,
								children: props.t("settings.discard")
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dff-save",
								disabled: blocked,
								onClick: props.save,
								children: props.t(state.saving ? "settings.saving" : "settings.save")
							})
						] })
					]
				}) : null]
			});
		}
		//#endregion
		//#region src/client/index.tsx
		/** Required runtime services for the browser half. */
		const inject = ["slots", "locale", "settingsScope"];
		/** Browser plugin: extend the stock composer upward with an attachment-like summary. */
		function apply(ctx) {
			const scope = ctx.settingsScope.bind({ namespace: SETTINGS_NS });
			const store = createEffectiveStore(scope);
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh-draft-fold: dictionaries");
			ctx.effect(() => installStyles(), "dsh-draft-fold: styles");
			ctx.slots.inject("conversation.input.dock", () => ctx.slots.register({
				name: "conversation.input.dock",
				id: "@ztyss/dsh-draft-fold",
				order: -100,
				locale: NS
			}, DraftDockLive));
			/** Reads the live fold limits so threshold edits apply without a reload. */
			function DraftDockLive(props) {
				const effective = (0, react.useSyncExternalStore)(store.subscribe, store.getSnapshot, store.getSnapshot);
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(LongDraftDock, {
					...props,
					threshold: effective.threshold,
					previewChars: effective.previewChars
				});
			}
			// 插件配置卡：对齐官方卡/rewind 的成熟形态——在 settingsScope 注入回调里
			// 延迟注册；keyed 槽位身份是 key，字段只留 name/key/locale/inject；
			// 失败打印到控制台而非静默。
			ctx.inject(["settingsScope"], (scoped) => {
				try {
					const card = new DraftFoldCardController(scoped.settingsScope.bind({ namespace: SETTINGS_NS }));
					scoped.slots.inject("settings.plugin.item", () => scoped.slots.register({
						name: "settings.plugin.item",
						key: SETTINGS_NS,
						locale: NS,
						inject: () => card.inject()
					}, DraftFoldCard));
				} catch (error) {
					console.error("[dsh-draft-fold] settings card register failed", error);
				}
			});
		}
		//#endregion
		exports.LongDraftDock = LongDraftDock;
		exports.apply = apply;
		exports.DraftFoldCard = DraftFoldCard;
		exports.DraftFoldCardController = DraftFoldCardController;
		exports.createEffectiveStore = createEffectiveStore;
		exports.effectiveFromSnapshot = effectiveFromSnapshot;
		exports.inject = inject;
		exports.summarizeDraft = summarizeDraft;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map
