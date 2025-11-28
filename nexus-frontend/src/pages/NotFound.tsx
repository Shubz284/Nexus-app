import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <p className="text-xl">Sorry content not found </p>
      <p className="text-xl">
        Go back to <button onClick={() => navigate("/")} className= " cursor-pointer text-sm bg-neutral-800 text-gray-100 rounded-md p-1">Home</button>
      </p>
    </div>
  );
};

export default NotFound;
