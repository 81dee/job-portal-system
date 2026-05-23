import { useState } from "react";

import API from "../services/api";

import toast from "react-hot-toast";

import "../assets/styles/profile.css";

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

    <div className="profile-page">

      <form
        className="profile-form"
        onSubmit={handleSubmit}
      >

        <h1>

          Edit Profile

        </h1>

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

        <button type="submit">

          Update Profile

        </button>

      </form>

    </div>
  );
}