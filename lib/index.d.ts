export type CommonEventHandlerMap = Record<string, (...args: any[]) => any>;
type WithStopImmediate<T extends (...args: any[]) => any> = (...args: [...Parameters<T>, () => void]) => ReturnType<T>;
export declare class TypedTrigger<M extends CommonEventHandlerMap = CommonEventHandlerMap> {
    private _handlerCollection;
    on<K extends keyof M>(eventName: K, handler: WithStopImmediate<M[K]>): void;
    off<K extends keyof M>(eventName: K, handler: WithStopImmediate<M[K]>): void;
    trigger<K extends keyof M>(eventName: K, ...args: Parameters<M[K]>): void;
    private _getHandlersOfEvent;
}
export {};
