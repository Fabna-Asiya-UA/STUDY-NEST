import Material from "../models/Material.js";
import Connection from "../models/Connection.js";

// ========================================
// CREATE MATERIAL
// ========================================

export const createMaterial = async ({
  title,
  description,
  fileUrl,
  videoUrl,
  subject,
  teacherId
}) => {
  const material = await Material.create({
    title,
    description,
    fileUrl,
    videoUrl,
    subject,
    teacher: teacherId
  });

  return material;
};

// ========================================
// GET TEACHER MATERIALS
// ========================================

export const getTeacherMaterials = async (
  teacherId
) => {
  const materials = await Material.find({
    teacher: teacherId
  })
    .populate(
      "teacher",
      "name email"
    )
    .sort({
      createdAt: -1
    });

  return materials;
};

// ========================================
// GET STUDENT MATERIALS
// ========================================

export const getStudentMaterials = async (
  studentId
) => {
  // Find all accepted teacher connections
  const connections =
    await Connection.find({
      student: studentId,
      status: "accepted"
    });

  // Student has no connected teachers
  if (!connections.length) {
    return [];
  }

  // Get all connected teacher IDs
  const teacherIds =
    connections.map(
      (connection) =>
        connection.teacher
    );

  // Get materials from all connected teachers
  const materials =
    await Material.find({
      teacher: {
        $in: teacherIds
      }
    })
      .populate(
        "teacher",
        "name email"
      )
      .sort({
        createdAt: -1
      });

  return materials;
};

// ========================================
// DELETE MATERIAL
// ========================================

export const deleteMaterial = async (
  materialId,
  teacherId
) => {
  const material =
    await Material.findOne({
      _id: materialId,
      teacher: teacherId
    });

  if (!material) {
    throw new Error(
      "Material not found or you are not authorized to delete it"
    );
  }

  await material.deleteOne();

  return material;
};