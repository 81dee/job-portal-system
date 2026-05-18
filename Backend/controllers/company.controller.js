import Company from "../models/company.js";

export const registerCompany = async (req, res) => {

    try {

        const company = await Company.create({
            ...req.body,
            recruiter: req.user._id
        });

        res.status(201).json({
            success: true,
            company
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// approved

export const approveCompany = async(req, res) => {

    try {

        const company = await Company.findByIdAndUpdate(
            req.params.id,
            {
                approvalStatus: "approved"
            },
            { new: true }
        );

        res.json(company);

    } catch(error){
        res.status(500).json(error);
    }
};