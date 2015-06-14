function createLoggingWritable(writableOrig) {
  var proto = Object.getPrototypeOf(writableOrig);
  
  function LoggingWritable(subject) {
    this.writableOrig = writableOrig;
  }
  LoggingWritable.prototype = Object.create(proto);
  
  LoggingWritable.prototype.write = 
    function(chunk, encoding, callback) {
      if(!callback && typeof encoding === 'function') {
        callback = encoding;
        encoding = undefined;
      }
      console.log('Writing ', chunk);
      return this.writableOrig.write(chunk, encoding, function() {
        console.log('Finished writing ', chunk);
        callback && callback();
      });
    };
  
  LoggingWritable.prototype.on = function() {
    return this.writableOrig.on
      .apply(this.writableOrig, arguments);
  };
  
  LoggingWritable.prototype.end = function() {
    return this.writableOrig.end
      .apply(this.writableOrig, arguments);
  }
  
  return new LoggingWritable(this.writableOrig);
}

var fs = require('fs');
var writable = fs.createWriteStream('test.txt');
var writableProxy = createLoggingWritable(writable);
writableProxy.write('First chunk');
writableProxy.write('Second chunk');
writable.write('This is not logged');
writableProxy.end();

