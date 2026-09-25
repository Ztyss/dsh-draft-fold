/** Host half: ≤0.1.5 registers the settings namespace; 0.1.7+ projects the loader-entry Config below. */
export declare const name = "@ztyss/dsh-draft-fold";
/** Loader-entry Config (0.1.7+): volatile fields become the live settings document. */
export declare const Config: unknown;
/** The browser half is loaded through exports["./client"]. */
export declare function apply(ctx: unknown): void;
