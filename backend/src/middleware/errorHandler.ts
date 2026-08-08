import type { Request, Response, NextFunction } from 'express'
import { AppError } from '@/utils/AppError'
import { sendError } from '@/utils/apiResponse'

/**
 * Erros do `express.json()` carregam `type` — sao falha do CLIENTE, nao do servidor.
 * Sem este mapeamento eles caem no 500 generico, e como o parser roda ANTES do auth,
 * qualquer requisicao sem token consegue produzir 500 e stack trace no log.
 */
function clientBodyError(
  err: unknown,
): { status: number; message: string; code: string } | null {
  if (!err || typeof err !== 'object' || !('type' in err)) return null

  switch ((err as { type: unknown }).type) {
    case 'entity.parse.failed':
      return { status: 400, message: 'JSON invalido no corpo da requisicao', code: 'INVALID_JSON' }
    case 'entity.too.large':
      return { status: 413, message: 'Corpo da requisicao excede o limite', code: 'PAYLOAD_TOO_LARGE' }
    default:
      return null
  }
}

/**
 * Handler de erro central — registre por ULTIMO (`app.use(errorHandler)`), depois das
 * rotas e do `notFoundHandler`. O Express 5 encaminha rejeicoes de handlers async pra ca
 * automaticamente.
 *
 * `AppError` (erro esperado) vira a resposta com seu status/code; erro de corpo do cliente
 * vira 400/413; qualquer outro vira 500 generico. Mantem TODA resposta no envelope wrapped.
 *
 * So 5xx inesperado loga stack: erro de cliente nao e falha de servidor, e logar stack pra
 * ele afoga o log real de producao.
 *
 * Assinatura de 4 args e obrigatoria pro Express reconhecer como error handler.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Resposta ja iniciada: escrever de novo lancaria ERR_HTTP_HEADERS_SENT e mascararia o
  // erro original. Delega ao handler padrao do Express, que encerra a conexao.
  if (res.headersSent) {
    next(err)
    return
  }

  if (err instanceof AppError) {
    sendError(res, err.status, err.message, err.code)
    return
  }

  const clientError = clientBodyError(err)
  if (clientError) {
    sendError(res, clientError.status, clientError.message, clientError.code)
    return
  }

  console.error('[errorHandler]', err instanceof Error ? (err.stack ?? err.message) : err)
  sendError(res, 500, 'Erro interno do servidor', 'INTERNAL_ERROR')
}
