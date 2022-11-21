const Push = require('pushover-notifications');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pushover = new Push({
    user: process.env.PUSHOVER_USER,
    token: process.env.PUSHOVER_TOKEN
});

app.post('/', (req, res) => {
    // Sample influx alert message
    /*
        {
            _check_id: '0a5257d77fe9a000',
            _check_name: 'Server CPU Usage',
            _level: 'crit',
            _measurement: 'notifications',
            _message: 'crit: Server CPU Usage',
            _notification_endpoint_id: '0a5256d6c145c000',
            _notification_endpoint_name: 'influx2pushover',
            _notification_rule_id: '0a45729bccb49000',
            _notification_rule_name: 'Critical Notification',
            _source_measurement: 'cpu',
            _source_timestamp: 1669021380000000000,
            _start: '2022-11-21T08:59:00Z',
            _status_timestamp: 1669021380000000000,
            _stop: '2022-11-21T09:05:00Z',
            _time: '2022-11-21T09:05:00Z',
            _type: 'threshold',
            _version: 1,
            cpu: 'cpu-total',
            host: 'My-Server',
            usage_idle: 18.33693239992792
        }
    */
    const influxMessage = req.body;
    const priority = influxMessage['_level'] === 'crit' ? 1 : 0;
    const title = influxMessage['_check_name'];
    const message = influxMessage['_message'];

    const pushoverMessage = {
        title,
        message,
        priority
    };
    pushover.send(pushoverMessage, (err, result) => {
        if (err) {
            console.err('Error pushing message', err);
            return;
        }
        console.log('Sent pushover message: ', pushoverMessage);
        console.log(result);
    });

    res.status(200).end();
});

app.listen(port, () => {
    console.log(`influx2pushover app listening on port ${port}`);
});
