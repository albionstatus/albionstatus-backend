
import { scrape } from "./scrape.js"
import { Env } from "./types.js"

export default {
	async scheduled (
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext
	): Promise<void> {
		const result = await Promise.allSettled([
			scrape('sgp', env),
			scrape('ams', env),
			scrape('was', env),
		])

		if (!result.every(({ status }) => status === 'fulfilled')) {
			console.error('At least one scraper failed')
			console.error(result)
		}
	}
}