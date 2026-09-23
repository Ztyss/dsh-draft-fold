import z from '@deepseek-ai/schemastery';
/** Configuration shared by the host row and the browser plugin row. */
export interface Config {
    /** Collapse when the draft exceeds this many JavaScript characters. */
    threshold: number;
    /** Maximum number of code points shown from the first line. */
    previewChars: number;
}
export declare const Config: z<Config>;
//# sourceMappingURL=config.d.ts.map