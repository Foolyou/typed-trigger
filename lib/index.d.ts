export type CommonEventHandlerMap = Record<string, any[]>;
type GenerateHandlerWithStopImmediate<T extends any[]> = (...args: [...T, () => void]) => void;
export declare class TypedTrigger<M extends CommonEventHandlerMap = CommonEventHandlerMap> {
    private _handlerCollection;
    on<K extends keyof M>(eventName: K, handler: GenerateHandlerWithStopImmediate<M[K]>): void;
    off<K extends keyof M>(eventName: K, handler: GenerateHandlerWithStopImmediate<M[K]>): void;
    trigger<K extends keyof M>(eventName: K, ...args: M[K]): void;
    private _getHandlersOfEvent;
}
export {};
