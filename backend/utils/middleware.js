const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(req.method, req.path)
    console.log(req.body)
    console.log('----')
  }
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).json({"error": "unknown endpoint"})
}

module.exports = { requestLogger, unknownEndpoint }