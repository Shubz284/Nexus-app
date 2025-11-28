import { useEffect, useState } from "react";
import axiosInstance from "@/api/axios";

const useContent = () => {
  const [contents, setContents] = useState([]);

  function refresh() {
    axiosInstance
      .get(`/auth/content`)
      .then((response) => {
        console.log("Fetched contents:", response.data.content);
        setContents(response.data.content);
      })
      .catch((error) => {
        console.error("Error fetching content:", error); // Log any errors
      });
  }

  useEffect(() => {
    refresh();
    let interval = setInterval(() => {
      refresh();
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { contents, refresh };
};

export default useContent;
