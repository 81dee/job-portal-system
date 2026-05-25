import { useState } from "react";

import API from "../services/api";

import toast from "react-hot-toast";

import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";

export default function Profile() {

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({

    skills: "",

    qualification: "",

    experience: "",

    bio: ""
  });

  const [photo, setPhoto] = useState(null);

  // HANDLE CHANGE
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = new FormData();

      data.append(

        "skills",

        formData.skills
      );

      data.append(

        "qualification",

        formData.qualification
      );

      data.append(

        "experience",

        formData.experience
      );

      data.append(

        "bio",

        formData.bio
      );

      if (photo) {

        data.append(

          "profilePhoto",

          photo
        );
      }

      await API.put(

        "/user/profile",

        data,

        {
          headers: {

            Authorization: `Bearer ${token}`,

            "Content-Type":

              "multipart/form-data"
          }
        }
      );

      toast.success(

        "Profile Updated"
      );

    } catch (error) {

      console.log(error);

      toast.error(

        "Update failed"
      );
    }
  };

  return (

    <div className="page page--narrow">

      <PageHeader
        eyebrow="Account"
        title="Edit profile"
        subtitle="Keep your skills and experience up to date for recruiters."
      />

      <form
        className="card profile-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          name="skills"
          placeholder="Skills"
          onChange={handleChange}
        />

        <input
          type="text"
          name="qualification"
          placeholder="Qualification"
          onChange={handleChange}
        />

        <input
          type="text"
          name="experience"
          placeholder="Experience"
          onChange={handleChange}
        />

        <textarea
          name="bio"
          placeholder="Bio"
          onChange={handleChange}
        />

        <input
          type="file"
          onChange={(e) =>

            setPhoto(

              e.target.files[0]
            )
          }
        />

        <Button type="submit" block size="lg">

          Update profile

        </Button>

      </form>

    </div>
  );
}