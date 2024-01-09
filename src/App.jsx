import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import './index.css';

const API_URL = 'https://api.unsplash.com/search/photos';
const IMAGES_PER_PAGE = 20;

const App = () => {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchImages();
  }, [page]);


  const fetchImages = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}?query=${searchInput.current.value
        }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${import.meta.env.VITE_API_KEY
        }`
      );
      console.log('data', data);
      setImages(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.log(error);
    }
  };


  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    console.log(searchInput.current.value);
    resetSearch();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };

  console.log('page', page);




  console.log('page', page);

  return (
    <div className="App">

      <div className="grid justify-items-center py-10 ">
        <h1 className="text-3xl font-bold text-amber-600">Image Search</h1>
        <form
          className="flex flex-col justify-center items-center search-section"
          onSubmit={handleSearch}
        >
          <input type="search"
            className="border border-gray rounded-md px-2 py-1 mt-5 w-80 h-10"
            placeholder="Search for images"
            ref={searchInput}
          />

          <button
            type="submit"
            className="bg-amber-600 text-white px-4 py-2 mt-5 rounded-md"
          >
            Search
          </button>
        </form>


        <div className="flex flex-row filters">
          <div
            onClick={() => handleSelection('food')}
            className="bg-amber-600 text-white px-4 py-2 mt-5 m-2 rounded-md cursor-pointer">
            Food
          </div>

          <div
            onClick={() => handleSelection('nature')}
            className="bg-amber-600 text-white px-4 py-2 mt-5 m-2 rounded-md cursor-pointer">
            Nature
          </div>

          <div
            onClick={() => handleSelection('animals')}
            className="bg-amber-600 text-white px-4 py-2 mt-5 m-2 rounded-md cursor-pointer">
            Animals
          </div>

          <div
            onClick={() => handleSelection('sports')}
            className="bg-amber-600 text-white px-4 py-2 mt-5 m-2 rounded-md cursor-pointer">
            Sports
          </div>
        </div>

        {/* images grid */}

        <div className="grid grid-cols-4 gap-4 mt-10 images p-5">
          {images.map((image) => (
            <div key={image.id} className="image-item">
              <img
                key={image.id}
                className="w-full h-full object-cover rounded-md"
                src={image.urls.small}
                alt={image.alt_description}
              />
            </div>
          ))
          }
        </div>

        <div className='buttons flex justify-center mt-10'>
          {page > 1 && (
            <button
              onClick={() => setPage(page - 1)}
              className="bg-amber-600 text-white px-4 py-2 mt-5 m-2 rounded-md cursor-pointer">
              Previous
            </button>
          )}{page < totalPages &&  (
            <button
              onClick={() => setPage(page + 1)}
              className="bg-amber-600 text-white px-4 py-2 mt-5 m-2 rounded-md cursor-pointer">
              Next
            </button>
          )}
        </div>
        {/* load more button */}
        <div className='buttons flex justify-center mt-10'>

        </div>



      </div>

    </div>
  );
};

export default App;