"use client";
import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FaQuoteLeft, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

import "swiper/css";

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + (parts.length > 1 ? last : "")).toUpperCase();
};

type Testimonial = {
  name: string;
  position: string;
  review: string;
  rating: number;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Shashank Deep Singh",
    position: "Design Manager (Indore)",
    review: "Rojgari India is one of the best recruitment consultants in India. Their team is very supportive, professional, and helpful throughout the hiring process. They regularly provide job updates and guide candidates at every step.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Rishi Kumar",
    position: "Sr. Quality engineer (Bangalore)",
    review: "I had a very positive experience with Rojgari India. The recruiters understood my profile and shared relevant job openings. Their communication was timely and transparent. They kept me updated at every stage of the recruitment process.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Joshi hirji bhai shivram",
    position: "Warehouse sr. Supervisor (Mundra)",
    review: "Finding the right job became much easier with Rojgari India. The team is knowledgeable, supportive, and genuinely cares about candidates. They provided proper guidance before interviews and followed up regularly.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    name: "Amit ramesh bhavsar",
    position: "Senior electrician (Silvassa)",
    review: "One of the best placement consultants I have come across. The team is friendly, helpful, and quick to respond. They matched my skills with the right opportunity. Very satisfied with their service.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    name: "Shubham bhatt",
    position: "Instrument Engineer (Bhavnagar)",
    review: "I appreciate the efforts of the Rojgari India team in helping me find a suitable job. They were attentive, supportive, and professional throughout the process. The recruiters provided valuable guidance and interview preparation tips.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    name: "Kishan Kumar",
    position: "Sr. Engineer Technical Publication (Bangalore)",
    review: "What I liked most about Rojgari India was their quick response and genuine effort to help candidates. They understood my experience and connected me with suitable opportunities. A very reliable recruitment partner.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    name: "Pushpak Viliya",
    position: "Deputy Manager Warranty (Indore)",
    review: "A professional and supportive recruitment team. They carefully matched my profile with relevant opportunities and assisted me at every step. Great experience overall.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    name: "Sandip Sureshrao Bonlawar",
    position: "Assistant Manager (Pune)",
    review: "Best consultancy, Thank you for your excellent support throughout my job search. Your team was highly professional, communicative, and truly understood my career goals. Because of your dedicated guidance, I secured a great position.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    name: "Vishal Pawar",
    position: "Sr. Engineer design (Nasik)",
    review: "Thank you for your support and guidance throughout the recruitment process. I appreciate your timely communication, coordination, and efforts in helping me secure this opportunity. It was a smooth and professional experience working with you.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    name: "Anirudh Sharma",
    position: "Jobseeker (Uttar Pradesh)",
    review: "Overall experience was good throughout the onboarding process. The team patiently answered all my queries, handled rescheduling my interview professionally when an urgent meeting conflicted, and provided continuous support.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    name: "Vishvjeet Chaudhary",
    position: "SQA Officer (Uttar Pradesh)",
    review: "Rojgari India portal is user-friendly and easy to navigate. It provides relevant job opportunities and keeps candidates updated throughout the recruitment process. The support team is responsive and helpful.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    name: "Rahul S. Ingale",
    position: "Manager RTFE Design (Pune)",
    review: "I had a very good experience with Rojgari India. They provide quality opportunities and genuinely help candidates. From arranging interviews to coordinating with companies and providing updates, they ensure everything is handled smoothly.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    name: "Akshata Padoshi",
    position: "Conceptual Jewelry Designer (Bengaluru)",
    review: "The team was professional, responsive, and helpful throughout the recruitment process. Their communication was timely, and they provided valuable support at every stage.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "Viral H. Sheth",
    position: "Structural Engineer (Vadodara)",
    review: "The staff is very cooperative and knowledgeable. They provide excellent guidance and support throughout the recruitment process.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/14.jpg",
  },
];

const renderStars = (rating: number): React.ReactNode[] => {
  const stars: React.ReactNode[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
  }
  return stars;
};

const Testimonials: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 top-1/4 lg:top-1/2 -translate-y-1/2 -left-[450px] transform bg-[#72B76A]/40 z-0 rounded-t-full w-[550px] h-[550px] rotate-90" />

      <div className="relative py-10 px-5 lg:px-[5%] 2xl:px-[15%] z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] items-center">
          {/* Left copy */}
          <div>
            <p
              className="fontPOP text-[#72B76A] text-sm tracking-widest uppercase"
              style={{ letterSpacing: "1px", lineHeight: 1.3 }}
            >
              Reviews
            </p>

            <p
              className="fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-5 max-w-[500px]"
              style={{
                letterSpacing: "1px",
                wordSpacing: "2px",
                lineHeight: 1.2,
              }}
            >
              Know what our candidates say about us
            </p>

            <p className="my-10 text-gray-600 leading-relaxed">
              Read real reviews and feedback from professionals across India who found their dream jobs and career opportunities through Rojgari India placement services. We pride ourselves on transparent communication, reliable interview coordination, and dedicated onboarding support.
            </p>

            {/* <button
              className="relative left-20 -top-3 sm:left-0 sm:-top-0 mt-8 px-4 h-9 overflow-hidden group border border-[#72B76A] bg-[#72B76A] rounded-lg
                          hover:bg-transparent text-white hover:text-[#72B76A] active:scale-90 transition-all ease-out duration-700 cursor-pointer"
              type="button"
            >
              <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-24 ease" />
              <span className="relative flex gap-2 items-center text-sm font-semibold">
                See More
              </span>
            </button> */}
          </div>

          {/* Right slider */}
          <div className="relative p-10 pb-16">
            <div className="absolute top-0 right-0 w-80 h-full bg-[#72B76A]/80 z-0 rounded-2xl" />

            <Swiper
              direction="vertical"
              slidesPerView={2}
              spaceBetween={10}
              loop
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              modules={[Autoplay]}
              className="h-[520px] w-full relative z-10"
            >
              {testimonials.map((t) => (
                <SwiperSlide key={t.name}>
                  <Link href="/about-us#testimonials" className="block m-5 cursor-pointer">
                    <div className="p-6 bg-white rounded-xl shadow-md text-center transition-shadow duration-300 hover:shadow-lg">
                      <div className="flex justify-end mb-4">
                        {renderStars(t.rating)}
                      </div>

                      <div>
                        <div className="flex gap-5">
                          <div className="w-[70px] h-[70px] rounded-full bg-[#72B76A] flex items-center justify-center text-white font-bold text-xl shrink-0 mr-auto mb-4">
                            {getInitials(t.name)}
                          </div>

                          <div>
                            <FaQuoteLeft className="text-2xl text-green-700" />
                            <p className="text-left text-gray-700 italic my-4 line-clamp-2">
                              {t.review}
                            </p>
                          </div>
                        </div>

                        <p className="font-bold text-left">{t.name}</p>
                        <p className="text-sm text-left text-gray-500">
                          {t.position}
                        </p>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>

    // <div className="relative">
    //   {/* Background Circle */}
    //   <div className="absolute inset-0 top-1/4 lg:top-1/2 -translate-y-1/2 -left-[450px] transform bg-[#72B76A]/40 z-0 rounded-t-full w-[550px] h-[550px] rotate-90" />

    //   {/* Content */}
    //   <div className="relative py-10 pl-5 lg:pl-[10%] 2xl:pl-[15%] pr-12 lg:pr-[14%] z-10">
    //     <div className="grid grid-cols-1 lg:grid-cols-[40%_55%] gap-5 items-center">
    //       {/* Left copy */}
    //       <div>
    //         <p
    //           className="fontPOP text-[#72B76A] text-xs sm:text-sm"
    //           style={{ letterSpacing: "1px", lineHeight: 1.3 }}
    //         >
    //           Reviews
    //         </p>

    //         <p
    //           className="fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-5 max-w-[500px]"
    //           style={{
    //             letterSpacing: "1px",
    //             wordSpacing: "2px",
    //             lineHeight: 1.2,
    //           }}
    //         >
    //           Know what our clients say about us
    //         </p>

    //         <p className="my-10">
    //           Lorem ipsum dolor sit amet, ipsum dolor sit amet Lorem. Lorem
    //           ipsum dolor sit amet, ipsum dolor sit amet Lorem. Lorem ipsum
    //           dolor sit amet, ipsum dolor sit amet Lorem.
    //         </p>

    //         <button
    //           className="relative mt-8 px-4 h-9 overflow-hidden group border border-[#72B76A] bg-[#72B76A] rounded-lg
    //                     hover:bg-transparent text-white hover:text-[#72B76A] active:scale-90 transition-all ease-out duration-700 cursor-pointer"
    //           type="button"
    //         >
    //           <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-24 ease" />
    //           <span className="relative flex gap-2 items-center text-sm font-semibold">
    //             See&nbsp;More
    //           </span>
    //         </button>
    //       </div>

    //       {/* Right slider */}
    //       <div className="relative p-10 pb-16">
    //         <div className="absolute top-0 -right-5 w-80 h-full bg-[#72B76A]/80 z-0 rounded-2xl" />

    //         <Swiper
    //           direction="vertical"
    //           slidesPerView={2}
    //           spaceBetween={10}
    //           loop
    //           autoplay={{ delay: 2500, disableOnInteraction: false }}
    //           modules={[Autoplay]}
    //           className="h-[520px] w-full relative z-10"
    //         >
    //           {testimonials.map((t) => (
    //             <SwiperSlide key={t.name}>
    //               <div className="m-5 p-6 bg-white rounded-l-2xl shadow-md text-center">
    //                 <div className="flex justify-end mb-4">
    //                   {renderStars(t.rating)}
    //                 </div>

    //                 <div>
    //                   <div className="flex gap-5">
    //                     <Link
    //                       href={`/profile/${encodeURIComponent(t.name)}`}
    //                       className="inline-block"
    //                     >
    //                       <Image
    //                         src={t.image}
    //                         alt={t.name}
    //                         width={70}
    //                         height={70}
    //                         className="rounded-full mr-auto mb-4"
    //                       />
    //                     </Link>

    //                     <div>
    //                       <FaQuoteLeft className="text-2xl text-green-700" />
    //                       <p className="text-left text-gray-700 italic my-4 line-clamp-2">
    //                         {t.review}
    //                       </p>
    //                     </div>
    //                   </div>

    //                   <p className="font-bold text-left">{t.name}</p>
    //                   <p className="text-sm text-left text-gray-500">
    //                     {t.position}
    //                   </p>
    //                 </div>
    //               </div>
    //             </SwiperSlide>
    //           ))}
    //         </Swiper>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Testimonials;
