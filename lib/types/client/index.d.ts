import type { ClientContext } from './contracts.ts';
export { LongDraftDock } from './LongDraftDock.tsx';
export { summarizeDraft } from './summary.ts';
/** Required runtime services for the browser half. */
export declare const inject: string[];
/** Effective fold limits: ready settings document, per-field fallback otherwise. */
export declare function effectiveFromSnapshot(snapshot: unknown, defaults?: {
    threshold: number;
    previewChars: number;
}): {
    threshold: number;
    previewChars: number;
};
/** Identity-stable live store over one bound settings scope. */
export declare function createEffectiveStore(scope: unknown): {
    getSnapshot(): {
        threshold: number;
        previewChars: number;
    };
    subscribe(listener: () => void): () => boolean;
    stop(): void;
};
/** Dock store that starts on defaults and re-binds when the settings face activates. */
export declare function createDeferredEffectiveStore(): {
    getSnapshot(): {
        threshold: number;
        previewChars: number;
    };
    subscribe(listener: () => void): () => boolean;
    attach(scope: unknown): void;
};
/** Staged form over the draft-fold namespace. */
export declare class DraftFoldCardController {
    constructor(scope: unknown);
    inject(): {
        hooks: {
            draftFoldCard: unknown;
        };
        edit(field: string, text: string): void;
        save(): Promise<void>;
        discard(): void;
        resetField(field: string): Promise<void>;
    };
}
/** The 草稿折叠 settings card rendered from one staged-form snapshot. */
export declare function DraftFoldCard(props: {
    t: (key: string, params?: Record<string, unknown>) => string;
    useDraftFoldCard: <T>(selector: (snapshot: any) => T) => T;
    edit(field: string, text: string): void;
    save(): Promise<void>;
    discard(): void;
    resetField(field: string): Promise<void>;
}): unknown;
/** Plugins-tab page shell (0.1.7+): the settings card inside a plain list wrapper. */
export declare function DraftFoldTab(props: {
    t: (key: string, params?: Record<string, unknown>) => string;
    useDraftFoldCard: <T>(selector: (snapshot: any) => T) => T;
    edit(field: string, text: string): void;
    save(): Promise<void>;
    discard(): void;
    resetField(field: string): Promise<void>;
}): unknown;
/** Browser plugin: extend the stock composer upward with an attachment-like summary. */
export declare function apply(ctx: ClientContext): void;
