const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();

exports.main = async (event, context) => {
  const { action, entityType, data } = event;
  switch (entityType) {
    case 'student':
      return handleStudent(action, data);
    case 'professional':
      return handleProfessional(action, data);
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

const handleProfessional = async (action, data) => {
  switch (action) {
    case 'register':
      return registerProfessional(data);
    case 'update':
      return updateProfessional(data);
    case 'delete':
      return deleteProfessional(data);
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

const registerProfessional = async (data) => {
  const professionalData = extractProfessionalFields(data);
  try {
    const result = await db.collection('professionals').add({ data: professionalData });
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
};

const updateProfessional = async (data) => {
  const { _id, ...updateData } = data;
  const professionalData = extractProfessionalFields(updateData);
  try {
    const result = await db.collection('professionals').doc(_id).update({ data: professionalData });
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
};

const deleteProfessional = async (data) => {
  try {
    const { _id } = data;
    const result = await db.collection('professionals').doc(_id).remove();
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
};

const extractStudentFields = (data) => {
    return {
      name: data.name || '',
      age: data.age || '',
      grade: data.grade || '',
      telephone: data.telephone || '',
      course: data.courseValue || '',
      gradeIndex: data.gradeIndex?.value || '',
      gradeValue: data.gradeValue || '',
      basic: data.basicValue || '',
      trait_limit: data.traitValue || '',
      sex: data.sexValue || '',
      frequency: data.frequencyValue || '',
      salary: data.salary || '',
      addressName: data.addressNameValue || '',
      studentTrait: data.choseStudentTraitValue || '',
      teacherTrait: data.choseTeacherTraitValue || '',
      addressDetail: data.addressDetailValue || '',
      latitude: data.latitudeValue || '',
      longitude: data.longitudeValue || '',
      remark: data.remark || '',
      courseEnglish: data.courseEnglishValue || '',
      own: data.objectId || '',
      modifyTime: data.nowTime || '',
      // ...other student fields...
    };
};

const extractProfessionalFields = (data) => {
    return {
      name: data.name || '',
      age: data.age || '',
      professionalType: data.professionalType || '',
      professional_name: data.professionalName || '',
      telephone: data.telephone || '',
      major: data.major || '',
      professional_score: data.professionalScore || '',
      salary: data.salary || '',
      salaryType: data.salaryType || '',
      self_int: data.remark || '',
      sex: data.sexValue || '',
      university: data.universityValue || '',
      degree: data.degreeValue || '',
      professional_course: data.choseCourseValue || '',
      professional_trait: data.choseTraitValue || '',
      photo: data.photoValue || '',
      trait: data.trait.value || '',
      own: data.objectId || '',
      images: data.urlArr.value || '',
      modifyTime: data.nowTime || '',
      // ...other professional fields...
    };
};


// {
// 	"action": "register",
// 	"entityType": "student",
// 	"data": {
// 			"name": "3",
// 			"telephone": "33",
// 			"course": "数学",
// 			"grade": ["小学", "一年级"],
// 			"basic": "较差",
// 			"trait_limit": "有能力即可",
// 			"sex": "无要求",
// 			"frequency": "一周一次",
// 			"salary": "33",
// 			"addressName": "",
// 			"studentTrait": [],
// 			"teacherTrait": [],
// 			"addressDetail": "",
// 			"latitude": "",
// 			"longitude": "",
// 			"remark": "a",
// 			"courseEnglish": "math"
// 		}

// }