import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['ADMIN', 'TOUR_GUIDE', 'TRAVELLER'],
        unique: true,
        required: true
    }
});

const RoleModel = mongoose.model('Role', roleSchema);
export default RoleModel;