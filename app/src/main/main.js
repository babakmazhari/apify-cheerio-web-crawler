const apify = require('apify');
const { log } = apify.utils;
const requestListBuilder = require('./utils/requestListBuilder');
const staticLinkDependencyBuilder = require('./utils/staticLinkDependencyBuilder');

(async () => {
  try {
    // better practice to store in .env file under project root folder(or set in package.json)
    // set dynamically in code here to avoid exceptions during runtime on different systems
    process.env.APIFY_LOCAL_STORAGE_DIR = "./apify_storage"

    // Read the list of URLs to crawl from file
    const reqList = await requestListBuilder.build();
    const requestList = new apify.RequestList({
      sources: reqList,
    });
    await requestList.initialize();
    const requestQueue = await apify.openRequestQueue();

    // Crawl the URLs
    const crawler = new apify.CheerioCrawler({
      requestList,
      requestQueue,
      handlePageFunction: async ({ request, body, $ }) => {
        const pseudoUrls = [new apify.PseudoUrl(`${request.url}/[.*]`)];
        // Add page title for each request to data set
        const title = $('title').text();
        const staticLinks = staticLinkDependencyBuilder.build($);

        const dataset = await apify.openDataset(request.url);
        await dataset.pushData({
          url: request.url,
          title,
          staticLinks,
          html: body
        })
        // Dynamically enqueue the URLs within the same domain
        await apify.utils.enqueueLinks({ $, baseUrl: request.url, selector: 'a', pseudoUrls, requestQueue });
      },
      maxRequestsPerCrawl: 25,
      maxConcurrency: 5,
    });

    await crawler.run();

  } catch(err){
    // handle error
    log.setLevel(log.LEVELS.ERROR);
    log.error(err);
  }
})();