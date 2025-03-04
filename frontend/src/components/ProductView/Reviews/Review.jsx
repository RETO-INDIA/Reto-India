import StarRateIcon from "@mui/icons-material/StarRate";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Carousel from "./Carousel/Carousel";
import "./Review.css";
import review from "./ReviewImg/review.png";

const Review = () => {
  const [text, setText] = useState({
    name: "Customer name",
    Rating: 0,
    Reviews: "",
    img: "",
  });

  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get("https://reto-india-backend.onrender.com/Review");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setText((prevState) => ({
      ...prevState,
      Reviews: e.target.value,
    }));
  };

  const handleRatingChange = (rating) => {
    setText((prevState) => ({
      ...prevState,
      Rating: rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.Reviews.trim()) {
      toast.error("Please enter a review before submitting.", {
        /* Toast options */
      });
      return;
    }
    if (text.Rating === 0) {
      toast.error("Please select a rating before submitting.", {
        /* Toast options */
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", text.name);
      formData.append("Rating", text.Rating);
      formData.append("Reviews", text.Reviews);

      const fileInput = document.getElementById("file_input");
      if (fileInput.files[0]) {
        formData.append("image", fileInput.files[0]);
      }

      await axios.post("https://reto-india-backend.onrender.com/ReviewText", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Review submitted successfully.", {});
      setText({ name: "Customer name", Rating: 0, Reviews: "", img: "" });
      fetchData();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit the review.", {});
    }
  };

  return (
    <div className="ReviewSection ">
      <div className="ImgReview">
        <img src={review} alt="Review" className="rvw" />
      </div>

      <div className="ReviewText">
        <p className="para">Please Share your Valuable Review</p>

        <div className="mb-12">
          <form
            onSubmit={handleSubmit}
            className="TextAreaBox w-full"
            encType="multipart/form-data"
          >
            <textarea
              id="message"
              rows="4"
              value={text.Reviews}
              onChange={handleChange}
              className="Text_Area block p-2.5 my-2 w-4/5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ms-[-4rem]"
              placeholder="Write your review here..."
            ></textarea>
            <div className="w-full">
              <div className="upper_text">
                <p className="para">Please Rate this product:</p>

                <div className="rating_img w-4 h-4">
                  {[...Array(5)].map((_, index) => (
                    <StarRateIcon
                      key={index}
                      className={`RateStar ${
                        index < text.Rating
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                      onClick={() => handleRatingChange(index + 1)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="UploadBox flex flex-col justify-center w-full">
              <label className="block mb-2  text-gray-900" htmlFor="file_input">
                Upload Image
              </label>
              <div className="w-full ">
                <input
                  className="block w-4/5 text-sm my-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="file_input"
                  type="file"
                />
              </div>
            </div>
            <div className="SubmitBtn w-full">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>

        <div className="ReviewCarousel">
          <div className="text-center">
            <h1>All reviews</h1>
          </div>
          <div className="Crusl my-2">
            <Carousel data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
