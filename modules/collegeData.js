const Sequelize = require('sequelize');

//eleplhantSQ.com Postgres Database
var sequelize = new Sequelize(
    'duokwhqu', //database
    'duokwhqu', //user
    'p7_-ppsu930jywYIRNw-eD9dWPVfNydT', //password
    { 
        host: 'peanut.db.elephantsql.com', 
        dialect:'postgres', 
        port: 5432,
        dialectOptions:{
            ssl:{rejectUnauthorized:false}
        },
        query:{raw:true}
    }
);

//model(table): Student
var Student = sequelize.define('Student',{
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

//model(table): Course
var Course = sequelize.define('Course',{
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },

    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING,
});

//has-many relationship
Course.hasMany(Student, {foreignKey: 'course'});

//update functions
module.exports.initialize = function () {
    return new Promise( function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve();
        }).catch(() => {
            reject("unable to sync the database"); return;
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        Student.findAll().then((data) => {
            resolve(data);
        }).catch((err) => {
            reject("no results returned"); return;
        });
    });
}

module.exports.getStudentsByCourse = function(course){
    return new Promise( 
        (resolve, reject) => {
            Student.findAll({
                where: {course: course}
            }).then(
                (data) => {
                    resolve(data);
                }
            ).catch(
                (err) => {
                    reject("no results returned");
                    return;
                }
            );
        }
    );
}

module.exports.getStudentByNum = function (num) {
    return new Promise( 
        (resolve, reject) => {
            Student.findAll({
                where: {studentNum: num}
            }).then(
                (data) =>{
                    resolve(data[0]);
                }
            ).catch(
                (err) => {
                    reject("no results returned");
                    return;
                }
            );
        }
    );
};

module.exports.getCourses = function(){
    return new Promise( 
        (resolve, reject) => {
            Course.findAll().then(
                (data) => {
                    resolve(data);
                }
            ).catch(
                (err) => {
                    reject("no results returned");
                    return;
                }
            );
        }
    );
};

module.exports.getCourseById = function (id) {
    return new Promise( 
        (resolve, reject) => {
            Course.findAll({
                where: {courseId: id}
            }
            ).then(
                (data)=>{
                    resolve(data[0]);
                }
            ).catch(
                (err) => {
                    reject("no results returned");
                    return;
                }
            );
        }
    );
};

module.exports.addStudent = function (studentData) {
    return new Promise(function (resolve, reject) {

        studentData.TA = (studentData.TA) ? true : false;
        
        for(var prop in studentData) {
            if(studentData[prop] == '')
            studentData[prop] = null;
        }
        
        Student.create(studentData).then(
            () => {
                resolve();
            }   
        ).catch((err) => {
            reject("unable to create student"); 
            return;
        });
    
    });
};

module.exports.addCourse = function (courseData) {
    return new Promise((resolve, reject) => {
        
        for(var prop in courseData) {
            if(courseData[prop] === "")
            courseData[prop] = null;
        }
        
        Course.create({
            courseCode: courseData.courseCode,
            courseDescription: courseData.courseDescription
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject("unable to create course"); return;
        });
    });
};

module.exports.updateStudent = function (studentData) {
    //expicit TA's boolean value
    studentData.TA = (studentData.TA) ? true : false;
    //expicit other attributs' string values
        for(var prop in studentData){
            if(studentData[prop] === ""){
                studentData[prop] = null;
            }
        }

    return new Promise( 
        (resolve, reject) => {
            console.log("CD201: " + studentData);
            Student.update(studentData, {
                where: {studentNum: studentData.studentNum}
            }).then(
                ()=>{
                    resolve();
                }
            ).catch(
                (err)=>{
                    reject("unable to update student");
                    return;
                }
            );
        }
    );
};

module.exports.updateCourse = function (courseData) {
    //expicit string attributes' value
    for(var prop in courseData){
        if(courseData[prop] === ""){
            courseData[prop] = null;
        }
    }
    return new Promise( 
        (resolve, reject) => {
            Course.update({
                courseCode: courseData.courseCode,
                courseDescription: courseData.courseDescription
            }, {
                where: {courseId: courseData.courseId}
            }).then(
                ()=>{
                    resolve();
                }
            ).catch(
                (err)=>{
                    reject("unable to update course");
                    return;
                }
            );
        }
    );
};

module.exports.deleteCourseById = function (id){

    return new Promise(
        (resolve, reject) => {
            Course.destroy({
                where: {courseId: id}
            }).then(
                () => {
                    resolve();
                }
            ).catch(
                (err) => {
                    reject("Deletion of course encounters an error");
                    return;
                }
            );
        }
    );
};

module.exports.deleteStudentByNum = function (studentNum){

    return new Promise(
        (resolve, reject) => {
            Student.destroy({
                where: {studentNum: studentNum}
            }).then(
                () => {
                    resolve();
                }
            ).catch(
                (err) => {
                    reject("Deletion of student encounters an error");
                    return;
                }
            );
        }
    );
};