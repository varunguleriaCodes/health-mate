import React from "react";
import { assets } from "../assets/assets_frontend/assets";
const testimonials = [
  {
    name: "Jacob Jones",
    role: "Freelance React Developer",
    comment:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    rating: 5,
    avatar: assets.doc1, // Replace with real image
  },
  {
    name: "Leslie Alexander",
    role: "Digital Marketer",
    comment:
      "Lorem Ipsum When an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.",
    rating: 5,
    avatar: assets.doc2,
  },
  {
    name: "John Wilson",
    role: "Graphic Designer",
    comment:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old",
    rating: 5,
    avatar: assets.doc3,
  },
];

const Testimonials = () => {
  return (
    <section className="py-12 bg-gray-50 text-center font-sans">
      <h2 className="text-3xl font-bold text-gray-800">Our happy customers say about us</h2>
      <p className="text-gray-500 mt-2">2,157 people have said how good healthmate is</p>

      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="w-full sm:w-96 bg-white shadow-lg rounded-lg p-6 text-left"
          >
            <div className="flex items-center mb-3">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-600 mb-4">&quot;{testimonial.comment}&quot;</p>
            <div className="flex items-center gap-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="text-gray-800 font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
