function testNotUndefinedAndEvaluate<T>(test: any, cb: () => T): T | void {
  if (test !== undefined) {
    return cb();
  }
}

export {
  testNotUndefinedAndEvaluate,
}

