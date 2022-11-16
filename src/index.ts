/*
 * MIT License
 *
 * Copyright (c) 2022-Present Chen An
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

export type CommonEventHandlerMap = Record<string, (...args: any[]) => void>

type WithStopImmediate<T extends (...args: any[]) => any> = (...args: [...Parameters<T>, () => void]) => ReturnType<T>
type HandlerCollection<U extends CommonEventHandlerMap, K extends keyof U = keyof U> = Map<K, Set<WithStopImmediate<U[K]>>>

export class TypedTrigger<M extends CommonEventHandlerMap = CommonEventHandlerMap> {
  private _handlerCollection: HandlerCollection<M> = new Map()

  on<K extends keyof M> (eventName: K, handler: WithStopImmediate<M[K]>) {
    const handlers = this._getHandlersOfEvent(eventName)
    if (handlers) {
      handlers.add(handler)
    }
  }

  off<K extends keyof M> (eventName: K, handler: WithStopImmediate<M[K]>) {
    const handlers = this._getHandlersOfEvent(eventName)
    if (handlers) {
      handlers.delete(handler)
    }
  }

  trigger<K extends keyof M> (eventName: K, ...args: Parameters<M[K]>) {
    const handlers = this._getHandlersOfEvent(eventName)
    if (handlers) {
      let stopImmediate = false
      handlers.forEach(handler => {
        if (stopImmediate) {
          return
        }

        try {
          handler(...args, () => {
            stopImmediate = true
          })
        } catch (error) {
          console.error(error)
        }
      })
    }
  }

  private _getHandlersOfEvent<K extends keyof M> (eventName: K) {
    if (!this._handlerCollection.has(eventName)) {
      this._handlerCollection.set(eventName, new Set())
    }

    return this._handlerCollection.get(eventName)
  }
}
