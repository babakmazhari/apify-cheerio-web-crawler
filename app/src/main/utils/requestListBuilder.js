const fs = require('fs');
const readline = require('readline');
const validUrl = require('valid-url');
const apify = require('apify');
const { log } = apify.utils;

exports.build = () => {
    const readInterface = readline.createInterface({
      input: fs.createReadStream('url-list.txt'),
      crlfDelay: Infinity // recognize all instances of CR LF ('\r\n') in url-list.txt as a single line break
    });
    
    return new Promise((resolve, reject) => {
      const reqList = [];
      readInterface.on('line', (line) => {
        if (validUrl.isUri(line)) {
          reqList.push(line);
        }
        else {
          log.setLevel(log.LEVELS.WARNING);
          if (line.trim().length > 0 && !line.trimLeft().startsWith('#')) // don't log blank lines or comment lines starting with #
          {
            log.warning(`Ignoring invalid url format: ${line}`);
          }
        }
      });
  
      readInterface.on('close', () => resolve(reqList));
      readInterface.on('error', (err) => reject(err));
    });
  }