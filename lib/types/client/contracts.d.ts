/**
 * Minimal structural contracts for the current DSH public slot.
 *
 * The plugin deliberately keeps these types local: rc.5 client packages are
 * workspace packages rather than npm dependencies, while the runtime values
 * are still supplied by DSH's real `conversation.input.dock` slot.
 */
export type LocaleKey = 'summary.aria' | 'summary.emptyFirstLine' | 'summary.characters' | 'summary.lines' | 'summary.showEditor' | 'summary.clear' | 'summary.continue';
export type Translate = (key: LocaleKey, params?: Record<string, unknown>) => string;
export interface InputState {
    readonly draft: string;
}
export interface InputActions {
    /** Replace the complete draft through DSH's input machine. */
    setDraft(text: string): void;
    /** Existing submit path; the plugin intentionally does not call or replace it. */
    submit(): void;
}
export interface LongDraftDockProps {
    readonly input: InputState;
    readonly inputActions: InputActions;
    readonly t: Translate;
}
export interface LocaleService {
    register(namespace: string, dictionaries: {
        zh: Record<string, string>;
        en: Record<string, string>;
    }): () => void;
}
export interface SlotService {
    inject(name: string, register: () => () => void): void;
    register(options: {
        name: string;
        id: string;
        order: number;
        locale: string;
    }, component: (props: LongDraftDockProps) => unknown): () => void;
}
export interface ClientContext {
    readonly locale: LocaleService;
    readonly slots: SlotService;
    effect(effect: () => void | (() => void), label?: string): void;
}
//# sourceMappingURL=contracts.d.ts.map