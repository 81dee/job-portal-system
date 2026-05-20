import User from "../models/user.js";

// GET PENDING RECRUITERS
export const getPendingRecruiters = async (req, res) => {

    try {

        const recruiters = await User.find({

            role: "recruiter",
            isApproved: false

        });

        res.status(200).json(recruiters);

    } catch (error) {

        console.log(error);
    }
};

// APPROVE
export const approveRecruiter = async (req, res) => {

    try {

        const recruiter = await User.findByIdAndUpdate(

            req.params.id,

            { isApproved: true },

            { new: true }
        );

        res.status(200).json({

            success: true,
            recruiter
        });

    } catch (error) {

        console.log(error);
    }
};