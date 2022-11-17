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

type ParametersOrFullFunction = any[] | ((...args: any[]) => void)
type GetParameters<T extends ParametersOrFullFunction> = T extends ((...args: any[]) => void) ? Parameters<T> : T
type CommonEventHandlerMap = Record<string, ParametersOrFullFunction>
type GenerateHandlerWithStopImmediate<T extends ParametersOrFullFunction> = (...args: [...GetParameters<T>, () => void]) => void
type HandlerCollection<U extends CommonEventHandlerMap> = { [K in keyof U]?: Set<GenerateHandlerWithStopImmediate<U[K]>> }

export class TypedTrigger<M extends CommonEventHandlerMap = CommonEventHandlerMap> {
  private _handlerCollection: HandlerCollection<M> = {}

  on<K extends keyof M> (eventName: K, handler: GenerateHandlerWithStopImmediate<M[K]>) {
    const handlers = this._getHandlersOfEvent(eventName)
    if (handlers) {
      handlers.add(handler)
    }
  }

  off<K extends keyof M> (eventName: K, handler: GenerateHandlerWithStopImmediate<M[K]>) {
    const handlers = this._getHandlersOfEvent(eventName)
    if (handlers) {
      handlers.delete(handler)
    }
  }

  trigger<K extends keyof M> (eventName: K, ...args: GetParameters<M[K]>) {
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
    if (!this._handlerCollection[eventName]) {
      this._handlerCollection[eventName] = new Set()
    }

    return this._handlerCollection[eventName]
  }
}
