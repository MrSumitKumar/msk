import { useEffect } from "react";

const Reviews = () => {
  useEffect(() => {
    // Load Elfsight script only once
    const scriptId = "elfsight-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.async = true;
      script.id = scriptId;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="bg-dark p-4 rounded-2xl shadow-md my-6">
      <div className="elfsight-app-8a50ae6e-94c3-4056-bdc4-b504fcbce85a"
        data-elfsight-app-lazy
      ></div>
    </div>
  );
};

export default Reviews;
