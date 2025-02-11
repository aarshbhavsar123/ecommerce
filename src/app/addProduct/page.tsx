"use client";
import React, { useState } from "react";

const page = () => {
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product:", product);
    console.log("Price:", price);
    console.log("Images:", images);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="ml-4 mr-4">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <h2 className="text-2xl mt-4 font-semibold">Title:</h2>
          <p className="text-gray-500 text-sm">Product Name</p>
          <input
            type="text"
            required
            placeholder="Enter the name of the product"
            className="w-80"
            onChange={(e) => setProduct(e.target.value)}
          />
          <h2 className="text-2xl mt-4 font-semibold">Price</h2>
          <p className="text-gray-500 text-sm">Price of the product</p>
          <input
            type="text"
            placeholder="Enter the price of the product"
            required
            className="w-80"
            onChange={(e) => setPrice(e.target.value)}
          />
          <h2 className="text-2xl mt-4 font-semibold">Photos:</h2>
          <p className="text-gray-500 text-sm">Try to add good amount of photos of your place.</p>
          <div className="inline-flex gap-2">
            <input
              required
              type="file"
              multiple
              onChange={(e) => setImages([...e.target.files])}
            />
          </div>
          <div className="w-full flex justify-center">
            <button 
              type="submit" 
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
