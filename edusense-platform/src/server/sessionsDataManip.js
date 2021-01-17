sessionsForClass.forEach(function (session, id) {
                                // var query = {
                                //     query: `query sessionsChannel($id: ID!, $channel: Channel!) {
                                //             sessions(sessionId: "$id") {
                                //                 keyword
                                //                 videoFrames(
                                //                     schema: "classinsight-graphql",
                                //                     channel: student
                                //                 ) {
                                //                     t: timestamp {
                                //                         s: unixSeconds
                                //                     }
                                //                     p: people {
                                //                         i: inference {
                                //                             posture {
                                //                                 armPose
                                //                                 sitStand
                                //                             }
                                //                         }
                                //                     }
                                //                 }
                                //             }
                                //         }`,
                                //     variables: {
                                //         id: "5cd16d17e81eb77193056d85",
                                //         channel: "student"
                                //     }, 
                                //     operationName: "sessionsChannel"
                                // };
                                var channelName = "student";
                                var query = { "query": "\nquery sessionsChannel($id: ID!, $channel: Channel!) {\n  sessions(sessionId: $id) {\n    videoFrames(\n      schema: \"classinsight-graphql\",\n      channel: $channel\n    ) {\n      n: frameNumber,\n      t: timestamp { s: unixSeconds, ns: unixNanoseconds },\n      p: people {\n        b: body\n        i: inference {\n          p: posture {\n            c: centroidDelta\n            a: armPose\n            s: sitStand\n          }\n          h: head {\n            r: roll\n            p: pitch\n            y: yaw\n            g: gazeVector\n            t: translationVector\n          }\n          f: face {\n            b: boundingBox\n            d: orientation\n          }\n          t: trackingId\n        }\n      }\n    }\n    audioFrames(\n    schema: \"classinsight-graphql\",\n    channel: $channel\n    ) {\n    n: frameNumber,\n    t: timestamp { s: unixSeconds, ns: unixNanoseconds },\n    a: audio {\n        x: amplitude\n        }\n    }\n  }\n}\n", "variables": { "id": `${session.id}`, "channel": `${channelName}` }, "operationName": "sessionsChannel" }
                                query = JSON.stringify(query);
                                var dataParts = [], dataLength = 0;
                                let studentPromise = new Promise(function (resolve, reject) {
                                    const req1 = https.request(options, res1 => {
                                        res1.on('data', chunk => {
                                            dataParts.push(chunk);
                                            dataLength += chunk.length;
                                        });
                                        res1.on('end', d => {
                                            console.log("found session data");
                                            var buffer = Buffer.alloc(dataLength);
                                            var bodyPos = 0;
                                            for (var i = 0; i < dataParts.length; i++) {
                                                dataParts[i].copy(buffer, bodyPos, 0, dataParts[i].length);
                                                bodyPos += dataParts[i].length;
                                            }
                                            var session_data = JSON.parse(buffer.toString());
                                            let studentCount = [];
                                            let student = JSON.parse(session_data.response).data.sessions[0].videoFrames;
                                            classroomData.metadata.timestamp = student[0].t;
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

                                let instructorPromise = new Promise(function (resolve, reject) {
                                    const req2 = https.request(options, res2 => {
                                        dataParts = [], dataLength = 0;

                                        res2.on('data', chunk => {
                                            dataParts.push(chunk);
                                            dataLength += chunk.length;
                                        });
                                        res2.on('end', d => {
                                            console.log("found session data");
                                            var buffer = Buffer.alloc(dataLength);
                                            var bodyPos = 0;
                                            for (var i = 0; i < dataParts.length; i++) {
                                                dataParts[i].copy(buffer, bodyPos, 0, dataParts[i].length);
                                                bodyPos += dataParts[i].length;
                                            }
                                            var session_data = JSON.parse(buffer.toString());
                                            let instructor = JSON.parse(session_data.response).data.sessions[0].videoFrames;
                                            let orientation = [0, 0];
                                            for (i = 0; i < instructor.v.length; i++) {
                                                var poses = instructor.v[i].p;
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
                                Promise.all(studentPromise, instructorPromise).then(function () {
                                    console.log(classroomData);
                                });
                            });