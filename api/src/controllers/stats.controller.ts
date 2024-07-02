import { Request } from 'express'
import { DataSuccess } from '../responses/success/data-success.response'
import { ResponseType } from '../../../shared/models/types'
import { Stats as Stats_, StatsRes } from '../../../shared/models/features/stats.model'
import db from '../utils/db'
import { DBException } from '../responses/exceptions/db-exception.response'
import { DefaultSuccess } from '../responses/success/default-success.response'
import { RequestException } from '../responses/exceptions/request-exception.response'
import { IncomingHttpHeaders } from 'http'
import authService from '../services/auth.service'
import nexter from '../utils/nexter'
import { ServiceException } from '../responses/types'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'

class Stats {
  async getStats(req: Request, headers: IncomingHttpHeaders): Promise<DataSuccess<StatsRes>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (!auth.p_stats_see) {
      throw new UnauthorizedException()
    }

    let stats: Stats_[]

    try {
      stats = await db.query('SELECT * FROM stats')
    } catch (error) {
      throw new DBException()
    }

    let statsRes: StatsRes = {
      startups: [],
      launchings: [],
      connections: [],
      devtools: []
    }

    stats.forEach((stat) => {
      if (stat.action === 'startup') statsRes.startups.push({ date: stat.date })
      if (stat.action === 'launching') statsRes.launchings.push({ date: stat.date, os: stat.info as 'windows' | 'mac' | 'linux' })
      if (stat.action === 'connections') statsRes.connections.push({ date: stat.date })
      if (stat.action === 'devtools') statsRes.devtools.push({ date: stat.date })
    })

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', statsRes)
  }

  async postStat(req: Request, body: any): Promise<DefaultSuccess> {
    if (!body.action) {
      throw new RequestException('Missing parameters')
    }

    if (!['startup', 'launching', 'connections', 'devtools'].includes(body.action)) {
      throw new RequestException('Invalid parameters')
    }

    let os: 'windows' | 'mac' | 'linux' | null =
      req.headers['user-agent'] && req.headers['user-agent'].includes('Windows')
        ? 'windows'
        : req.headers['user-agent'] && req.headers['user-agent'].includes('Mac')
          ? 'mac'
          : req.headers['user-agent'] && req.headers['user-agent'].includes('Linux')
            ? 'linux'
            : null

    try {
      await db.query('INSERT INTO stats (action, date, info) VALUES (?, ?, ?)', [body.action, new Date(), os])
    } catch (error) {
      throw new DBException()
    }

    return new DefaultSuccess(req, 201, ResponseType.SUCCESS, 'Success')
  }

  async deleteStats(req: Request, headers: IncomingHttpHeaders): Promise<DefaultSuccess> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (!auth.p_stats_del) {
      throw new UnauthorizedException()
    }

    try {
      await db.query('DELETE FROM stats')
    } catch (error) {
      throw new DBException()
    }

    return new DefaultSuccess(req, 200, ResponseType.SUCCESS, 'Success')
  }
}

export default Stats
