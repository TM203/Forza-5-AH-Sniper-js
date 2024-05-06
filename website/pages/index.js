import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import axios from 'axios'


const Home = () => {
  const [data, setData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/mainData');
        setData(response.data.data);
        console.log(response.data.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <div>
      <Head>
        <title>Forza AH TM203</title>
      </Head>

      <div className="mx-auto max-w-5xl bg-zinc-900 mt-9 rounded-xl m-auto w-[300px] p-5 text-white font-bold">
        {data.length > 0 ? (
          data.map((arrayData, index) => (
            <div key={index} className='' >
              {arrayData[0]} - {arrayData[1]}
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>

    </div>
  );

}

export default Home
