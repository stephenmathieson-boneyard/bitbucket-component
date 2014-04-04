
# bitbucket-component

  Proxy component(1) requests to BitBucket, allowing both public and private BitBucket repositories to be used as components.

[![Build Status](https://travis-ci.org/stephenmathieson/bitbucket-component.png)](https://travis-ci.org/stephenmathieson/bitbucket-component)

## Installation

    $ npm install -g stephenmathieson/bitbucket-component

## Setup

  bitbucket-component(1) expects an `{env}.config.json` to exist in your current directory.  Put your port number, username and password in there.

  **env.config.json**

```json
{
  "port": 1234,
  "username": "...",
  "password": "..."
}
```

  Switch environments by setting `NODE_ENV` before running `bitbucket-component`.

## License 

(The MIT License)

Copyright (c) 2013 Stephen Mathieson &lt;me@stephenmathieson.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.