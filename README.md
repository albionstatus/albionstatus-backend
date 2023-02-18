# AlbionStatus Backend

The backend is now a PNPM-based monorepo divided in three parts:

* a `shared` utility package for DB functions, types and constants
* an `api` package that runs the public API (based on Nitro)
* a `scrape-and-tweet` package that is scraping the AlbionStatus server status and tweets on change
  * Does not tweet yet because of the old backend still running