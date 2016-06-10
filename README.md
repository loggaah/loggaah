# Loggaah!!! An intuitive logging framework for Node.js
[![npm version](https://badge.fury.io/js/loggaah.svg)](http://badge.fury.io/js/loggaah)
[![Build Status](https://travis-ci.org/loggaah/loggaah.svg?branch=master)](https://travis-ci.org/loggaah/loggaah)
[![Coverage Status](https://coveralls.io/repos/loggaah/loggaah/badge.svg?branch=master&service=github)](https://coveralls.io/github/loggaah/loggaah?branch=master)
[![Dependency Status](https://david-dm.org/loggaah/loggaah.svg)](https://david-dm.org/loggaah/loggaah) 

Yes this is another logging framework, because the world can never have enough logging frameworks.

#### What makes this one so special or even different from others? Let's see:

* Written in ECMA 6 (does not require --harmony flag)
* Extensible plugin architecture
* Simple configuration
* Modifiable at runtime
* Multiple configuration options: File, Rest, Web-Interface through plugins
* Configurable log levels
* Inspired by Log4j2/Logback in Java
* Flow interface


#### How do you use it? Easy:

```JavaScript
var logs = require('loggaah');
```

Get your logger:
```JavaScript
ver log = logs.getLogger('myLogger'); 
```

Or let loggaah detect your logger:
```JavaScript
var log = logs.getLogger(); // name = path/to/current/file
```

Log a message:
```JavaScript
log.info('Hello World!');
```

Log an exception: 
```JavaScript
var ex = new Error("I'm an error");
log.warn('Oh no!', ex);
```

Log metadata:
```JavaScript
var MDC = new logs.MDC();
MDC.set('key', 'value');
log.debug('Juicy Details', MDC); 
```

Format your log message:
```JavaScript
log.trace('to %s or not to %s, that is the question', 'be', 'bee');
```

Or do it all at once (Order doesn't matter, the first string is the message to be formatted):
```JavaScript
log.error('Hope this', ex, MDC, 'helps');
```

Change where logs are sent to:
```JavaScript
log.setAppender('default', {
    type: console,
    color: true
});
```

Use a unique id to identify this message later
```JavaScript
var hash = log.info('A message').param('a parameter').getId();
// #A18dnJ0l or other hash
```


## Installation
Run the following command in the root of the project that you want to use the loggaah with.

	npm install loggaah --save

Notice that if you don't install released versions from npm and use the master instead, that it is in active development 
and might not be working. For help and questions you can always [file an issue](https://github.com/loggaah/loggaah/issues).


## Configurators
Configurators are plugins that update a configuration. All configurators are enabled at the same time, and processed
in order of initialization. Be warned that if you activate features such as rescanning files, configurators with higher
priority might be overridden.

### Json Configurator
Looks for a json file and parses the content. The file location to be searched for can be set at program start if the
default isn't suitable for your use case.
 
_TODO_: Explain plugin configuration
_TODO_: An example JSON with all options of the base library

### Yaml Configurator (Plugin)
Basically the same as the Json Configurator only this time in Yaml.

### Rest Configurator (Plugin)
Listens on a specified port for REST commands and lets you change the logging configuration from remote.

### Web Configurator (Plugin)
A web interface that allows you to configure the client from the comforts of your own browser


## Loggers
Loggers combine multiple functions in them:

1. Loggers are your entry point into the logging system where you generate events (by calling log.info() for example)
2. Loggers can filter messages based on logging level
3. Loggers configure to which appender a message gets routed
4. Loggers are configured using regular expressions. Any log the regex matches, will have its rule applied.

All loggers have names, even if you don't set one the system will generate one for you (typically something based on the
file path). When you set a configuration you can specify a name that will match any logger with the same prefix or you
can define a regular expression. When you get a logger you need to fetch a specific one, so no regular expression there, 
buddy.

You can also change a configuration of a logger directly on the instance programmatically, so that you can change the
appenders that receive messages for example.

### Levels
Loggers typically have levels to decide what goes through and what doesn't. Levels should work intuitively and 
configurable by you. The standard levels are off, trace, debug, info, warn/warning, error/err, all and their upper case
companions. If you want to define your own levels you're free to do so, just make sure you include at each end a value 
for off and all as these have special meaning.


## Appenders
Appenders decide where to output a message to once it has been filtered and processed. A type of appender can be 
assigned multiple times, which is why appenders have names.

### Console Appender
Probably the one appender that all logging systems have. Prints out messages to the command line.

### File Appender
I've also yet to find an logging system that has no file appender. This one will allow you to roll over files based on
size or time.

### Memory Appender
Maybe this one is only there for debugging, or maybe you have some use for it. Stores a fixed number of messages in 
memory before discarding them. 

### REST Appender (plugin)
An appender that will cache messages until they're are retrieved through a REST call. Behaves similar to the memory
appender in that it will only store messages up to a specified number/time.
 

## Processors
Processors are there to manipulate the contents of messages. Similar to appenders a processor can have multiple 
instances which is why they are also named. Processors can be assigned to Appenders to process messages before they
are passed on to the appender.

### Formatter
If you want yout messages to look pretty and show some information about them, then this is the processor you want.
Will print almost any format you define. Easily extensible if the default patterns are not enough for you.

_TODO_: Formatting Guide

### Batcher
This processor will batch together messages up to a certain size or time limit, after which it will pass everything on
to the next processor or appender in chain. This can be used for high performance systems to reduce overhead of writing
operations.

### Statistics (Plugin)
This processor will generate statistics based on messages passing through, recording log levels, intervals, line 
lengths, common words and probably much more. Stats can then be recovered by piping this processor to an appender


## Plugins
Official plugins can be found on github under the organization [loggaah](https://github.com/loggaah). If you wish to 
have your plugin be linked here, just shoot me a quick email at mallox@pyxzl.net

## Tests

You can just run ```npm test``` to see an output of all existing tests as well as coverage information.

## Bugs and Feature Requests

I try to find all the bugs and have tests to cover all cases, but since I'm working on this project alone, it's easy to 
miss something. Also I'm trying to think of new features to implement, but most of the time I add new features because 
someone asked me for it. So please report any bugs or feature request to mallox@pyxzl.net or file an issue directly on 
[Github](https://github.com/loggaah/loggaah/issues). Before submitting a bug report specific to your problem, try running 
the same command and verbose mode `-v` so that I have some additional information to work with.
Thanks!

## Donations

Wow, apparently there are people who want to support me. If you're one of them you can do so via bitcoin over here: 
[mallox@coinbase](https://www.coinbase.com/Mallox)
