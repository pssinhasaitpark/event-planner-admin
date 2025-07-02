import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeData } from "../../redux/slice/homeSlice";

function Home() {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector((state) => state.home);
  const dataArray = Array.isArray(data) ? data : [data];

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Home Page</h1>
      {data ? (
        <div>
          {dataArray?.map((item, index) => (
            <div key={index}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>

              {console.log("item:", item.image1[0].url)}
              {item.image1?.map((img, index) => {
                return <img key={index} src={img.url} alt="" />;
              })}
            </div>
          ))}
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
}

export default Home;
