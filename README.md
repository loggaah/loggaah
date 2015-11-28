# Loggaah!!! An intuitive logging framework for Node.js
[![npm version](https://badge.fury.io/js/loggaah.svg)](http://badge.fury.io/js/loggaah)
[![Build Status](https://travis-ci.org/mallocator/loggaah.svg?branch=master)](https://travis-ci.org/mallocator/loggaah)
[![Coverage Status](https://coveralls.io/repos/mallocator/loggaah/badge.svg?branch=master&service=github)](https://coveralls.io/github/mallocator/loggaah?branch=master)
[![Dependency Status](https://david-dm.org/mallocator/loggaah.svg)](https://david-dm.org/mallocator/loggaah) 

Yes this is another logging framework, because the world can never have enough logging frameworks.

#### So what makes this one so special or even different from others? Let's see:

* Written in ECMA 6
* Extensible plugin architecture
* Simple configuration
* Modifiable at runtime
* Multiple configuration options: File, Rest, Web-Interface through plugins
* Configurable log levels
* Follows examples and idea of Log4j2/Logback in Java

#### So how do you use it? Easy:

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
logs.configuration.appenders.default = {
    type: console,
    color: true
}
```

Or change it directly on the logger itself:
```JavaScript
log.addAppender('default', {
    type: console,
    color: true
});
```

Change where loggaah will look for config files:
```JavaScript
logs.configuration.configurators.json =  {
   files: ['my/path/to/my.config.json'],
   rescan: 30 //seconds
};
```

Add a processor to an appender:
```JavaScript
logs.configuration.appenders.default = {
    processors: 'formatter',
};
logs.configurations.processors.formatter = {
    pattern: '[%d] %m%n'
};
```

# Configurators
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
A web site that allows you to configure the client from the comforts of your own browser


# Loggers
Loggers combine multiple functions in them:
1. Loggers are your entry point into the logging system where you generate events (by calling log.info() for example)
2. Loggers can filter messages based on logging level
3. Loggers configure to which appender a message gets routed

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


# Appenders
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
 

# Processors
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