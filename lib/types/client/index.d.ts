import type { Config } from '../config.ts';
import type { ClientContext } from './contracts.ts';
export { Config } from '../config.ts';
export { LongDraftDock } from './LongDraftDock.tsx';
export { summarizeDraft } from './summary.ts';
/** Required runtime services for the browser half. */
export declare const inject: string[];
/** Browser plugin: extend the stock composer upward with an attachment-like summary. */
export declare function apply(ctx: ClientContext, config?: Config): void;
//# sourceMappingURL=index.d.ts.map