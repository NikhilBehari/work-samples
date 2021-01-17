const MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const url = "mongodb://localhost:27017";
var tunnel = require('tunnel-ssh');
const conf = require('./.config');
const https = require('https');
const h337 = require('./heatmap')
var heatmap = h337.create({
    // container: document.getElementById('heatmapContainer'),
    maxOpacity: .5,
    radius: 20,
    blur: .75,
    // update the legend whenever there's an extrema change
    onExtremaChange: function onExtremaChange(data) {
    }
});


var classCollection = [];


const class_code = "05418A"; //05391A
// SSH Tunnel Config 
var config = {
    // Change
    username: conf.username,
    // Usually in the form of /Users/*username*/.shh/id_rsa 
    privateKey: require('fs').readFileSync(conf.key_path),
    password: conf.password,

    // Keep the same 
    agent: process.env.SSH_AUTH_SOCK,
    host: conf.db_host,
    port: 22,
    dstPort: 27017
};

function mode(numbers) {
    // as result can be bimodal or multi-modal,
    // the returned result is provided as an array
    // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
    var modes = [], count = [], i, number, maxIndex = 0;

    for (i = 0; i < numbers.length; i += 1) {
        number = numbers[i];
        count[number] = (count[number] || 0) + 1;
        if (count[number] > maxIndex) {
            maxIndex = count[number];
        }
    }

    for (i in count)
        if (count.hasOwnProperty(i)) {
            if (count[i] === maxIndex) {
                modes.push(Number(i));
            }
        }

    return modes;
}

tunnel(config, function (error, server) {
    if (error) {
        console.log("SSH connection error: " + error);
    } else {
        console.log("SSH Connection Successful");
    }

    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            console.log("Error connecting to database");
        }
        console.log("Connected to database");
        _db = client.db('edusense-graphql-testdb');


        const data = JSON.stringify({ "query": "\nquery sessionsSearch($keywordSearch: String) {\n  sessions(keyword: $keywordSearch) {\n    id\n    keyword\n  }\n}\n", "operationName": "sessionsSearch" });
        const options = {
            hostname: "ci-storage-1.andrew.cmu.edu",
            port: 3001,
            path: "/query",
            auth: "classinsight-phase1-beta:OjVxJXq95UbCryA39PVq",
            method: "POST"
        };
        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);
            var bodyParts = [], bodyLength = 0;
            res.on('data', chunk => {
                bodyParts.push(chunk);
                bodyLength += chunk.length;
            });
            res.on('end', d => {
                // console.log("Found Sessions");
                var body = Buffer.alloc(bodyLength);
                var bodyPos = 0;
                for (var i = 0; i < bodyParts.length; i++) {
                    bodyParts[i].copy(body, bodyPos, 0, bodyParts[i].length);
                    bodyPos += bodyParts[i].length;
                }
                let obj = JSON.parse(body.toString());
                var sessions = JSON.parse(obj.response).data.sessions;
                var sessionsForClass = sessions.filter(function (session) {
                    return session.keyword.includes(class_code);
                });

                // sessionsForClass = sessionsForClass.slice(0, 3);

                sessionsForClass.forEach(function (session, id) {
                    var class_time = session.keyword.split("_").pop();

                    var year = class_time.substring(0, 4);
                    var month = class_time.substring(4, 6);
                    var date = class_time.substring(6, 8);
                    var hour = class_time.substring(8, 10);
                    var mins = class_time.substring(10, 12);

                    var classroomData = {
                        metadata: {
                            timestamp: month + "/" + date + "/" + year,
                        },
                        attendance: null,
                        handraises: null,
                        front: null,
                        instructor_movement: null
                    };
                    var channelName = "student";
                    var query = { "query": "\nquery sessionsChannel($id: ID!, $channel: Channel!) {\n  sessions(sessionId: $id) {\n    videoFrames(\n      schema: \"classinsight-graphql\",\n      channel: $channel\n    ) {\n      n: frameNumber,\n      t: timestamp { s: unixSeconds, ns: unixNanoseconds },\n      p: people {\n        b: body\n        i: inference {\n          p: posture {\n            c: centroidDelta\n            a: armPose\n            s: sitStand\n          }\n          h: head {\n            r: roll\n            p: pitch\n            y: yaw\n            g: gazeVector\n            t: translationVector\n          }\n          f: face {\n            b: boundingBox\n            d: orientation\n          }\n          t: trackingId\n        }\n      }\n    }\n    audioFrames(\n    schema: \"classinsight-graphql\",\n    channel: $channel\n    ) {\n    n: frameNumber,\n    t: timestamp { s: unixSeconds, ns: unixNanoseconds },\n    a: audio {\n        x: amplitude\n        }\n    }\n  }\n}\n", "variables": { "id": `${session.id}`, "channel": `${channelName}` }, "operationName": "sessionsChannel" };
                    query = JSON.stringify(query);
                    var dataParts = [], dataLength = 0;
                    let studentPromise = new Promise(function (resolve, reject) {
                        const req1 = https.request(options, res1 => {
                            res1.on('data', chunk => {
                                dataParts.push(chunk);
                                dataLength += chunk.length;
                            });
                            res1.on('end', d => {
                                // console.log("found session data student");
                                var buffer = Buffer.alloc(dataLength);
                                var bodyPos = 0;
                                for (var i = 0; i < dataParts.length; i++) {
                                    dataParts[i].copy(buffer, bodyPos, 0, dataParts[i].length);
                                    bodyPos += dataParts[i].length;
                                }
                                var session_data = JSON.parse(buffer.toString());
                                let studentCount = [];
                                let student = JSON.parse(session_data.response).data.sessions[0].videoFrames;
                                for (i = 0; i < student.length; i++) {
                                    var poses = student[i].p;
                                    var num = 0, err = 0;
                                    for (let pose of poses) {
                                        const { i: inferences = null } = pose;
                                        if (inferences === null) {
                                            err++;
                                        } else {
                                            if (inferences.p.a) {
                                                num++;
                                            }
                                        }
                                    }
                                    studentCount.push(num);
                                }
                                classroomData.attendance = mode(studentCount)[0];

                                let handRaiseArray = {};
                                for (i = 0; i < student.length; i++) {
                                    var poses = student[i].p;
                                    for (let pose of poses) {
                                        const { i: inferences = null } = pose;
                                        if (inferences !== null) {
                                            var value = (inferences.p.a === 'handsRaised');
                                            const trackingId = pose.i.t;
                                            if (inferences !== null && trackingId !== null) {
                                                if (handRaiseArray[trackingId] === undefined) {
                                                    handRaiseArray[trackingId] = [value];
                                                }
                                                else {
                                                    handRaiseArray[trackingId].push(value);
                                                }
                                            }
                                        }
                                    }
                                }

                                var total_handraises = 0;
                                for (const key in handRaiseArray) {

                                    let arr = handRaiseArray[key];

                                    var flag = false;
                                    var max_false = 15;
                                    var num_true = 0;

                                    for (i = 0; i < arr.length; i++) {
                                        if (flag) {
                                            (arr[i]) ? num_true++ : max_false--;
                                        }
                                        if (arr[i] && !flag) {
                                            flag = true;
                                        }
                                        if (max_false < 0) {
                                            flag = false;
                                            max_false = 15;
                                            if (num_true > 3) {
                                                total_handraises++;
                                            }
                                        }
                                    }
                                }

                                classroomData.handraises = total_handraises;

                                resolve(true);
                            });
                        });
                        req1.on('error', error => {
                            console.log(error);
                            reject(false);
                        });
                        req1.write(query);
                        req1.end();
                    });

                    var channelName = "instructor";
                    let instructorPromise = new Promise(function (resolve, reject) {
                        const req2 = https.request(options, res2 => {
                            var dataParts = [], dataLength = 0;

                            res2.on('data', chunk => {
                                dataParts.push(chunk);
                                dataLength += chunk.length;
                            });
                            res2.on('end', d => {
                                // console.log("found session data instructor");
                                var buffer = Buffer.alloc(dataLength);
                                var bodyPos = 0;
                                for (var i = 0; i < dataParts.length; i++) {
                                    dataParts[i].copy(buffer, bodyPos, 0, dataParts[i].length);
                                    bodyPos += dataParts[i].length;
                                }
                                var session_data = JSON.parse(buffer.toString());
                                let instructor = JSON.parse(session_data.response).data.sessions[0].videoFrames;
                                let orientation = [0, 0];
                                for (i = 0; i < instructor.length; i++) {
                                    var poses = instructor[i].p;
                                    var num = 0, err = 0;
                                    for (let pose of poses) {
                                        if (pose.i.f.d == 'front') {
                                            orientation[0]++;
                                        }
                                        if (pose.i.f.d == 'back') {
                                            orientation[1]++;
                                        }
                                    }
                                }
                                var percent_front = (orientation[0] * 100) / (orientation[0] + orientation[1]);
                                classroomData.front = percent_front.toFixed(2);





                                var armpose_data = [];
                                for (i = 0; i < instructor.length; i += 5) {
                                    var poses = instructor[i].p[0];
                                    if (poses && poses.i && poses.i.h && poses.i.h.g && poses.i.h.g.length) {
                                        armpose_data.push({ x: parseInt(poses.i.h.g[0][0] * 1000 / 3840), y: parseInt(poses.i.h.g[0][1] * 562 / 2160), value: 0.3, radius: 15 });

                                    }
                                }
                                // set the generated dataset
                                heatmap.setData({
                                    min: 0,
                                    max: 1,
                                    data: armpose_data
                                });


                                const max_dist = 10, width = 1000;

                                var arrs = [];
                                var tmp = [];
                                var j, x_dist = 0;

                                var hh = (heatmap.getData()).data;
                                for (i = 1; i < hh.length; i++) {
                                    if (hh[i].x - hh[i - 1].x < max_dist) {
                                        tmp.push(hh[i]);
                                    }
                                    else {
                                        arrs.push(tmp);
                                        tmp = [hh[i]];
                                    }
                                }

                                for (i = 0; i < arrs.length; i++) {
                                    if (arrs[i].length > 1) {
                                        var x1 = arrs[i][0].x;
                                        var x2 = arrs[i][arrs[i].length - 1].x;
                                        x_dist += Math.abs(x1 - x2);
                                    }
                                }
                                var instructor_movement = (x_dist / width * 100).toFixed(2) + ' %';

                                classroomData.instructor_movement = instructor_movement;
                                // console.log(instructor_movement);
                                resolve(true);
                            });
                        });
                        req2.on('error', error => {
                            console.log(error);
                            reject(false);
                        });
                        req2.write(query);
                        req2.end();
                    });
                    //insert db here
                    Promise.all([studentPromise, instructorPromise]).then(function () {
                        // console.log(classroomData);
                        // classCollection.push(classroomData);
                        _db.collection(`class_${class_code}`, function (err, collection) {
                            console.log("Inserting into db");
                            collection.insertOne(classroomData);
                        });
                    });
                });
                // _db.collection(`class_${class_code}`, function (err, collection) {
                //     console.log("Inserting into db");
                //     collection.insertMany(classroomData);
                // });
            });
        });
        req.on('error', error => {
            console.error(error);
            console.log("Here :(");
        })

        req.write(data) //actual API call
        req.end();
    });
});