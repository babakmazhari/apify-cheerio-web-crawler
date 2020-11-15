const requestListBuilder = require('../main/utils/requestListBuilder');
const readline = require('readline');
const Apify = require('apify');

jest.mock('readline');
jest.mock('apify');

describe('Builder', () => {

    let readLineCallback, closeCallback, errorCallback;
    beforeEach(() => {
        readline.createInterface = jest.fn().mockReturnValueOnce({
            on: jest.fn().mockImplementation((event, callback) => {
                if (event === 'line') readLineCallback = callback;
                else if (event === 'close') closeCallback = callback;
                else if (event === 'error') errorCallback = callback;
            })
        })
    })

    test('can read a file and filter out invalid urls', async () => {
        const mockWarnLogger = jest.fn();
        Apify.utils = { log: { warning: mockWarnLogger, setLevel: jest.fn() } };

        const listPromise = requestListBuilder.build();
        readLineCallback('invalid url');
        readLineCallback('http://validURL1.com');
        readLineCallback('http://validURL2.com');
        closeCallback();
        const list = await listPromise;
        expect(list).toContain('http://validURL1.com');
        expect(list).toContain('http://validURL2.com');
        expect(list).toHaveLength(2);
    });

    test('can propagate file reader error', async () => {
        const listPromise = requestListBuilder.build();
        const mockError = new Error('my error');
        errorCallback(mockError);
        try { await listPromise }
        catch (e) {
            expect(e).toBe(mockError);
        }
    })
})