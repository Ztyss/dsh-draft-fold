import type { Config } from '../config.ts';
import type { LongDraftDockProps } from './contracts.ts';
export interface LongDraftDockConfig extends Pick<Config, 'threshold' | 'previewChars'> {
}
export type LongDraftDockComponentProps = LongDraftDockProps & LongDraftDockConfig;
export declare function LongDraftDock({ input, inputActions, t, threshold, previewChars }: LongDraftDockComponentProps): import("react").JSX.Element;
//# sourceMappingURL=LongDraftDock.d.ts.map