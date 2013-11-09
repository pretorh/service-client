service-client
=============

javascript wrapper function for `http.request` and `https.request` that returns parsed, transformed data in callback.

## API ##

### get(url, _options_, callback) ###
* url

    The URL to access

* _options_

    Optional. An object specifying the options for the request, parsing and transformation.<br/>
    + `accept`: Accept request header (`string`). Defaults to `text/plain`
        - "text" or "plain" are changed to `text/plain`
        - "json" is changed to `application/json`
        - "xml" is changed to `application/xml`
    + `parse`: `function` used to parse the data returned from http(s) request. Default returns the data `Buffer` as-is in the callback

        Given 2 parameters:
        - `buffer`: The `Buffer` that holds the data returned from the http(s) request
        - `callback`: Callback `function` taking two paramers (`err`, `data`)
        
        If `parse` is a string, one of the internal parsers are returned:
        - "json": wraps `JSON.parse`
        - "raw": returns the data data as-is
    + `transform`: `function` used to transform the parsed data. Default returns the data as-is is the callback.
        Given 2 parameters:
        - `data`: The data returned from the parse function
        - `callback`: Callback `function` taking two paramers (`err`, `data`)
    + `protocol`: `string` to specify if http or https should be used. Default depends on protocol returned by
        `url.parse`
    + `http`: `function` used for `http.request`. Used for mocking
    + `https`: `function` used for `https.request`. Used for mocking

* callback

    The callback function called when an error has occured or when the data was received, parsed and transformed<br/>
    Parameters:
    * `err`: `null` when no error has occured or an error details object with the keys:
        + `error`: The actual error that was caught
        + `action`: The action where the error occured (request, response, parse, transform)
        + `length`: The value of the `content-length` header
        + `received`: The number of bytes received so far
        + `buffer`: The `Buffer` object that is used to hold the data returned from the http(s) response
        + `parsed`: The parsed data
        
        If the `content-length` response header is not present, `length` will be `-1` (while transfering) or the number
        of bytes `received` when the `end` event is fired
    * `data`: The transformed data. `undefined` if an error has occured.

### mock.Builder(options) ###
Class to build http/https mocks

+ options:

    + statusCode: `number` to use as the status code for the request. Defaults to `200`
    + data: `text` to return for the request. Defaults to empty string

#### mock.Builder.httpRequest(url, callback) ####
Wrapper for `http.request` and `https.request`. Returns a new `mock.RequestMock` setup to call `callback` on `end`
with a new `mock.ResponseMock`


### mock.RequestMock(requestCallback, response) ###
+ requestCallback: The callback that will get the response object
+ response: The response object / `mock.ResponseMock` to return on `end`

### mock.ResponseMock(dataToReturn) ###
+ dataToReturn: The data to return

### mock.get(rules) ###
+ rules: `object` where keys are the urls, and values are functions (taking a single `callback` function
parameter) that is used to match incomming requests to the mock

## Dependencies ##
- defaultify

    Handles options setup for get
    [defaultify on npm](https://npmjs.org/package/defaultify)
