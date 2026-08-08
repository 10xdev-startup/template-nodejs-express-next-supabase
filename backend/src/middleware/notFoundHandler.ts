import type { Request, Response } from 'express'
import { sendError } from '@/utils/apiResponse'

/**
 * 404 no envelope wrapped. Sem isto o Express responde o 404 padrao em HTML, quebrando o
 * contrato "resposta SEMPRE no envelope" — e o `apiClient` do frontend perde o `code`,
 * ficando sem como distinguir "endpoint nao existe" de "registro nao encontrado".
 *
 * Registre DEPOIS de todas as rotas e ANTES do `errorHandler`.
 */
export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, 404, `Rota nao encontrada: ${req.method} ${req.path}`, 'ROUTE_NOT_FOUND')
}
