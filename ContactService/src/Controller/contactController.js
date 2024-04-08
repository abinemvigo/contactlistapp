const createError = require("http-errors");
const Contact = require("../Model/contactModel");
const { successResponse } = require("./responseController");

const getAllContactList = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 5; // Default limit is set to 10

    const searchRegEx = new RegExp(".*" + search + ".*", "i");

    const filter = {
      $or: [
        { name: { $regex: searchRegEx } },
        { email: { $regex: searchRegEx } },
        { phone: { $regex: searchRegEx } },
        { address: { $regex: searchRegEx } },
      ],
    };

    const contacts = await Contact.find(filter)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Contact.find(filter).countDocuments();

    if (!contacts) throw createError(404, "No Contacts Found!!");

    const totalPages = limit ? Math.ceil(count / limit) : 1; // Ensure limit is not 0

    return successResponse(res, {
      statusCode: 200,
      message: "Contacts returned successfully",
      payload: {
        contacts,
        pagination: {
          totalPages,
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= totalPages ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const handleCreateContact = async (req, res, next) => {
  try {
    const { name, phone, email, address } = req.body;

    const contactExistEmail = await Contact.exists({ email });
    if (contactExistEmail) {
      throw createError(409, `Contact already exist with this email`);
    }
    const contactExistPhone = await Contact.exists({ phone });
    if (contactExistPhone) {
      throw createError(409, `Contact already exist with this phone number`);
    }

    const contact = await Contact.create({
      name,
      phone,
      email,
      address,
    });

    return successResponse(res, {
      statusCode: 200,
      message: "Contacts created successfully",
      payload: contact,
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateContact = async (req, res, next) => {
  try {
    const userID = req.params.id;

    const contact = await Contact.findById(userID);
    const email = req.body.email;
    const phone = req.body.phone;
    if(contact.email !== req.body['email']){
      const contactExistEmail = await Contact.exists({ email });
      if (contactExistEmail) {
        throw createError(409, `Contact already exist with this email`);
      }
    }
    if(contact.phone !== phone){
      const contactExistPhone = await Contact.exists({ phone });
      if (contactExistPhone) {
        throw createError(409, `Contact already exist with this phone number`);
      }
    }

   

    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};

    for (const key in req.body) {
      if (["name", "email", "phone", "address"].includes(key)) {
        updates[key] = req.body[key];
      }
    }
    const updatedContact = await Contact.findByIdAndUpdate(
      userID,
      updates,
      updateOptions
    );

    return successResponse(res, {
      statusCode: 200,
      message: "Contacts created successfully",
      payload: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};
const handleGetContact = async (req, res, next) => {
  try {
    const userID = req.params.id;

    const contact = await Contact.findById(userID);

    return successResponse(res, {
      statusCode: 200,
      message: "Contacts created successfully",
      payload: contact,
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteContact = async (req, res, next) => {
  try {
    const id = req.params.id;

    const deletedUser = await Contact.findByIdAndDelete({ _id: id });

    return successResponse(res, {
      statusCode: 200,
      message: "Contacts deleted successfully",
      payload: deletedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContactList,
  handleDeleteContact,
  handleCreateContact,
  handleUpdateContact,
  handleGetContact,
};