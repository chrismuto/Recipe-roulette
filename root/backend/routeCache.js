import NodeCache from 'node-cache';

const cache = new NodeCache();

const duration = duration => (req, res, next) => {
    if (req.method !== 'GET') {
        console.log('Not a GET request!');
        return next();
    }

    //check for key in cache
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);
    //if key, then send cache result
    if (cachedResponse) {
        console.log(`cache found for ${key}`);
        res.send(cachedResponse);
    } else {
        //if no key, send original and set new key and value in cache
        console.log(`no cache found for ${key}`);
        res.originalSend = res.send;
        res.send = body => {
            res.originalSend(body);
            cache.set(key, body, duration);
        };
        next();
    }
}

export default duration