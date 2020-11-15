# Web Crawler using Apify SDK

A simple multi-url web crawler to recursively parse and extract:

- URL and title of all html pages that were parsed
- list of all static links in each page
- html body of the page

crawling data for each page is stored in a separate json file under apify_storage/datasets

### Input URL list

You can specify the list of urls in url-list.txt with each url on a separate line. Explanatory comments are provided in the file.
The crawler will only handle the urls with valid url format. Invalid urls are ignored with a warning message logged to console.
The crawler recursively crawls the pages within the same domain and stores url, title and sitemap data for each page. 

### Storage

The crawling data extracted for every url will be stored in a separate json file under apify_storage/datasets.
You can see additional information on handled and pending requests under apify_storage/request-queues.
The overall statistics about the application execution is provided under apify_storage/key_value_stores.
