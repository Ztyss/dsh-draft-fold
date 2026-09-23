export interface DraftSummary {
    /** The complete first line before visual truncation. */
    readonly firstLine: string;
    /** The first line limited to the configured preview size. */
    readonly preview: string;
    /** Human-facing Unicode code-point count. */
    readonly characters: number;
    /** Logical lines, including the line after a trailing newline. */
    readonly lines: number;
    readonly truncated: boolean;
}
/** Build the small amount of metadata needed by the collapsed card. */
export declare function summarizeDraft(text: string, previewChars: number): DraftSummary;
//# sourceMappingURL=summary.d.ts.map