'use strict'

let express = require('express'),
    exec = require('child_process').exec,
    app = express()

module.exports = {
    start: (port, standalone) => {
        app.get('/health', (req, res) => {
            res.send({status: 'UP'})
        })

        let processMessage = (res, message) => {
            console.log(message)
            res.send(message)
        }

        // receiving shell commands to proxy on "POST /<command>/<target-service>"
        app.post('/:command/:service', (req, res) => {
            let totalCommand = `sh ./${req.params.command}.sh ${req.params.service}`

            console.log(`Executing "${totalCommand}"`)

            exec(totalCommand, (error, stdout, stderr) => {
                processMessage(res, error ? stderr : stdout)
            });
        })

        // offer static resources on "/"
        app.use(express.static('./' + (standalone ? '' : 'ui')))

        app.listen(port, () => console.log(`cargo-compose UI listening on port ${port}...`))
    }
}
