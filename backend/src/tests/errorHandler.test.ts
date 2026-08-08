import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import type { Request, Response, NextFunction } from 'express'
import { errorHandler } from '@/middleware/errorHandler'
import { notFoundHandler } from '@/middleware/notFoundHandler'
import { AppError } from '@/utils/AppError'

/** Mock minimo do `Response`: captura status, body e o estado de headersSent. */
function createMockRes(headersSent = false) {
  const calls = { status: 0, body: undefined as unknown }
  const res = {
    headersSent,
    status(code: number) {
      calls.status = code
      return res
    },
    json(body: unknown) {
      calls.body = body
      return res
    },
  }
  return { res: res as unknown as Response, calls }
}

const req = {} as Request
const noopNext: NextFunction = () => undefined

/** Erro como o `express.json()` produz: objeto com `type`. */
function bodyError(type: string): Error & { type: string } {
  return Object.assign(new Error(type), { type })
}

let errorSpy: ReturnType<typeof jest.spyOn>

beforeEach(() => {
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
})

afterEach(() => {
  errorSpy.mockRestore()
})

describe('errorHandler', () => {
  it('serializa AppError com status e code proprios', () => {
    const { res, calls } = createMockRes()
    errorHandler(new AppError(404, 'Usuario nao encontrado', 'USER_NOT_FOUND'), req, res, noopNext)

    expect(calls.status).toBe(404)
    expect(calls.body).toEqual({
      success: false,
      error: { message: 'Usuario nao encontrado', code: 'USER_NOT_FOUND' },
    })
  })

  it('mapeia JSON malformado para 400, nao 500', () => {
    const { res, calls } = createMockRes()
    errorHandler(bodyError('entity.parse.failed'), req, res, noopNext)

    expect(calls.status).toBe(400)
    expect(calls.body).toMatchObject({ success: false, error: { code: 'INVALID_JSON' } })
  })

  it('mapeia corpo grande demais para 413, nao 500', () => {
    const { res, calls } = createMockRes()
    errorHandler(bodyError('entity.too.large'), req, res, noopNext)

    expect(calls.status).toBe(413)
    expect(calls.body).toMatchObject({ success: false, error: { code: 'PAYLOAD_TOO_LARGE' } })
  })

  it.each(['entity.parse.failed', 'entity.too.large'])(
    'nao loga stack de erro do cliente (%s) — senao um cliente quebrado afoga o log',
    (type) => {
      const { res } = createMockRes()
      errorHandler(bodyError(type), req, res, noopNext)
      expect(errorSpy).not.toHaveBeenCalled()
    },
  )

  it('erro inesperado vira 500 generico e loga stack', () => {
    const { res, calls } = createMockRes()
    errorHandler(new Error('boom'), req, res, noopNext)

    expect(calls.status).toBe(500)
    expect(calls.body).toMatchObject({ success: false, error: { code: 'INTERNAL_ERROR' } })
    expect(errorSpy).toHaveBeenCalled()
  })

  it('nao tenta responder quando os headers ja foram enviados', () => {
    const { res, calls } = createMockRes(true)
    let forwarded: unknown = null
    const err = new Error('depois do stream')

    errorHandler(err, req, res, ((e: unknown) => {
      forwarded = e
    }) as NextFunction)

    expect(forwarded).toBe(err)
    expect(calls.status).toBe(0)
  })
})

describe('notFoundHandler', () => {
  it('responde 404 no envelope wrapped, com code proprio', () => {
    const { res, calls } = createMockRes()
    notFoundHandler({ method: 'GET', path: '/nao-existe' } as Request, res)

    expect(calls.status).toBe(404)
    expect(calls.body).toMatchObject({
      success: false,
      error: { code: 'ROUTE_NOT_FOUND' },
    })
  })
})
