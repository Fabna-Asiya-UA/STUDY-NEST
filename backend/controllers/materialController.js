import {
  createMaterial as createMaterialService,
  getTeacherMaterials,
  getStudentMaterials,
  deleteMaterial as deleteMaterialService
} from "../services/materialService.js";


// CREATE MATERIAL
export const createMaterial = async (
  req,
  res,
  next
) => {
  try {
    const {
      title,
      description,
      fileUrl,
      videoUrl,
      subject
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Material title is required"
      });
    }

    const material =
      await createMaterialService({
        title: title.trim(),
        description,
        fileUrl,
        videoUrl,
        subject,
        teacherId: req.user._id
      });

    res.status(201).json({
      success: true,
      message: "Material uploaded successfully",
      material
    });
  } catch (error) {
    next(error);
  }
};


// GET MATERIALS
export const getMaterials = async (
  req,
  res,
  next
) => {
  try {
    let materials;

    if (req.user.role === "teacher") {
      materials =
        await getTeacherMaterials(
          req.user._id
        );
    } else if (req.user.role === "student") {
      materials =
        await getStudentMaterials(
          req.user._id
        );
    } else {
      return res.status(403).json({
        success: false,
        message:
          "Only teachers and students can access materials"
      });
    }

    res.status(200).json({
      success: true,
      materials
    });
  } catch (error) {
    next(error);
  }
};


// DELETE MATERIAL
export const deleteMaterial = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    await deleteMaterialService(
      id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Material deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};