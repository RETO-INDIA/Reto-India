import { IconButton } from "@material-tailwind/react";
import PersonIcon from "@mui/icons-material/Person";
import StarRateIcon from "@mui/icons-material/StarRate";
import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import React, { useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Carousel = ({ data }) => {
  const swiperRef = useRef(null);

  return (
    <div
      className="review_box relative w-4/5 flex justify-center px-2"
      data-carousel="static"
    >
      <div className="relative flex items-center w-full  min-w-85 space-x-4">
        <IconButton
          size="lg"
          variant="text"
          color="blue-gray"
          className="dark"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <NavArrowLeft className="arrow h-7 w-7 -translate-x-0.5 stroke-2 text-black" />
        </IconButton>

        <Swiper
          pagination={{
            clickable: true,
            loop: true,
            dynamicBullets: true,
            renderBullet: (_, className) =>
              `<span class="${className}" style="display: none;"></span>`,
          }}
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="relative rounded-lg w-full"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {data.map((ele, index) => (
            <SwiperSlide key={index} className="select-none">
              <div
                className="scroll_style  duration-1000 flex p-3 rounded-lg text-white flex-shrink-0  h-auto"
                style={{ backgroundColor: "#222831" }}
              >
                <div className="p-3">
                  <div className="customer_section ">
                    <div className="flex align">
                      <PersonIcon className="text-white" />
                      <p className="text-lg px-1 font-semibold">{ele.name}</p>
                    </div>

                    <div className="star_img flex">
                      {Array.from({ length: ele.Rating }, (_, i) => (
                        <StarRateIcon
                          key={i}
                          className="RatingStar text-yellow-400"
                        />
                      ))}
                    </div>

                    <div className="rvText  ">
                      <p className=" py-2 text-sm ">{ele.Reviews}</p>
                    </div>
                    <div className="img_section flex w-full my-2 overflow-auto ">
                      <img
                        src={`https://reto-india-admin-backend.onrender.com${ele.image}`}
                        alt="Uploaded Review"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Right Button */}
        <IconButton
          size="lg"
          variant="text"
          color="blue-gray"
          className="dark"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <NavArrowRight className="arrow h-7 w-7 translate-x-px stroke-2 text-black" />
        </IconButton>
      </div>
    </div>
  );
};

export default Carousel;
