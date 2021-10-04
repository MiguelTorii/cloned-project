import React, { useEffect } from "react";

const Miss = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }, []);
  return <div>Not found. Redirecting...</div>;
};

export default Miss;