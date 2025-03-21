const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();

exports.main = async (event, context) => {
  const { action, data, entityType } = event;
  switch (entityType) {
    case 'student':
      return handleStudent(action, data);
    case 'teacher':
      return handleTeacher(action, data);
    default:
      return { error: 'Invalid entity type' };
  }
};

const handleStudent = async (action, data) => {
  switch (action) {
    case 'register':
      return registerStudent(data);
    case 'update':
      return updateStudent(data);
    case 'delete':
      return deleteStudent(data);
    default:
      return { error: 'Invalid action' };
  }
};

const handleTeacher = async (action, data) => {
  switch (action) {
    case 'register':
      return registerTeacher(data);
    case 'update':
      return updateTeacher(data);
    case 'delete':
      return deleteTeacher(data);
    default:
      return { error: 'Invalid action' };
  }
};

const registerStudent = async (data) => {
  const studentData = extractStudentFields(data);
  try {
    const result = await db.collection('students').add({ data: studentData });
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
};

const updateStudent = async (data) => {
  const { _id, ...updateData } = data;
  const studentData = extractStudentFields(updateData);
  try {
    const result = await db.collection('students').doc(_id).update({ data: studentData });
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
};

const deleteStudent = async (data) => {
  try {
    const { _id } = data;
    const result = await db.collection('students').doc(_id).remove();
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
};

const registerTeacher = async (data) => {
  const teacherData = extractTeacherFields(data);
  try {
    const result = await db.collection('teachers').add({ data: teacherData });
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
};

const updateTeacher = async (data) => {
  const { _id, ...updateData } = data;
  const teacherData = extractTeacherFields(updateData);
  try {
    const result = await db.collection('teachers').doc(_id).update({ data: teacherData });
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
};

const deleteTeacher = async (data) => {
  try {
    const { _id } = data;
    const result = await db.collection('teachers').doc(_id).remove();
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
};

const extractStudentFields = (data) => {
    return {
        name: data.name,
        age: data.age,
        grade: data.grade,
        telephone: data.telephone,
        course: data.courseValue,
        gradeIndex: data.gradeIndex.value,
        gradeValue: data.gradeValue,
        basic: data.basicValue,
        trait_limit: data.traitValue,
        sex: data.sexValue,
        frequency: data.frequencyValue,
        salary: data.salary,
        addressName: data.addressNameValue,
        studentTrait: data.choseStudentTraitValue,
        teacherTrait: data.choseTeacherTraitValue,
        addressDetail: data.addressDetailValue,
        latitude: data.latitudeValue,
        longitude: data.longitudeValue,
        remark: data.remark,
        courseEnglish: data.courseEnglishValue,
        own: data.objectId,
        modifyTime: data.nowTime,
        // ...other student fields...
    };
};

const extractTeacherFields = (data) => {
    return {
        name: data.name,
        age: data.age,
        subject: data.subject,
        teacher_name: data.teacherName,
        telephone: data.telephone,
        major: data.major,
        teacher_score: data.teacherScore,
        salary: data.salary,
        self_int: data.remark,
        sex: data.sexValue,
        university: data.universityValue,
        degree: data.degreeValue,
        teach_course: data.choseCourseValue,
        teach_trait: data.choseTraitValue,
        photo: data.photoValue,
        trait: data.trait.value,
        own: data.objectId,
        images: data.urlArr.value,
        modifyTime: data.nowTime,
        // ...other teacher fields...
    };
};
