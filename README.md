service-client
=============

javascript wrapper function for `http.request` that returns parsed, transformed data in callback.

## API ##

### get(url, _options_, callback) ###
* url

    The URL to access

* _options_

    Optional. An object specifying the options for the request, parsing and transformation.<br/>
    + `accept`: Accept request header (`string`). Defaults to `text/plain`
        - "text" or "plain" are changed to `text/plain`
        - "json" is changed to `application/json`
    + `parse`: `function` used to parse the raw http result.

        Given 2 parameters:
        - `buffer`: The `Buffer` that holds the raw http data
        - `callback`: Callback `function` taking two paramers (`err`, `data`)
        
        If `parse` is a string, one of the internal parsers are returned:
        - "json": wraps `JSON.parse`
        - "raw": returns the data data as-is
    + `transform`: `function` used to transform the parsed data. Given 2 parameters:
        - `data`: The data returned from the parse function
        - `callback`: Callback `function` taking two paramers (`err`, `data`)
    
    `parse` and `transform` defaults to parsers.plain (returning the data as-is)

* callback

    The callback function called when an error has occured or when the data was received, parsed and transformed<br/>
    Parameters:
    * `err`: `null` when no error has occured or an error details object with the keys:
        + `error`: The actual error that was caught
        + `action`: The action where the error occured (request, response, parse, transform)
        + `length`: The value of the `content-length` header
        + `received`: The number of bytes received so far
        + `buffer`: The `Buffer` object that is used to hold the raw http data
        + `parsed`: The parsed data
        
        If the `content-length` response header is not present, `length` will be `-1` (while transfering) or the number
        of bytes `received` when the `end` event is fired
    * `data`: The transformed data. `undefined` if an error has occured.

## Dependencies ##
- defaultify

    Handles options setup for get
    [defaultify on npm](https://npmjs.org/package/defaultify)
